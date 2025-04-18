import { VideoPaginationParams } from '~/domain/repositories/video';

export const FIND_MANY = (input: VideoPaginationParams) => {
  let clauses = '';

  if (input.status) {
    clauses = clauses.concat('AND v.status = :status');
  }

  return `SELECT *
          FROM public.videos v
          WHERE v.user_id=:userId ${clauses}
          ORDER BY v.created_at DESC
          LIMIT :size::numeric
          OFFSET (:page::numeric) * (:size::numeric - 1);`;
};
