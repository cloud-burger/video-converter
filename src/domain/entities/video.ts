import { Entity, EntityProps } from '../core/entities/entity';
import { VideoStatus } from './enums/video-status';
import { File } from './value-objects/file';
import { User } from './value-objects/user';

export interface VideoProps extends EntityProps {
  user: User;
  file: File;
  status?: VideoStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Video extends Entity {
  user: User;
  file: File;
  status: VideoStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(input: VideoProps) {
    super(input.id);

    input.createdAt = input.createdAt ?? new Date();
    input.updatedAt = input.updatedAt ?? new Date();
    input.status = input.status ?? VideoStatus.WAITING_UPLOAD;

    Object.assign(this, input);
  }

  updateStatus(newStatus: VideoStatus) {
    this.status = newStatus;
  }

  getVideoKey() {
    return this.file.video;
  }

  getFramesKey() {
    return this.file.frames;
  }
}
