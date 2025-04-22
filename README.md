# 📹 Video Upload & Screenshot Service

Este projeto é um serviço **serverless** escrito em **TypeScript** e baseado na **Arquitetura Limpa (Clean Architecture)**. Ele permite o **upload de vídeos**, gera **screenshots automáticas a cada 20 segundos**, compacta as imagens em um `.zip` e armazena no **Amazon S3**. O status do processamento e os arquivos são monitorados via **API Gateway** com autenticação via **Cognito**.

---

## 🚀 Funcionalidades

- Upload de vídeos via URL temporária.
- Extração de screenshots a cada 20 segundos do vídeo.
- Compactação automática das imagens geradas.
- Armazenamento no **Amazon S3**.
- Registro de status e dados do vídeo no **PostgreSQL**.
- Trigger para notificações usando **SQS**.
- Envio das notificações aos usuários usando SMTP.
- Armazenamento das notificações no **DynamoDB**.
- Autenticação de usuários com **Amazon Cognito**.
- Processamento assíncrono com funções **AWS Lambda**.

---

## ⚙️ Arquitetura

Este projeto segue o padrão **Clean Architecture**, favorecendo:

- Separação clara entre regras de negócio e infraestrutura.
- Facilidade de testes unitários e integração.
- Substituição simples de adaptadores externos (ex: S3, PostgreSQL, Dynamo).

Segue imagem com o desenho da arquitetura utilizada:
![infra_cloud_burger-Arquitetura fase 5 drawio (1)](https://github.com/user-attachments/assets/9dd9f211-6eb8-4ce9-a076-0ecd4a3b7f41)


### Principais serviços utilizados:

| Serviço       | Finalidade                                                                 |
|---------------|-----------------------------------------------------------------------------|
| **API Gateway** | Gerenciar os endpoints REST do sistema                                     |
| **Lambda**      | Executar os fluxos de negócio                                              |
| **S3**          | Armazenar os vídeos e os arquivos `.zip` com screenshots                  |
| **PosgreSQL**    | Armazenar status de processamento e URLs dos vídeos                       |
| **DynamoDB**    | Armazenar notificações enviadas                                           |
| **Cognito**     | Gerenciar autenticação e autorização dos usuários                         |
| **SQS**         | Trigger da lambda para notificação de sucesso ou erro no processamento    |

### Fluxos
- **Autenticação:** Todos os endpoints da aplicação são autenticados via AWS Cognito. Utilizamos o sub (ID do usuário) e o e-mail presentes nas claims do token JWT para identificar o usuário e armazenar os objetos no prefixo apropriado no S3. O ID do usuário é incluído no prefixo para garantir o isolamento dos arquivos, impedindo que um usuário acesse vídeos ou arquivos ZIP de outro.
- **Inserindo um novo vídeo:** O endpoint configurado no API Gateway aciona a função Lambda `video-converter-get-video-url-prod`. Essa função é responsável por registrar um novo vídeo no banco de dados PostgreSQL com o status `WAITING_UPLOAD` e por gerar uma URL pré-assinada para envio do vídeo ao S3 via requisição HTTP PUT. O upload é feito diretamente ao S3, para evitar as limitações de tamanho de payload impostas pelo API Gateway. O vídeo é armazenado no bucket do S3 com a key: `videos/{id_usuario}/{id_video}.mp4`.
- **Processamento dos vídeos:** A função Lambda `video-converter-process-video-prod` é acionada automaticamente quando um novo vídeo é armazenado no S3. O processamento começa com a atualização do status do vídeo no PostgreSQL para `PROCESSING`. Em seguida, são geradas imagens do vídeo a cada 20 segundos. Após o término, o status é atualizado para `PROCESSED`, o arquivo ZIP contendo as imagens é salvo no S3 e uma notificação é enviada ao SQS. Em caso de falha, o status é alterado para `FAILED` e a notificação correspondente também é publicada no SQS. O ZIP é armazenado no bucket do S3 com a key: `frames/{id_usuario}/{id_video}.zip`.
- **Obtenção do arquivo zip:**  O endpoint configurado no API Gateway recebe o ID do vídeo e aciona a função Lambda `video-converter-get-video-frames-url-prod`. Essa função gera uma URL pré-assinada para download do arquivo ZIP no S3 e busca os metadados do vídeo no PostgreSQL.
- **Listar os vídeos:**  O endpoint correspondente aciona a função Lambda `video-converter-list-videos-prod`, que consulta no PostgreSQL os vídeos associados ao usuário autenticado, identificado por meio do token JWT da requisição.
- **Notificação:** A função Lambda responsável por esse fluxo é acionada ao receber eventos no SQS. Ela envia um e-mail via SMTP ao usuário, informando o sucesso ou falha no processamento do vídeo. Além disso, armazena um registro da notificação no DynamoDB para fins de histórico.
---

## 🧠 Lambdas do Projeto

| Lambda                                      | Responsabilidade                                                      |
|---------------------------------------------|-----------------------------------------------------------------------|
| `video-converter-get-video-url-prod`        | Gera URL temporária (signed URL) para upload do vídeo                 |
| `video-converter-get-video-frames-url-prod` | Recupera URL para download do ZIP com frames do vídeo processado      |
| `video-converter-list-videos-prod`          | Lista vídeos com seus respectivos status e dados                      |
| `video-converter-process-video-prod`        | Extrai screenshots, compacta as imagens e salva no S3                 |
| `video-notification-prod`                   | Notifica o usuário via e-mail, com sucesso ou falha na operação       |

---

## 📡 Endpoints da API

> Todos os endpoints são protegidos via **Amazon Cognito**.

| Método | Caminho                      | Descrição                                                | Lambda                                      |
|--------|------------------------------|----------------------------------------------------------|---------------------------------------------|
| `GET`  | `/video/url    `             | Gera uma URL temporária para upload                      | `video-converter-get-video-url-prod`        |
| `PUT`  | `S3 signed URL`              | Upload direto do vídeo para o bucket                     | -                                           |
| `GET`  | `/video/{id}/frame-url`      | Gera URL para baixa o zip com frames do video processado | `video-converter-get-video-frames-url-prod` |
| `GET`  | `/video`                     | Lista dados dos vídeos e seu status de processamento     | `video-converter-list-videos-prod`          |

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

## Demais repositórios
- **Infraestrutura:** [video-iac](https://github.com/cloud-burger/video-iac)
- **Lambda de Notificação:** [video-notification](https://github.com/cloud-burger/video-notification)

---

## 📦 Dependências Relevantes

### 🧱 AWS SDK & Serverless

- **`serverless`**: framework principal para deploy das funções Lambda.
- **`serverless-esbuild`**: empacotamento rápido e eficiente das funções.
- **`@aws-sdk/client-s3`, `dynamodb`, `sqs`**: SDK modular AWS.
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

## 📄 Licença

Projeto licenciado sob a **MIT License**.
