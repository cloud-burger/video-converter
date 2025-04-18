export interface VideoResponse {
  id: string;
  user: {
    id: string;
    email: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}
