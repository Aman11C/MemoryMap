import { createClient } from "@/lib/supabase/client";
import { extractPhotoMetadata } from "@/lib/exif";

export interface DatabasePhoto {
  id: string;
  memory_id: string | null;
  user_id: string;
  storage_path: string;
  image_url: string;
  original_filename: string | null;
  captured_at: string | null;
  latitude: number | null;
  longitude: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DatabasePerson {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface DatabaseMemory {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  date: string;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  activity: string | null;
  mood: string | null;
  tags: string[];
  created_at: string;
  photos: DatabasePhoto[];
  people: DatabasePerson[];
}

export interface CreateMemoryInput {
  userId: string;
  title: string;
  description?: string;
  date: string;
  locationName?: string;
  latitude?: number | null;
  longitude?: number | null;
  activity?: string;
  mood?: string;
  tags?: string[];
  peopleNames?: string[];
  photoFiles: File[];
  onProgress?: (progress: number, statusText: string) => void;
}

export interface UpdateMemoryInput {
  title: string;
  description?: string;
  date: string;
  locationName?: string;
  latitude?: number | null;
  longitude?: number | null;
  activity?: string;
  mood?: string;
  tags?: string[];
  peopleNames?: string[];
}

/**
 * Fetch all memories belonging to current user with their photos and companions
 */
export async function fetchUserMemories(userId: string): Promise<DatabaseMemory[]> {
  const supabase = createClient();
  if (!supabase) return [];

  try {
    // 1. Fetch memories
    const { data: rawMemories, error: memError } = await supabase
      .from("memories")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (memError || !rawMemories) {
      console.error("Error fetching memories:", memError);
      return [];
    }

    if (rawMemories.length === 0) {
      return [];
    }

    const memoryIds = rawMemories.map((m) => m.id);

    // 2. Fetch photos for these memories
    const { data: rawPhotos } = await supabase
      .from("photos")
      .select("*")
      .in("memory_id", memoryIds);

    const photosByMemoryId = new Map<string, DatabasePhoto[]>();
    (rawPhotos || []).forEach((p) => {
      if (!p.memory_id) return;
      const list = photosByMemoryId.get(p.memory_id) || [];
      list.push({
        id: p.id,
        memory_id: p.memory_id,
        user_id: p.user_id,
        storage_path: p.storage_path,
        image_url: p.image_url,
        original_filename: p.original_filename,
        captured_at: p.captured_at,
        latitude: p.latitude,
        longitude: p.longitude,
        metadata: (p.metadata as Record<string, unknown>) || {},
        created_at: p.created_at,
      });
      photosByMemoryId.set(p.memory_id, list);
    });

    // 3. Fetch people linked via memory_people
    const { data: rawMemoryPeople } = await supabase
      .from("memory_people")
      .select("memory_id, person_id, people (id, name, avatar_url)")
      .in("memory_id", memoryIds);

    const peopleByMemoryId = new Map<string, DatabasePerson[]>();
    (rawMemoryPeople || []).forEach((mp) => {
      const list = peopleByMemoryId.get(mp.memory_id) || [];
      const personData = Array.isArray(mp.people) ? mp.people[0] : mp.people;
      if (personData && typeof personData === "object" && "id" in personData) {
        list.push({
          id: personData.id as string,
          name: personData.name as string,
          avatar_url: (personData.avatar_url as string | null) || null,
        });
      }
      peopleByMemoryId.set(mp.memory_id, list);
    });

    // 4. Combine into complete models
    return rawMemories.map((m) => {
      // Parse tags gracefully (supports text[] column or fallback)
      let tagsArray: string[] = [];
      const rawTags = (m as Record<string, unknown>).tags;
      if (Array.isArray(rawTags)) {
        tagsArray = rawTags.map(String);
      } else if (typeof rawTags === "string" && rawTags.trim()) {
        try {
          tagsArray = JSON.parse(rawTags);
        } catch {
          tagsArray = rawTags.split(",").map((s: string) => s.trim());
        }
      }

      return {
        id: m.id,
        user_id: m.user_id,
        title: m.title,
        description: m.description,
        date: m.date,
        location_name: m.location_name,
        latitude: m.latitude,
        longitude: m.longitude,
        activity: m.activity,
        mood: m.mood,
        tags: tagsArray,
        created_at: m.created_at,
        photos: photosByMemoryId.get(m.id) || [],
        people: peopleByMemoryId.get(m.id) || [],
      };
    });
  } catch (err) {
    console.error("fetchUserMemories failure:", err);
    return [];
  }
}

/**
 * Fetch a single memory by ID with full details
 */
export async function fetchUserMemoryById(
  memoryId: string
): Promise<DatabaseMemory | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data: mem, error } = await supabase
      .from("memories")
      .select("*")
      .eq("id", memoryId)
      .single();

    if (error || !mem) return null;

    const { data: rawPhotos } = await supabase
      .from("photos")
      .select("*")
      .eq("memory_id", memoryId)
      .order("created_at", { ascending: true });

    const { data: rawMemoryPeople } = await supabase
      .from("memory_people")
      .select("memory_id, person_id, people (id, name, avatar_url)")
      .eq("memory_id", memoryId);

    const people: DatabasePerson[] = [];
    (rawMemoryPeople || []).forEach((mp) => {
      const personData = Array.isArray(mp.people) ? mp.people[0] : mp.people;
      if (personData && typeof personData === "object" && "id" in personData) {
        people.push({
          id: personData.id as string,
          name: personData.name as string,
          avatar_url: (personData.avatar_url as string | null) || null,
        });
      }
    });

    let tagsArray: string[] = [];
    const rawTags = (mem as Record<string, unknown>).tags;
    if (Array.isArray(rawTags)) {
      tagsArray = rawTags.map(String);
    } else if (typeof rawTags === "string" && rawTags.trim()) {
      try {
        tagsArray = JSON.parse(rawTags);
      } catch {
        tagsArray = rawTags.split(",").map((s: string) => s.trim());
      }
    }

    return {
      id: mem.id,
      user_id: mem.user_id,
      title: mem.title,
      description: mem.description,
      date: mem.date,
      location_name: mem.location_name,
      latitude: mem.latitude,
      longitude: mem.longitude,
      activity: mem.activity,
      mood: mem.mood,
      tags: tagsArray,
      created_at: mem.created_at,
      photos: (rawPhotos || []).map((p) => ({
        id: p.id,
        memory_id: p.memory_id,
        user_id: p.user_id,
        storage_path: p.storage_path,
        image_url: p.image_url,
        original_filename: p.original_filename,
        captured_at: p.captured_at,
        latitude: p.latitude,
        longitude: p.longitude,
        metadata: (p.metadata as Record<string, unknown>) || {},
        created_at: p.created_at,
      })),
      people,
    };
  } catch {
    return null;
  }
}

/**
 * Upload photos, extract EXIF metadata, and insert memory + photos + people
 */
export async function createMemoryWithPhotos(
  input: CreateMemoryInput
): Promise<{ success: boolean; memoryId?: string; error?: string }> {
  const supabase = createClient();
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized." };
  }

  const {
    userId,
    title,
    description = "",
    date,
    locationName = "",
    latitude = null,
    longitude = null,
    activity = "Travel",
    mood = "",
    tags = [],
    peopleNames = [],
    photoFiles,
    onProgress,
  } = input;

  try {
    if (onProgress) onProgress(10, "Creating memory record...");

    // 1. Insert into memories table
    let memoryRow: { id: string } | null = null;

    // Try insert with tags
    const memInsertPayload: Record<string, unknown> = {
      user_id: userId,
      title,
      description: description || null,
      date,
      location_name: locationName || null,
      latitude,
      longitude,
      activity: activity || null,
      mood: mood || null,
    };

    // Test if tags column can be inserted
    if (tags && tags.length > 0) {
      memInsertPayload.tags = tags;
    }

    let insertRes = await supabase
      .from("memories")
      .insert(memInsertPayload as never)
      .select("id")
      .single();

    // If tags column error, retry without tags column
    if (insertRes.error && insertRes.error.message.includes("column")) {
      delete memInsertPayload.tags;
      insertRes = await supabase
        .from("memories")
        .insert(memInsertPayload as never)
        .select("id")
        .single();
    }

    if (insertRes.error || !insertRes.data) {
      throw new Error(insertRes.error?.message || "Failed to create memory record");
    }

    memoryRow = insertRes.data as { id: string };
    const memoryId = memoryRow.id;

    // 2. Upload photos and extract EXIF metadata
    const totalPhotos = photoFiles.length;
    for (let i = 0; i < totalPhotos; i++) {
      const file = photoFiles[i];
      const stepPercent = 20 + Math.round(((i + 1) / totalPhotos) * 60);

      if (onProgress) {
        onProgress(
          stepPercent,
          `Processing photo ${i + 1} of ${totalPhotos}: ${file.name}...`
        );
      }

      // Extract EXIF
      const exif = await extractPhotoMetadata(file);

      // Safe clean filename
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storagePath = `${userId}/${memoryId}/${Date.now()}-${cleanFileName}`;

      let imageUrl = "";

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("memory-photos")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.warn(
          "Supabase storage upload error:",
          uploadError.message,
          "— creating fallback preview URL"
        );
        // Fallback: create an object URL or data URL so photo is not lost
        imageUrl = URL.createObjectURL(file);
      } else {
        // Retrieve public URL
        const { data: publicUrlData } = supabase.storage
          .from("memory-photos")
          .getPublicUrl(storagePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // Insert photo record in photos table
      await supabase.from("photos").insert({
        memory_id: memoryId,
        user_id: userId,
        storage_path: storagePath,
        image_url: imageUrl,
        original_filename: file.name,
        captured_at: exif.captureTime,
        latitude: exif.latitude ?? latitude,
        longitude: exif.longitude ?? longitude,
        metadata: {
          cameraMake: exif.cameraMake,
          cameraModel: exif.cameraModel,
          lensModel: exif.lensModel,
          iso: exif.iso,
          fNumber: exif.fNumber,
          focalLength: exif.focalLength,
          exposureTime: exif.exposureTime,
          sizeBytes: file.size,
          mimeType: file.type,
        },
      });
    }

    // 3. Link People
    if (peopleNames && peopleNames.length > 0) {
      if (onProgress) onProgress(85, "Linking companions...");

      for (const name of peopleNames) {
        const trimmedName = name.trim();
        if (!trimmedName) continue;

        // Check if person exists
        let personId: string | null = null;
        const { data: existingPerson } = await supabase
          .from("people")
          .select("id")
          .eq("user_id", userId)
          .ilike("name", trimmedName)
          .maybeSingle();

        if (existingPerson) {
          personId = existingPerson.id;
        } else {
          // Insert new person
          const { data: newPerson } = await supabase
            .from("people")
            .insert({
              user_id: userId,
              name: trimmedName,
            })
            .select("id")
            .single();

          if (newPerson) personId = newPerson.id;
        }

        // Link in junction table
        if (personId) {
          await supabase
            .from("memory_people")
            .insert({
              memory_id: memoryId,
              person_id: personId,
            })
            .select();
        }
      }
    }

    if (onProgress) onProgress(100, "Memory preserved successfully!");

    return { success: true, memoryId };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("createMemoryWithPhotos error:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Update an existing memory
 */
export async function updateMemory(
  memoryId: string,
  input: UpdateMemoryInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  if (!supabase) return { success: false, error: "Supabase not connected" };

  try {
    const updatePayload: Record<string, unknown> = {
      title: input.title,
      description: input.description || null,
      date: input.date,
      location_name: input.locationName || null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      activity: input.activity || null,
      mood: input.mood || null,
    };

    if (input.tags) {
      updatePayload.tags = input.tags;
    }

    let { error } = await supabase
      .from("memories")
      .update(updatePayload as never)
      .eq("id", memoryId);

    if (error && error.message.includes("column")) {
      delete updatePayload.tags;
      const retry = await supabase
        .from("memories")
        .update(updatePayload as never)
        .eq("id", memoryId);
      error = retry.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMsg };
  }
}

/**
 * Delete a memory and all its associated photos and storage objects
 */
export async function deleteMemory(
  memoryId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  if (!supabase) return { success: false, error: "Supabase not connected" };

  try {
    // 1. Fetch photo storage paths to clean up
    const { data: photos } = await supabase
      .from("photos")
      .select("storage_path")
      .eq("memory_id", memoryId);

    if (photos && photos.length > 0) {
      const pathsToDelete = photos
        .map((p) => p.storage_path)
        .filter((p) => Boolean(p) && !p.startsWith("http") && !p.startsWith("blob:"));

      if (pathsToDelete.length > 0) {
        await supabase.storage.from("memory-photos").remove(pathsToDelete);
      }
    }

    // 2. Delete memory row (cascades to photos & memory_people in PostgreSQL)
    const { error } = await supabase.from("memories").delete().eq("id", memoryId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMsg };
  }
}

/**
 * Delete a single photo from a memory
 */
export async function deletePhoto(
  photoId: string,
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  if (!supabase) return { success: false, error: "Supabase not connected" };

  try {
    // 1. Delete from database
    const { error: dbError } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoId);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    // 2. Delete from storage if valid path
    if (storagePath && !storagePath.startsWith("http") && !storagePath.startsWith("blob:")) {
      await supabase.storage.from("memory-photos").remove([storagePath]);
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMsg };
  }
}
