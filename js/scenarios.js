/** Cenários de notificações para gravação (pt-BR) */

export const NOTIFICATION_TYPES = {
  chat: { label: "Chat", title: "Chat corporativo" },
  calendar: { label: "Calendário", title: "Calendário" },
};

export const SCENARIOS = {
  manhaCorrida: {
    label: "Manhã corrida (8 avisos, ~90s)",
    items: [
      { delaySec: 3, title: "Chat corporativo", body: "Jordan Silva: e aí — você entra no daily?", tag: "chat-1" },
      { delaySec: 12, title: "Calendário", body: "Em 5 min · Daily standup · Sala do Teams", tag: "cal-1" },
      { delaySec: 22, title: "Chat corporativo", body: "Priya Santos: subi o hotfix, preciso de um review rápido", tag: "chat-2" },
      { delaySec: 35, title: "Chat corporativo", body: "Marcos Oliveira: @você o slide 4 ainda tem número do trimestre passado", tag: "chat-3" },
      { delaySec: 48, title: "Calendário", body: "Começando agora · Sync com cliente — Acme Corp", tag: "cal-2" },
      { delaySec: 58, title: "Chat corporativo", body: "RH Bot: lembrete — timesheet até sexta às 17h", tag: "chat-4" },
      { delaySec: 72, title: "Chat corporativo", body: "Elena Costa: consegue cobrir a review de arquitetura às 14h?", tag: "chat-5" },
      { delaySec: 88, title: "Calendário", body: "Em 10 min · Review de arquitetura · Prédio C", tag: "cal-3" },
    ],
  },

  faltouNoTrabalho: {
    label: "Faltou nas calls (6 avisos, ~70s)",
    items: [
      { delaySec: 5, title: "Chat corporativo", body: "Gestor(a): vi que você não entrou na call da manhã", tag: "miss-1" },
      { delaySec: 18, title: "Chat corporativo", body: "Jordan Silva: tudo bem? precisávamos da sua aprovação", tag: "miss-2" },
      { delaySec: 32, title: "Calendário", body: "Perdido · Planejamento da sprint · 9:00", tag: "miss-3" },
      { delaySec: 45, title: "Chat corporativo", body: "Priya Santos: bloqueio no seu ticket — me chama quando puder", tag: "miss-4" },
      { delaySec: 58, title: "Chat corporativo", body: "TI: sua sessão VPN expirou — reconecte para acessar os arquivos", tag: "miss-5" },
      { delaySec: 68, title: "Calendário", body: "Em 15 min · 1:1 com gestor(a) · não esquece a preparação", tag: "miss-6" },
    ],
  },

  rajada: {
    label: "Rajada rápida (12 avisos, ~45s)",
    items: [
      { delaySec: 2, title: "Chat corporativo", body: "Alex: pergunta rápida sobre o deck", tag: "rf-1" },
      { delaySec: 6, title: "Chat corporativo", body: "Sam: aprovado — pode subir", tag: "rf-2" },
      { delaySec: 10, title: "Calendário", body: "Agora · Crítica de design", tag: "rf-3" },
      { delaySec: 14, title: "Chat corporativo", body: "Taylor: vou atrasar 5 min", tag: "rf-4" },
      { delaySec: 18, title: "Chat corporativo", body: "Jordan: thread explodindo no #release", tag: "rf-5" },
      { delaySec: 22, title: "Chat corporativo", body: "Priya: build quebrou na main", tag: "rf-6" },
      { delaySec: 26, title: "Calendário", body: "Em 5 min · Retrospectiva", tag: "rf-7" },
      { delaySec: 30, title: "Chat corporativo", body: "Marcos: preciso de olhos no PR #482", tag: "rf-8" },
      { delaySec: 34, title: "Chat corporativo", body: "Elena: almoço mudou para 12:30", tag: "rf-9" },
      { delaySec: 38, title: "Chat corporativo", body: "RH: inscrição no plano de saúde fecha hoje", tag: "rf-10" },
      { delaySec: 41, title: "Calendário", body: "Em 2 min · All-hands", tag: "rf-11" },
      { delaySec: 44, title: "Chat corporativo", body: "Gestor(a): me liga quando ver isso", tag: "rf-12" },
    ],
  },
};

export const QUICK_PINGS = [
  { title: "Chat corporativo", body: "Colega: você está na call?" },
  { title: "Calendário", body: "Em 5 min · Sync do time" },
  { title: "Chat corporativo", body: "Alguém: sentiu sua falta no standup hoje" },
  { title: "Calendário", body: "Começando agora · Review trimestral" },
  { title: "Chat corporativo", body: "Gestor(a): me chama quando voltar" },
];
