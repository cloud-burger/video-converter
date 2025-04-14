-- cria banco de dados
CREATE DATABASE video_converter;

-- conecta no banco criado
\c video_converter;

-- define schema como padrão
SET search_path TO public;

-- criação da tabela videos
CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR(100) PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_frames_url VARCHAR(500)
);

-- (opcional) index para facilitar buscas por user_id
CREATE INDEX IF NOT EXISTS videos_user_id_index ON public.videos USING btree (user_id);


-- inserções exemplo na tabela videos
INSERT INTO videos VALUES (
    'a1f5e590-d645-4cfa-b879-5ecddb2f59e1',
    now(), now(),
    'PROCESSING',
    '5c1c5144-be00-4f01-8853-2f37cca74465',
    'joao.silva@example.com',
    'video1.mp4',
    'https://s3.amazonaws.com/mybucket/video1.mp4',
    null
);

INSERT INTO videos VALUES (
    'c5b8f0c4-aef4-4a45-8aa1-75b6a1c5c7c7',
    now(), now(),
    'COMPLETED',
    '982ad0de-eb12-47f9-8cd1-8e2055d7f87a',
    'carlos.souza@example.com',
    'video2.mp4',
    'https://s3.amazonaws.com/mybucket/video2.mp4',
    'https://s3.amazonaws.com/mybucket/video2_frames.json'
);

INSERT INTO videos VALUES (
    'f872c2ba-3f55-41d2-9d2a-9e94a4e2c9d3',
    now(), now(),
    'FAILED',
    'bba39fad-9d9b-4802-823f-8ce288175cc3',
    'ana.costa@example.com',
    'video3.mp4',
    'https://s3.amazonaws.com/mybucket/video3.mp4',
    null
);