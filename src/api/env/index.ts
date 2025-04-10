import Joi from 'joi';
import process from 'node:process';

interface EnvSchemaProps {
  DYNAMO_TABLE_VIDEO_UPLOADS: string;
}

export const envSchema = Joi.object({
  DYNAMO_TABLE_VIDEO_UPLOADS: Joi.string().required(),
});

const { value } = envSchema.validate(process.env);

export const env = value as EnvSchemaProps;
