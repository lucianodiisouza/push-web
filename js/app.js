import { SCENARIOS, QUICK_PINGS } from "./scenarios.js";

const $ = (sel) => document.querySelector(sel);
const statusEl = $("#status");
const scenarioSelect = $("#scenario");
const timers = [];

function setStatus(text, kind = "info") {
  statusEl.textContent = text;
  statusEl.dataset.kind = kind;
}

function clearTimers() {
  while (timers.length) clearTimeout(timers.pop());
}

async function getRegistration() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers não são suportados neste navegador.");
  }
  const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  await navigator.serviceWorker.ready;
  return reg;
}

async function ensurePermission() {
  if (!("Notification" in window)) {
    throw new Error("Notificações não são suportadas.");
  }
  if (Notification.permission === "granted") return;
  if (Notification.permission === "denied") {
    throw new Error("Notificações bloqueadas. Ative em Ajustes → Notificações → Alertas Trabalho.");
  }
  const result = await Notification.requestPermission();
  if (result !== "granted") {
    throw new Error("Permissão de notificação não concedida.");
  }
}

function showViaWorker(reg, { title, body, tag }) {
  const worker = reg.active || reg.waiting || reg.installing;
  if (!worker) {
    return reg.showNotification(title, { body, tag, icon: "/icons/icon-192.png" });
  }
  worker.postMessage({
    type: "SHOW_NOTIFICATION",
    payload: {
      title,
      options: {
        body,
        tag: tag || `n-${Date.now()}`,
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        silent: false,
      },
    },
  });
}

async function fireOne({ title, body, tag }) {
  const reg = await getRegistration();
  await showViaWorker(reg, { title, body, tag });
}

async function runScenario(key) {
  clearTimers();
  const scenario = SCENARIOS[key];
  if (!scenario) return;

  await ensurePermission();
  const reg = await getRegistration();

  setStatus(`Rodando: ${scenario.label}`, "active");

  for (const item of scenario.items) {
    const id = setTimeout(() => {
      showViaWorker(reg, {
        title: item.title,
        body: item.body,
        tag: item.tag,
      });
    }, item.delaySec * 1000);
    timers.push(id);
  }

  const last = scenario.items[scenario.items.length - 1];
  const endMs = (last.delaySec + 2) * 1000;
  timers.push(
    setTimeout(() => {
      setStatus("Sequência finalizada. Bloqueie a tela ou troque de app para gravar a bandeja.", "done");
    }, endMs)
  );
}

function populateUI() {
  for (const [key, scenario] of Object.entries(SCENARIOS)) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = scenario.label;
    scenarioSelect.appendChild(opt);
  }

  const quickList = $("#quick-list");
  QUICK_PINGS.forEach((ping, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost";
    btn.textContent = ping.body.slice(0, 42) + (ping.body.length > 42 ? "…" : "");
    btn.title = `${ping.title}: ${ping.body}`;
    btn.addEventListener("click", async () => {
      try {
        await ensurePermission();
        await fireOne({ ...ping, tag: `quick-${i}` });
        setStatus("Uma notificação enviada.", "done");
      } catch (e) {
        setStatus(e.message, "error");
      }
    });
    quickList.appendChild(btn);
  });
}

async function init() {
  populateUI();

  if (!window.isSecureContext) {
    setStatus("Abra via HTTPS (Vercel) — notificações exigem contexto seguro.", "error");
    return;
  }

  $("#btn-enable").addEventListener("click", async () => {
    try {
      await ensurePermission();
      await getRegistration();
      setStatus("Pronto. Adicione à Tela de Início e rode uma sequência.", "done");
    } catch (e) {
      setStatus(e.message, "error");
    }
  });

  $("#btn-run").addEventListener("click", async () => {
    try {
      await runScenario(scenarioSelect.value);
    } catch (e) {
      setStatus(e.message, "error");
    }
  });

  $("#btn-stop").addEventListener("click", () => {
    clearTimers();
    setStatus("Parado.", "info");
  });

  $("#btn-test").addEventListener("click", async () => {
    try {
      await ensurePermission();
      await fireOne({
        title: "Chat corporativo",
        body: "Teste — se você viu isso, as notificações funcionam.",
        tag: "test",
      });
      setStatus("Teste enviado. Vá para a home ou bloqueie o iPhone para ver na bandeja.", "done");
    } catch (e) {
      setStatus(e.message, "error");
    }
  });

  try {
    await getRegistration();
    if (Notification.permission === "granted") {
      setStatus("Pronto. Instale na Tela de Início para o melhor comportamento no iOS.", "done");
    } else {
      setStatus("Toque em Ativar notificações e depois Adicionar à Tela de Início.", "info");
    }
  } catch {
    setStatus("Toque em Ativar notificações para começar.", "info");
  }
}

init();
