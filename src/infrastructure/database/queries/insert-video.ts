export const INSERT_VIDEO = (columns: string, params: string) =>
  `INSERT INTO public.videos (${columns}) VALUES (${params})`;
