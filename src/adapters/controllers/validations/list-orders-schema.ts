import Joi from 'joi';
import { VideoStatus } from '~/domain/entities/enums/video-status';

export const listVideosSchema = Joi.object({
  pageSize: Joi.number().required().min(1).label('Page size'),
  pageNumber: Joi.number().required().min(1).label('Page number'),
  status: Joi.string().valid(...Object.values(VideoStatus)),
}).required();
