# Slack AI Agent

Agente para Slack que analisa novos membros de uma comunidade e publica uma avaliacao de potencial interesse comercial em um canal privado.

## Como funciona

Quando um membro entra no workspace ou em um canal, o agente:

1. Busca os dados publicos do membro no Slack.
2. Faz uma pesquisa basica usando o dominio corporativo do e-mail, quando o e-mail nao pertence a um provedor pessoal.
3. Procura um usuario correspondente no GitHub.
4. Envia os dados coletados para o modelo `openai/gpt-4o-mini` via OpenRouter.
5. Gera um `fitScore` de 0 a 100, observacoes e recomendacoes de abordagem.
6. Publica a analise em `SLACK_PRIVATE_CHANNEL_ID`.
7. Persiste a analise e marca o envio como concluido, quando a camada de banco de dados estiver disponivel.

Os eventos tratados sao `team_join` e `member_joined_channel`. O segundo e ignorado quando o canal e publico.

## Requisitos

- Node.js 18 ou superior.
- Uma aplicacao Slack configurada com Socket Mode.
- Um token de API do OpenRouter.
- Um canal privado do Slack para receber as analises.
- Uma camada de banco de dados que forneca as funcoes usadas em `index.js`.

## Instalacao

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto:

```env
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_PRIVATE_CHANNEL_ID=C0123456789

OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

COMPANY_NAME=Nome da sua empresa
COMPANY_PRODUCT=Nome do seu produto

PORT=3000
NODE_ENV=development
```

Nao versionar o arquivo `.env` nem compartilhar os tokens da aplicacao.

## Configuracao do Slack

Na aplicacao Slack, habilite o Socket Mode e configure:

- um App-Level Token com a permissao `connections:write`;
- o bot token com permissoes para ler usuarios e publicar mensagens;
- os eventos `team_join` e `member_joined_channel` em **Event Subscriptions**;
- o bot como membro do canal definido em `SLACK_PRIVATE_CHANNEL_ID`.

Depois de alterar permissoes, reinstale a aplicacao no workspace para atualizar o token.

## Execucao

Para iniciar:

```bash
npm start
```

Para desenvolvimento, usando o modo watch do Node.js:

```bash
npm run dev
```

O servidor HTTP usa a porta definida por `PORT`, ou `3000` por padrao.

## Endpoints

### Health check

```http
GET /helathy
```

Retorna um JSON com o status do servico e o timestamp atual. O caminho esta escrito como `/helathy` no codigo atual.

### Analise manual em desenvolvimento

Disponivel somente quando `NODE_ENV=development`:

```http
POST /test/analyze-member
Content-Type: application/json
```

Exemplo de corpo:

```json
{
 "memberInfo": {
  "id": "U0123456789",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "title": "Engineering Lead"
 }
}
```

Esse endpoint executa a mesma pesquisa, analise por IA, persistencia e publicacao usadas pelos eventos do Slack.

## Persistencia

O metodo `start()` chama `initDataBase()` e o fluxo de analise usa `saveMemberAnalysis()` e `markAsSentToSlack()`. O encerramento chama `closeDatabase()`.

Essas funcoes nao estao implementadas no `index.js` atual. E necessario adicionar ou importar uma implementacao de banco de dados antes de executar o agente em um ambiente funcional.

## Estrutura

```text
.
├── index.js       # Agente Slack, API HTTP e integracao com IA
├── package.json   # Dependencias e scripts
└── README.md      # Documentacao do projeto
```

## Observacoes

- A pesquisa de empresa acessa `https://www.<dominio>` com timeout de 5 segundos.
- A pesquisa no GitHub usa o nome do membro e retorna o primeiro resultado.
- Gmail, Yahoo, Hotmail, Outlook e iCloud sao tratados como e-mails pessoais e nao iniciam pesquisa corporativa.
- Se a analise por IA falhar, o agente usa pontuacao `50` e recomenda revisao manual.
- O projeto ainda nao possui testes automatizados configurados; o script `npm test` retorna erro intencionalmente.
