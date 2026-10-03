import exifr from "exifr";

export interface ExtractedPhotoMetadata {
  captureDate: string | null; // Format YYYY-MM-DD
  captureTime: string | null; // ISO string
  latitude: number | null;
  longitude: number | null;
  cameraMake: string | null;
  cameraModel: string | null;
  lensModel: string | null;
  iso: number | null;
  fNumber: number | null;
  focalLength: number | null;
  exposureTime: string | null;
  raw: Record<string, unknown>;
}

export async function extractPhotoMetadata(
  file: File
): Promise<ExtractedPhotoMetadata> {
  const defaultMeta: ExtractedPhotoMetadata = {
    captureDate: null,
    captureTime: null,
    latitude: null,
    longitude: null,
    cameraMake: null,
    cameraModel: null,
    lensModel: null,
    iso: null,
    fNumber: null,
    focalLength: null,
    exposureTime: null,
    raw: {},
  };

  try {
    // Only attempt EXIF parsing on image types
    if (!file.type.startsWith("image/")) {
      return defaultMeta;
    }

    const output = await exifr.parse(file, {
      gps: true,
      tiff: true,
      exif: true,
      iptc: true,
      icc: false,
    });

    if (!output) {
      return defaultMeta;
    }

    let captureDate: string | null = null;
    let captureTime: string | null = null;

    const rawDate = output.DateTimeOriginal || output.CreateDate || output.ModifyDate;
    if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
      captureTime = rawDate.toISOString();
      const year = rawDate.getFullYear();
      const month = String(rawDate.getMonth() + 1).padStart(2, "0");
      const day = String(rawDate.getDate()).padStart(2, "0");
      captureDate = `${year}-${month}-${day}`;
    }

    let latitude: number | null = null;
    let longitude: number | null = null;

    if (
      typeof output.latitude === "number" &&
      typeof output.longitude === "number" &&
      !isNaN(output.latitude) &&
      !isNaN(output.longitude)
    ) {
      latitude = Number(output.latitude.toFixed(6));
      longitude = Number(output.longitude.toFixed(6));
    }

    let exposureTime: string | null = null;
    if (output.ExposureTime) {
      if (typeof output.ExposureTime === "number" && output.ExposureTime < 1) {
        exposureTime = `1/${Math.round(1 / output.ExposureTime)}s`;
      } else {
        exposureTime = `${output.ExposureTime}s`;
      }
    }

    return {
      captureDate,
      captureTime,
      latitude,
      longitude,
      cameraMake: output.Make ? String(output.Make).trim() : null,
      cameraModel: output.Model ? String(output.Model).trim() : null,
      lensModel: output.LensModel ? String(output.LensModel).trim() : null,
      iso: output.ISO ? Number(output.ISO) : null,
      fNumber: output.FNumber ? Number(output.FNumber) : null,
      focalLength: output.FocalLength ? Number(output.FocalLength) : null,
      exposureTime,
      raw: output,
    };
  } catch (err) {
    // Graceful fallback: never invent metadata
    console.warn("EXIF extraction notice: no readable metadata found in", file.name, err);
    return defaultMeta;
  }
}
