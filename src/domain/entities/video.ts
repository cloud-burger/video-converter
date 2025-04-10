import { Entity, EntityProps } from '../core/entities/entity';
import { VideoStatus } from './enums/video-status';
import { Url } from './value-objects/url';
import { User } from './value-objects/user';

export interface VideoProps extends EntityProps {
  user: User;
  filename: string;
  url: Url;
  status: VideoStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Video extends Entity {
  user: User;
  filename: string;
  url: Url;
  status: VideoStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(input: VideoProps) {
    super(input.id);

    input.createdAt = input.createdAt ?? new Date();
    input.updatedAt = input.updatedAt ?? new Date();

    Object.assign(this, input);
  }

  updateStatus(newStatus: VideoStatus) {
    this.status = newStatus;
  }
}
