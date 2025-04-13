import { Entity, EntityProps } from '../core/entities/entity';

export interface ImagesProps extends EntityProps {
  userId: string;
  filename: string;
  url: string;
}

export class Images extends Entity {
  userId: string;
  filename: string;
  url: string;
  
  constructor(input: ImagesProps) {
    super(input.id);

    Object.assign(this, input);
  }
}
