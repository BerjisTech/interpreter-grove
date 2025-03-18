
export interface Interpreter {
  id: string;
  name: string;
  languages: string[];
  rating: number;
  reviews: number;
  availability: string;
  image: string;
  specialties: string[];
  online: boolean;
  isNative: boolean;
  jobsCompleted: number;
  hoursCompleted: number;
  type: 'freelance' | 'agency';
}
