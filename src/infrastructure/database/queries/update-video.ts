export const UPDATE_VIDEO = `UPDATE public.videos SET status=:status, file_frames_key=:file_frames_key, updated_at=:updated_at WHERE id=:id and user_id=:user_id;`;
