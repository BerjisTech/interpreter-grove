
export interface LearningResource {
  id: string;
  title: string;
  description: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  type: 'video' | 'article' | 'exercise' | 'course';
  duration: number; // in minutes
  image: string;
  url: string;
  isFeatured?: boolean;
  tags?: string[];
}

export interface LearningProgress {
  resourceId: string;
  userId: string;
  completed: boolean;
  progress: number; // percentage
  lastAccessed: Date;
}
