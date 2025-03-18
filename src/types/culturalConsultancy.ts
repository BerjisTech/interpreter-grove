
export interface CulturalResource {
  id: string;
  title: string;
  description: string;
  culture: string;
  category: 'business' | 'social' | 'traditions' | 'etiquette' | 'general';
  image: string;
  content?: string;
  isFeatured?: boolean;
  tags?: string[];
}

export interface ConsultantProfile {
  id: string;
  name: string;
  image: string;
  cultures: string[];
  languages: string[];
  expertise: string[];
  rating: number;
  reviews: number;
  availability: string;
  hourlyRate: number;
  online: boolean;
}
