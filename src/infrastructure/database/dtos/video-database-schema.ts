export interface VideoDatabaseSchema {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  user_id: string;
  user_email: string;
  file_key: string;
  file_frames_key: string;
}
