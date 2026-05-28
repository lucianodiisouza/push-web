# AlertWorker - PrimoDev (PWA demo)

PWA estática que dispara **notificações genéricas de trabalho** (chat + calendário) para gravação no iPhone. Sem backend.

## Publicar na Vercel

1. Gere os ícones (uma vez):

   ```bash
   node scripts/generate-icons.mjs
   ```

2. Envie para o GitHub e importe no [Vercel](https://vercel.com), ou:

   ```bash
   npx vercel
   ```

3. Abra a **URL HTTPS de produção** no Safari do iPhone.

## Configuração no iPhone (importante)

1. Safari → URL da Vercel  
2. **Ativar notificações** → Permitir  
3. Compartilhar → **Adicionar à Tela de Início**  
4. Abra o app **pelo ícone na tela inicial** (não por aba do Safari)  
5. Ative notificações de novo se pedir  
6. Toque em **Testar uma**, bloqueie a tela ou vá para a home  
7. Rode uma **sequência**, bloqueie o celular e grave o centro de notificações  

O iOS só mostra notificações web em **PWA instalado** (iOS 16.4+). Teste antes da gravação — podem ser mais discretas que apps nativos.

## Cenários

| Cenário           | Uso                                      |
|-------------------|------------------------------------------|
| Manhã corrida     | Daily, chats, reuniões chegando          |
| Faltou nas calls  | “Cadê você?” / calls perdidas            |
| Rajada rápida     | Bandeja cheia para B-roll                |

Edite textos e tempos em `js/scenarios.js`.

## Personalizar

- **Títulos e corpos**: `js/scenarios.js`  
- **Atrasos**: `delaySec` em cada item  
- **Nome na tela inicial**: `manifest.webmanifest` → `short_name`  

## Dicas de gravação

- Inicie a sequência e **bloqueie a tela** em 1–2 segundos.  
- Puxe o centro de notificações enquanto grava.  
- **Não perturbe desligado**; volume alto se quiser som (nem sempre funciona em web push).  
- Mantenha o PWA em segundo plano; fechar o app cancela os timers.

## Licença

Uso pessoal / demonstração. Você é responsável pelo uso das notificações encenadas em conteúdo publicado.
