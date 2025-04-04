# 📹 Video Upload & Screenshot Service

Este projeto é um serviço **serverless** escrito em **TypeScript** e baseado na **Arquitetura Hexagonal (Ports & Adapters)**. Ele permite o **upload de vídeos**, gera **screenshots automáticas a cada 10 minutos**, compacta as imagens em um `.zip` e armazena no **Amazon S3**. O status do processamento e os arquivos são monitorados via **API Gateway** com autenticação via **Cognito**.

---

## 🚀 Funcionalidades

- Upload de vídeos via URL temporária.
- Extração de screenshots a cada 10 minutos do vídeo.
- Compactação automática das imagens geradas.
- Armazenamento no **Amazon S3**.
- Registro de status e URLs no **DynamoDB**.
- Notificações de erro via **SNS**.
- Autenticação de usuários com **Amazon Cognito**.
- Processamento assíncrono com funções **AWS Lambda**.

---

## ⚙️ Arquitetura

Este projeto segue o padrão **Hexagonal Architecture (Ports & Adapters)**, favorecendo:

- Separação clara entre regras de negócio e infraestrutura.
- Facilidade de testes unitários e integração.
- Substituição simples de adaptadores externos (ex: S3, SNS, Dynamo).

### Principais serviços utilizados:

| Serviço       | Finalidade                                                                 |
|---------------|-----------------------------------------------------------------------------|
| **API Gateway** | Gerenciar os endpoints REST do sistema                                     |
| **Lambda**      | Executar os fluxos de negócio                                              |
| **S3**          | Armazenar os vídeos e os arquivos `.zip` com screenshots                  |
| **DynamoDB**    | Armazenar status de processamento e URLs dos vídeos                       |
| **Cognito**     | Gerenciar autenticação e autorização dos usuários                         |
| **SNS**         | Enviar notificações em caso de erro no processamento                      |

---

## 🧠 Lambdas do Projeto

| Lambda               | Responsabilidade                                                      |
|----------------------|-----------------------------------------------------------------------|
| `create-s3-url`      | Gera URL temporária (signed URL) para upload do vídeo                |
| `get-video`          | Recupera vídeo processado e seus dados                                |
| `get-status`         | Lista vídeos processados com seus respectivos status e links          |
| `converter-video`    | Extrai screenshots, compacta as imagens e salva no S3                 |
| `video-notify-error` | Notifica falhas no processo de conversão via SNS                     |

---

## 📡 Endpoints da API

> Todos os endpoints são protegidos via **Amazon Cognito**.

| Método | Caminho                      | Descrição                                     | Lambda               |
|--------|------------------------------|-----------------------------------------------|----------------------|
| `GET`  | `/videos/upload`             | Gera uma URL temporária para upload           | `create-s3-url`      |
| `PUT`  | `S3 signed URL`              | Upload direto do vídeo para o bucket          | -                    |
| `GET`  | `/videos/processed/{id}`     | Baixa o vídeo processado                      | `get-video`          |
| `GET`  | `/videos/list`               | Lista vídeos processados com status/URL       | `get-status`         |

---

## 📁 Estrutura de Pastas

```
src/
├── domain/
│   └── entities, value-objects, interfaces
├── application/
│   └── usecases, services
├── adapters/
│   └── controllers, gateways (s3, dynamo, sns)
├── infrastructure/
│   └── lambdas, configs, AWS clients
├── api/
│   └── server.ts (usado para testes e execução local via Express)
```

---

## 📦 Dependências Relevantes

### 🧱 AWS SDK & Serverless

- **`serverless`**: framework principal para deploy das funções Lambda.
- **`serverless-esbuild`**: empacotamento rápido e eficiente das funções.
- **`@aws-sdk/client-s3`, `dynamodb`, `sns`**: SDK modular AWS.
- **`serverless-offline`**: execução local para desenvolvimento/testes.

### 🧪 Testes

- **`jest`, `ts-jest`**: ambiente de testes com TypeScript.
- **`aws-sdk-client-mock`**: mocking das chamadas AWS para testes unitários.
- **`jest-mock-extended`**: mocks tipados.

### 💅 Lint e formatação

- **`eslint`, `prettier`**: padrões de qualidade e estilo do código.

---

## ▶️ Executando localmente

```bash
# Instale as dependências
npm install

# Execute o servidor Express local para testes
npm run dev

# Execute a stack localmente com API Gateway simulado
npx serverless offline
```

---

## ✅ Testes

```bash
npm run test
```

---

## ☁️ Deploy na AWS

```bash
npx serverless deploy
```

---

## 📬 Notificações

Falhas no processamento são enviadas via **SNS**, com payloads informando ID do vídeo, erro e timestamp.

---

## 📄 Licença

Projeto licenciado sob a **ISC License**.