export interface Person {
  id: string;
  name: string;
  relationship: string;
  avatar: string;
  memoryCount: number;
}

export interface Place {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  memoryCount: number;
  coverImage: string;
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  locationName: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  coverImage: string;
  images: string[];
  tags: string[];
  people: Person[];
  isFavorite?: boolean;
  category: "travel" | "nature" | "family" | "milestone" | "everyday";
  year: number;
  month: string;
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  coverImage: string;
  memoryCount: number;
  readTime: string;
  accentColor?: string;
  summary: string;
  places: string[];
}
