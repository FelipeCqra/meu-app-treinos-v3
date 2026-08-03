// No topo do arquivo principal, importe o auth e as funções necessárias
import { auth } from "./firebase-config.js"; // Ajuste o caminho se necessário
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Referências da interface
const loginScreen = document.getElementById("login-screen");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const btnLogout = document.getElementById("btn-logout");
const loginLoading = document.getElementById("login-loading"); // <-- ADICIONE ESTA LINHA

// 1. Escutador de Sessão (Verifica automaticamente se você já está logado)
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuário logado: Esconde o login e exibe o botão de sair
    loginScreen.style.display = "none";
    btnLogout.style.display = "block";

    // CHAME A FUNÇÃO AQUI: Agora ele só busca os treinos depois de logado
    atualizarHistorico();
  } else {
    // Ninguém logado: Trava na tela de login
    loginScreen.style.display = "flex";
    btnLogout.style.display = "none";

    // Esconde o texto de "Carregando" e exibe os campos de email e senha
    if (loginLoading && loginForm) {
      loginLoading.style.display = "none";
      loginForm.style.display = "flex";
    }
  }
});

// 2. Lógica do Formulário de Login
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Tenta fazer o login
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        loginError.style.display = "none";
        loginForm.reset();
        // A sessão já será identificada pelo onAuthStateChanged acima
      })
      .catch((error) => {
        console.error("Erro no login:", error);
        loginError.style.display = "block";
      });
  });
}

// 3. Lógica de Logout (Sair)
if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        console.log("Deslogado com sucesso");
      })
      .catch((error) => {
        console.error("Erro ao deslogar", error);
      });
  });
}

import {
  salvarTreino,
  atualizarTreino,
  deletarTreinoDoBanco,
  buscarTodosOsTreinos,
} from "./crud.js";
import {
  renderNovaLinhaExercicio,
  renderHistoricoTreinos,
  obterOpcoesDeExercicios,
} from "./render.js";

let editingDocId = null;

// ==========================================
// TOASTS DE SISTEMA
// ==========================================
function mostrarNotificacao(mensagem, tipo = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;
  toast.innerHTML = `<span>${tipo === "success" ? "✅" : "⚠️"}</span> <span>${mensagem}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==========================================
// NAVEGAÇÃO RESPONSIVA (5 ABAS)
// ==========================================
function mudarAba(targetTab) {
  document
    .querySelectorAll(".nav-item")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelectorAll(".app-tab")
    .forEach((t) => t.classList.remove("active"));

  const btnAtivo = document.querySelector(
    `.nav-item[data-target="${targetTab}"]`,
  );
  if (btnAtivo) btnAtivo.classList.add("active");

  const activeTab = document.getElementById(targetTab);
  if (activeTab) activeTab.classList.add("active");

  // Regra rígida: O botão flutuante de salvar SÓ aparece na tela de Registrar Treino
  const btnSalvar = document.getElementById("btn-salvar-treino");
  if (btnSalvar) {
    if (targetTab !== "tab-registrar") {
      btnSalvar.classList.add("hidden");
    } else {
      btnSalvar.classList.remove("hidden");
    }
  }
}

document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () =>
    mudarAba(btn.getAttribute("data-target")),
  );
});

// ==========================================
// LÓGICA DO FORMULÁRIO DE SESSÃO
// ==========================================
function definirDataHoje() {
  const hoje = new Date();
  const inputData = document.getElementById("data-treino");
  if (inputData) inputData.value = hoje.toISOString().split("T")[0];
}

async function atualizarHistorico() {
  const container = document.getElementById("historico-container");
  if (!container) return;
  await buscarTodosOsTreinos((listaTreinos) => {
    renderHistoricoTreinos(
      listaTreinos,
      container,
      iniciarEdicao,
      deletarTreino,
    );
  });
}

function obterMembroAtual() {
  const selectTreino = document.getElementById("tipo-treino");
  return selectTreino ? selectTreino.value.toUpperCase() : "UPPER";
}

function iniciarEdicao(sessao) {
  editingDocId = sessao.id;
  document.querySelector("#tab-registrar h1").textContent =
    "✏️ Editando Treino";
  document.querySelector("#btn-salvar-treino .btn-text").textContent =
    "ATUALIZAR SESSÃO";
  document.getElementById("btn-cancelar-edicao").classList.remove("hidden");

  document.getElementById("semana").value =
    sessao.semana || sessao.semanaNum || 1;
  document.getElementById("fase-desc").value = sessao.faseDescricao || "";
  document.getElementById("data-treino").value = sessao.dataTreino || "";
  document.getElementById("tipo-treino").value = sessao.treino;
  document.getElementById("notas-gerais").value = sessao.notasGerais || "";

  const container = document.getElementById("exercicios-container");
  container.innerHTML = "";
  const membro = obterMembroAtual();

  if (sessao.exercicios && Array.isArray(sessao.exercicios)) {
    sessao.exercicios.forEach((ex) => {
      renderNovaLinhaExercicio(container, membro);
      const linhaCriada = container.lastElementChild;
      const selectName = linhaCriada.querySelector(".ex-name");
      if (selectName) selectName.value = ex.nome;
      const feedbackTextarea = linhaCriada.querySelector(".ex-feedback");
      if (feedbackTextarea) feedbackTextarea.value = ex.feedback || "";
      const setsContainer = linhaCriada.querySelector(".sets-container");
      setsContainer.innerHTML = "";

      if (ex.series && Array.isArray(ex.series)) {
        ex.series.forEach((s) => {
          const row = document.createElement("div");
          row.className = "sets-row-v2 dynamic-set";
          row.innerHTML = `
                        <select class="set-type" style="padding: 8px 4px; font-size:12px;">
                            <option value="Aquecimento" ${s.tipo === "Aquecimento" ? "selected" : ""}>Aquec.</option>
                            <option value="Ajuste" ${s.tipo === "Ajuste" ? "selected" : ""}>Feeder</option>
                            <option value="Válida" ${s.tipo === "Válida" ? "selected" : ""}>Válida</option>
                        </select>
                        <input type="number" class="set-placas" placeholder="Pl." min="0" value="${s.placas || ""}" style="padding: 8px 4px; text-align:center; font-size:12px;">
                        <input type="number" class="set-load" placeholder="kg" min="0" step="0.5" value="${s.carga || ""}" style="padding: 8px 4px; text-align:center; font-size:12px;">
                        <input type="text" class="set-reps" placeholder="Reps" value="${s.reps || ""}" style="padding: 8px 4px; text-align:center; font-size:12px;">
                        <button type="button" class="btn-del-set" style="background:transparent; color:var(--accent); border:none; font-size:20px; cursor:pointer; text-align:center; padding-bottom: 4px;">×</button>
                    `;
          row
            .querySelector(".btn-del-set")
            .addEventListener("click", () => row.remove());
          setsContainer.appendChild(row);
        });
      }
    });
  }
  mudarAba("tab-registrar");
}

async function deletarTreino(docId) {
  if (confirm("Deseja realmente excluir este treino da nuvem?")) {
    try {
      await deletarTreinoDoBanco(docId);
      mostrarNotificacao("Treino excluído com sucesso!", "success");
      atualizarHistorico();
    } catch (error) {
      mostrarNotificacao("Erro: " + error.message, "warning");
    }
  }
}

function resetarModoFormulario() {
  editingDocId = null;
  document.getElementById("form-treino").reset();
  definirDataHoje();
  document.querySelector("#tab-registrar h1").textContent = "Registrar Sessão";
  document.querySelector("#btn-salvar-treino .btn-text").textContent =
    "SALVAR SESSÃO";
  document.getElementById("btn-cancelar-edicao").classList.add("hidden");

  const container = document.getElementById("exercicios-container");
  if (container) {
    container.innerHTML = "";
    renderNovaLinhaExercicio(container, obterMembroAtual());
  }
}

document.getElementById("btn-cancelar-edicao").addEventListener("click", () => {
  resetarModoFormulario();
  mudarAba("tab-feedbacks");
  mostrarNotificacao("Edição cancelada", "warning");
});

async function handleFormSubmit(e) {
  if (e) e.preventDefault();

  const semanaInput = document.getElementById("semana").value;
  const rawDate = document.getElementById("data-treino").value;

  if (!semanaInput || parseInt(semanaInput) < 1) {
    return mostrarNotificacao("Insira uma semana válida!", "warning");
  }
  if (!rawDate) {
    return mostrarNotificacao("Selecione a data do treino!", "warning");
  }

  const parts = rawDate.split("-");
  const dataStrFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
  const timestampMilisegundos = new Date(
    parts[0],
    parts[1] - 1,
    parts[2],
  ).getTime();

  const exerciseBlocks = document.querySelectorAll(".exercise-block");
  const exerciciosRealizados = [];
  let erroValidacao = false;

  exerciseBlocks.forEach((block) => {
    const name = block.querySelector(".ex-name").value;
    if (!name) {
      mostrarNotificacao("Selecione o nome em todos os exercícios!", "warning");
      erroValidacao = true;
      return;
    }

    const setRows = block.querySelectorAll(".dynamic-set");
    const seriesExtraidas = [];

    setRows.forEach((row) => {
      const reps = row.querySelector(".set-reps").value.trim();
      if (!reps) {
        mostrarNotificacao(`Preencha as repetições de "${name}"`, "warning");
        erroValidacao = true;
        return;
      }
      seriesExtraidas.push({
        tipo: row.querySelector(".set-type").value,
        placas: row.querySelector(".set-placas").value,
        carga: row.querySelector(".set-load").value,
        reps: reps,
      });
    });

    if (seriesExtraidas.length === 0) {
      mostrarNotificacao(
        `Adicione pelo menos 1 série para "${name}"!`,
        "warning",
      );
      erroValidacao = true;
      return;
    }

    exerciciosRealizados.push({
      nome: name,
      series: seriesExtraidas,
      feedback: block.querySelector(".ex-feedback").value,
    });
  });

  if (erroValidacao) return;

  if (exerciciosRealizados.length === 0) {
    return mostrarNotificacao("Adicione um exercício para salvar!", "warning");
  }

  const sessaoCompleta = {
    semana: parseInt(semanaInput),
    semanaNum: parseInt(semanaInput),
    faseDescricao: document.getElementById("fase-desc").value,
    dataTreino: rawDate,
    dataStr: dataStrFormatada,
    dataMilisegundos: timestampMilisegundos,
    treino: document.getElementById("tipo-treino").value,
    notasGerais: document.getElementById("notas-gerais").value,
    exercicios: exerciciosRealizados,
  };

  const btnSalvar = document.getElementById("btn-salvar-treino");
  const btnText = btnSalvar.querySelector(".btn-text");
  const spinner = btnSalvar.querySelector(".spinner");

  btnText.textContent = "PROCESSANDO...";
  spinner.classList.remove("hidden");
  btnSalvar.disabled = true;

  try {
    if (editingDocId) {
      await atualizarTreino(editingDocId, sessaoCompleta);
      mostrarNotificacao("Treino atualizado!", "success");
    } else {
      await salvarTreino(sessaoCompleta);
      mostrarNotificacao("Treino salvo na nuvem!", "success");
    }
    resetarModoFormulario();
    await atualizarHistorico();
    mudarAba("tab-feedbacks");
  } catch (error) {
    mostrarNotificacao("Erro: " + error.message, "warning");
  } finally {
    btnSalvar.disabled = false;
    btnText.textContent = editingDocId ? "ATUALIZAR SESSÃO" : "SALVAR SESSÃO";
    spinner.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  definirDataHoje();

  // Força a inicialização visual na aba de Protocolo
  mudarAba("tab-protocolo");

  const container = document.getElementById("exercicios-container");
  const btnAddExercise = document.getElementById("btn-adicionar-exercicio");
  const tipoTreinoInput = document.getElementById("tipo-treino");
  const btnSalvar = document.getElementById("btn-salvar-treino");

  if (tipoTreinoInput) {
    tipoTreinoInput.addEventListener("change", () => {
      const novoMembro = obterMembroAtual();
      document.querySelectorAll(".ex-name").forEach((select) => {
        const valorAtual = select.value;
        select.innerHTML = obterOpcoesDeExercicios(novoMembro);
        if (Array.from(select.options).some((o) => o.value === valorAtual)) {
          select.value = valorAtual;
        }
      });
    });
  }

  if (btnAddExercise && container) {
    btnAddExercise.addEventListener("click", () =>
      renderNovaLinhaExercicio(container, obterMembroAtual()),
    );
  }

  if (btnSalvar) {
    btnSalvar.addEventListener("click", handleFormSubmit);
  }

  if (container && container.children.length === 0) {
    renderNovaLinhaExercicio(container, obterMembroAtual());
  }

  //atualizarHistorico();
});
