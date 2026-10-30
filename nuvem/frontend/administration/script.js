/* ===== CONFIGURAÇÃO ===== */
const API_BASE = "https://feira-de-jogos.dev.br/api/v2";
const GOOGLE_CLIENT_ID = "331191695151-ku8mdhd76pc2k36itas8lm722krn0u64.apps.googleusercontent.com";

// E-mails autorizados a ver o painel (deny-by-default). TROQUE pelos admins reais.
// IMPORTANTE: isto é só a "porta da frente". Quem protege de verdade é o backend,
// que deve validar o token e o papel de admin em /games e /adminCredit.
const ADMIN_EMAILS = ["seu-email-admin@gmail.com"];

const TOKEN_KEY = "admin_google_token";

/* ===== ELEMENTOS ===== */
const $ = (id) => document.getElementById(id);
const views = { loading: $("view-loading"), login: $("view-login"), admin: $("view-admin") };
const form = $("credit-form");
const productSelect = $("productId");
const qtyInput = $("quantity");
const submitBtn = $("submit-btn");

let expiryTimer = null;

/* ===== UI ===== */
function showView(name) {
  Object.entries(views).forEach(([key, el]) => { el.hidden = key !== name; });
}

function toast(message, isError = false) {
  const el = $("toast");
  el.textContent = message;
  el.classList.toggle("error", isError);
  el.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { el.hidden = true; }, 4000);
}

function loginError(message) {
  const el = $("login-error");
  el.textContent = message || "";
  el.hidden = !message;
}

/* ===== AUTENTICAÇÃO ===== */
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload).split("").map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Retorna { ok, reason, claims }. Nada é exibido sem passar por aqui.
function checkToken(token) {
  const claims = token && decodeJwt(token);
  if (!claims) return { ok: false, reason: "Sessão inválida. Entre novamente." };
  if (claims.aud !== GOOGLE_CLIENT_ID) return { ok: false, reason: "Sessão inválida. Entre novamente." };
  if (!claims.exp || claims.exp * 1000 <= Date.now()) return { ok: false, reason: "Sua sessão expirou. Entre novamente." };
  if (!claims.email || claims.email_verified === false) return { ok: false, reason: "E-mail não verificado." };
  if (!ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(claims.email.toLowerCase())) {
    return { ok: false, reason: "Esta conta não tem permissão de administrador." };
  }
  return { ok: true, claims };
}

function logout(message) {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY); // limpa resquício da versão antiga
  clearTimeout(expiryTimer);
  if (window.google?.accounts?.id) google.accounts.id.disableAutoSelect();
  form.reset();
  qtyInput.value = 1;
  productSelect.innerHTML = '<option value="">Carregando jogos…</option>';
  loginError(message);
  showView("login");
}

async function startSession(token) {
  const result = checkToken(token);
  if (!result.ok) return logout(result.reason);

  sessionStorage.setItem(TOKEN_KEY, token);
  const { claims } = result;
  $("admin-name").textContent = claims.name || "Administrador";
  $("admin-email").textContent = claims.email;
  $("avatar").style.backgroundImage = claims.picture ? `url("${claims.picture}")` : "";

  // Encerra sozinho quando o token do Google vence
  clearTimeout(expiryTimer);
  expiryTimer = setTimeout(() => logout("Sua sessão expirou. Entre novamente."), claims.exp * 1000 - Date.now());

  // O painel só aparece se o backend também aceitar o token
  const loaded = await loadGames();
  if (loaded) {
    loginError("");
    showView("admin");
  }
}

/* ===== API: toda chamada passa aqui ===== */
async function api(path, options = {}) {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!checkToken(token).ok) {
    logout("Sua sessão expirou. Entre novamente.");
    throw new Error("unauthenticated");
  }
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (res.status === 401 || res.status === 403) {
    logout(res.status === 403
      ? "O servidor negou o acesso: esta conta não é administradora."
      : "Sessão recusada pelo servidor. Entre novamente.");
    throw new Error("unauthorized");
  }
  return res;
}

/* ===== JOGOS ===== */
async function loadGames() {
  try {
    const res = await api("/games");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const games = await res.json();

    productSelect.innerHTML = '<option value="">Selecione um jogo</option>';
    games.forEach((game) => {
      const option = document.createElement("option");
      option.value = game.product;
      option.textContent = game.name;
      productSelect.appendChild(option);
    });
    return true;
  } catch (err) {
    if (err.message === "unauthenticated" || err.message === "unauthorized") return false;
    console.error("Erro ao carregar jogos:", err);
    productSelect.innerHTML = '<option value="">Não foi possível carregar os jogos</option>';
    toast("Não foi possível carregar os jogos. Recarregue a página.", true);
    return true; // sessão válida; só a lista falhou
  }
}

/* ===== ENVIO DE CRÉDITO ===== */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  form.querySelectorAll("input, select").forEach((el) => el.classList.add("touched"));

  const userId = parseInt($("userId").value, 10);
  const productId = parseInt(productSelect.value, 10);
  const quantity = parseInt(qtyInput.value, 10);

  if (!(userId > 0)) return toast("Informe um ID de usuário válido.", true);
  if (!(productId >= 0) || productSelect.value === "") return toast("Selecione um jogo.", true);
  if (!(quantity > 0)) return toast("A quantidade deve ser maior que zero.", true);

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando…";
  try {
    const res = await api("/adminCredit", {
      method: "POST",
      body: JSON.stringify({ userId, productId, quantity }),
    });
    if (!res.ok) {
      const text = await res.text();
      return toast("Erro: " + (text || res.status), true);
    }
    toast("Crédito enviado com sucesso.");
    form.reset();
    qtyInput.value = 1;
    form.querySelectorAll(".touched").forEach((el) => el.classList.remove("touched"));
  } catch (err) {
    if (err.message !== "unauthenticated" && err.message !== "unauthorized") {
      console.error(err);
      toast("Erro inesperado. Tente novamente.", true);
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar crédito";
  }
});

/* ===== QUANTIDADE ===== */
$("qty-minus").onclick = () => { qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1); };
$("qty-plus").onclick = () => { qtyInput.value = (parseInt(qtyInput.value, 10) || 0) + 1; };

$("logout-btn").onclick = () => logout();

/* ===== INICIALIZAÇÃO ===== */
function initGoogle() {
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response) => startSession(response.credential),
    auto_select: false,
  });
  google.accounts.id.renderButton($("google-btn"), {
    type: "standard", theme: "filled_blue", size: "large", text: "signin_with", shape: "pill",
    width: Math.min(300, window.innerWidth - 80),
  });
}

function boot() {
  const saved = sessionStorage.getItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY); // migração: token antigo não é mais usado
  if (saved) startSession(saved); else showView("login");
}

// O script do Google é assíncrono: espera estar pronto
(function waitGoogle() {
  if (window.google?.accounts?.id) initGoogle();
  else setTimeout(waitGoogle, 100);
})();

window.addEventListener("DOMContentLoaded", boot);