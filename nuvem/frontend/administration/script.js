const loginSection = document.getElementById("login-section");
const creditSection = document.getElementById("credit-section");
const form = document.getElementById("credit-form");
const productSelect = document.getElementById("productId");

// Carrega token local
function tryLoadFromLocalStorage() {
  const token = localStorage.getItem("admin_google_token");
  if (!token) return;

  // Apenas mostra o painel (o backend valida token depois)
  loginSection.style.display = "none";
  creditSection.style.display = "block";
  loadGames(token);
}

// Carrega a lista de games
async function loadGames(token) {
  try {
    const res = await fetch("https://feira-de-jogos.dev.br/api/v2/games", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      console.error("Erro ao carregar games:", res.status);
      productSelect.innerHTML = '<option value="">Erro ao carregar jogos</option>';
      return;
    }

    const games = await res.json();
    
    // Limpa o select e adiciona a opção padrão
    productSelect.innerHTML = '<option value="">Selecione um jogo</option>';

    // Adiciona cada jogo como uma opção
    games.forEach(game => {
      const option = document.createElement("option");
      option.value = game.product;
      option.textContent = game.name;
      productSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar games:", err);
    productSelect.innerHTML = '<option value="">Erro ao carregar jogos</option>';
  }
}

// Google Login Callback
function handleCredentialResponse(response) {
  const token = response.credential;
  localStorage.setItem("admin_google_token", token);

  loginSection.style.display = "none";
  creditSection.style.display = "block";
  loadGames(token);
}

// Enviar crédito
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = document.getElementById("userId").value;
  const productId = document.getElementById("productId").value;
  const token = localStorage.getItem("admin_google_token");

  if (!token) {
    alert("Token ausente. Faça login novamente.");
    return;
  }

  if (!productId) {
    alert("Selecione um jogo.");
    return;
  }

  try {
    const res = await fetch("https://feira-de-jogos.dev.br/api/v2/adminCredit", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId: parseInt(userId), productId: parseInt(productId) })
    });

    const text = await res.text();

    if (!res.ok) {
      alert("Erro: " + text);
      return;
    }

    alert("✔️ Crédito enviado com sucesso!");
    form.reset();
  } catch (err) {
    console.error(err);
    alert("Erro inesperado.");
  }
});

// Logout
document.getElementById("logout-btn").onclick = () => {
  localStorage.removeItem("admin_google_token");
  creditSection.style.display = "none";
  loginSection.style.display = "block";
};

window.addEventListener("DOMContentLoaded", tryLoadFromLocalStorage);
