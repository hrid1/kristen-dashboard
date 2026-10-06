export interface MeditationItem {
  id: string;
  meditation_name: string;
  meditation_description: string;
  meditation_audio: string;
  duration: string | null;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;

  listenersCount?: number;
  isFav?: boolean;
}

export interface MeditationsResponse {
  success: boolean;
  message: string;
  data: MeditationItem[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}