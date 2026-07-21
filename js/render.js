const exerciciosGerais = [
  "--- ABDÔMEN ---",
  "Abdominal supra máquina",
  "Abdominal infra máquina",
  "Canoinha isometria",
  "--- AQUECIMENTO / PREVENÇÃO ---",
  "Aquecimento manguito",
  "Liberação do Trapézio com bolinha",
  "Child's pose e variação",
  "Wall slides",
  "Rotação torácica",
];

const exerciciosUpper = [
  "--- PEITO ---",
  "Supino inclinado articulado",
  "Supino reto máquina",
  "Fly máquina",
  "--- COSTAS ---",
  "Remada T-bar aberta",
  "Puxador bilateral",
  "Remada baixa máquina apoio de peito",
  "Remada T-bar fechada",
  "Puxador aberto romano",
  "Puxador fechado romano",
  "Puxador aberto pronado",
  "Extensão lombar no banco romano",
  "--- OMBRO ---",
  "Elevação lateral máquina sentado",
  "Elevação lateral unilateral cabo",
  "Elevação lateral em pé máquina",
  "--- BÍCEPS ---",
  "Rosca unilateral cabo",
  "Rosca Scott",
  "Rosca martelo corda",
  "Rosca martelo halter",
  "--- TRÍCEPS ---",
  "Tríceps pulley encostado",
  "Tríceps pulley",
  "Tríceps testa halter",
].concat(exerciciosGerais);

const exerciciosLower = [
  "--- QUADRÍCEPS ---",
  "Cadeira extensora",
  "Leg horizontal unilateral",
  "Leg horizontal",
  "Hack machine",
  "Leg 45",
  "Agachamento smith",
  "Afundo máquina",
  "Agachamento máquina",
  "Belt Squat",
  "Cadeira adutora",
  "--- POSTERIOR ---",
  "Mesa flexora unilateral",
  "Cadeira flexora unilateral",
  "Mesa flexora",
  "Cadeira flexora",
  "Stiff",
  "Flexor em pé unilateral",
  "Extensão lombar no banco romano",
  "Cadeira abdutora",
  "--- PANTURRILHA ---",
  "Panturrilha leg horizontal",
  "Panturrilha sentado",
  "Panturrilha em pé unilateral livre",
].concat(exerciciosGerais);

export const dbExercicios = {
  PUSH: [
    "--- PEITO ---",
    "Supino inclinado articulado",
    "Supino reto máquina",
    "Fly máquina",
    "--- OMBRO ---",
    "Elevação lateral máquina sentado",
    "Elevação lateral unilateral cabo",
    "Elevação lateral em pé máquina",
    "--- TRÍCEPS ---",
    "Tríceps pulley encostado",
    "Tríceps pulley",
    "Tríceps testa halter",
  ].concat(exerciciosGerais),
  PULL: [
    "--- COSTAS ---",
    "Remada T-bar aberta",
    "Puxador bilateral",
    "Remada baixa máquina apoio de peito",
    "Remada T-bar fechada",
    "Puxador aberto romano",
    "Puxador fechado romano",
    "Puxador aberto pronado",
    "Extensão lombar no banco romano",
    "--- BÍCEPS ---",
    "Rosca unilateral cabo",
    "Rosca Scott",
    "Rosca martelo corda",
    "Rosca martelo halter",
  ].concat(exerciciosGerais),
  UPPER: exerciciosUpper,
  PULL_PEITO: exerciciosUpper,
  PUSH_COSTAS: exerciciosUpper,
  LOWER: exerciciosLower,
  LEGS1: exerciciosLower,
  LEGS2: exerciciosLower,
  LEGS: exerciciosLower, // Mantido internamente apenas para não bugar treinos antigos já salvos no histórico
};

export function obterOpcoesDeExercicios(membro) {
  const lista = dbExercicios[membro] || exerciciosUpper;
  let optionsHTML =
    '<option value="" disabled selected>Selecione um exercício...</option>';

  lista.forEach((ex) => {
    if (ex.startsWith("---")) {
      optionsHTML += `<option disabled style="font-weight:bold; color:var(--accent); background: #222;">${ex}</option>`;
    } else {
      optionsHTML += `<option value="${ex}">${ex}</option>`;
    }
  });
  return optionsHTML;
}

export function renderNovaLinhaExercicio(container, membro = "PUSH") {
  const block = document.createElement("div");
  block.className = "exercise-block";
  block.style.transition = "background-color 0.3s ease";

  block.innerHTML = `
        <div style="position: absolute; top: 14px; right: 14px; display: flex; gap: 6px;">
            <button type="button" class="btn-move-up" title="Mover para cima" style="background: #1F1F24; border: 1px solid var(--border-color); color: #fff; padding: 4px 6px; border-radius: 6px; cursor: pointer; font-size: 11px;">上 ⬆️</button>
            <button type="button" class="btn-move-down" title="Mover para baixo" style="background: #1F1F24; border: 1px solid var(--border-color); color: #fff; padding: 4px 6px; border-radius: 6px; cursor: pointer; font-size: 11px;">下 ⬇️</button>
            <button type="button" class="btn-remove" title="Remover Exercício" style="background: transparent; color: var(--accent); border: 1px solid rgba(255,59,48,0.3); padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight:600;">❌</button>
        </div>
        
        <div class="input-group" style="width: 62%; margin-bottom: 12px;">
            <label>Exercício</label>
            <select class="ex-name" style="padding: 10px; font-size: 14px;">
                ${obterOpcoesDeExercicios(membro)}
            </select>
        </div>
        
        <div class="sets-wrapper">
            <div class="sets-container"></div>
            <button type="button" class="btn-add-set btn-fab-set">+ Adicionar Série</button>
        </div>
        
        <div class="input-group" style="margin-top: 12px; margin-bottom: 0;">
            <textarea class="ex-feedback" rows="2" placeholder="Sensação muscular..." style="font-size:13px; padding:10px;"></textarea>
        </div>
    `;

  const destacarBloco = (elemento) => {
    elemento.style.backgroundColor = "var(--border-color)";
    setTimeout(() => {
      elemento.style.backgroundColor = "var(--bg-card)";
    }, 200);
  };

  block
    .querySelector(".btn-remove")
    .addEventListener("click", () => block.remove());

  block.querySelector(".btn-move-up").addEventListener("click", () => {
    if (block.previousElementSibling) {
      block.parentNode.insertBefore(block, block.previousElementSibling);
      destacarBloco(block);
    }
  });

  block.querySelector(".btn-move-down").addEventListener("click", () => {
    if (block.nextElementSibling) {
      block.parentNode.insertBefore(block.nextElementSibling, block);
      destacarBloco(block);
    }
  });

  // --- NOVA LÓGICA DE ISOMETRIA AQUI ---
  const selectName = block.querySelector(".ex-name");
  selectName.addEventListener("change", (e) => {
    const isIsometria = e.target.value === "Canoinha isometria";
    const sets = block.querySelectorAll(".dynamic-set");

    sets.forEach((row) => {
      const inputPlacas = row.querySelector(".set-placas");
      const inputLoad = row.querySelector(".set-load");
      const inputReps = row.querySelector(".set-reps");

      if (isIsometria) {
        inputPlacas.disabled = true;
        inputLoad.disabled = true;
        inputPlacas.style.opacity = "0.3";
        inputLoad.style.opacity = "0.3";
        inputPlacas.value = "";
        inputLoad.value = "";
        inputReps.placeholder = "Tempo (s)";
      } else {
        inputPlacas.disabled = false;
        inputLoad.disabled = false;
        inputPlacas.style.opacity = "1";
        inputLoad.style.opacity = "1";
        inputReps.placeholder = "Reps";
      }
    });
  });
  // -------------------------------------

  const setsContainer = block.querySelector(".sets-container");
  block
    .querySelector(".btn-add-set")
    .addEventListener("click", () => renderNovaSerie(setsContainer));
  renderNovaSerie(setsContainer, "Válida");
  container.appendChild(block);
}

export function renderNovaSerie(setsContainer, defaultType = "Ajuste") {
  // Verifica qual é o exercício atual no bloco pai
  const block = setsContainer.closest(".exercise-block");
  const selectName = block ? block.querySelector(".ex-name") : null;
  const isIsometria = selectName && selectName.value === "Canoinha isometria";

  const disabledAttr = isIsometria ? "disabled" : "";
  const opacityStyle = isIsometria ? "opacity: 0.3;" : "";
  const repsPlaceholder = isIsometria ? "Tempo (s)" : "Reps";

  const row = document.createElement("div");
  row.className = "sets-row-v2 dynamic-set";
  row.innerHTML = `
        <select class="set-type" style="padding: 8px 4px; font-size:12px;">
            <option value="Aquecimento" ${defaultType === "Aquecimento" ? "selected" : ""}>Aquec.</option>
            <option value="Ajuste" ${defaultType === "Ajuste" ? "selected" : ""}>Feeder</option>
            <option value="Válida" ${defaultType === "Válida" ? "selected" : ""}>Válida</option>
        </select>
        <input type="number" class="set-placas" placeholder="Pl." ${disabledAttr} style="padding: 8px 4px; text-align:center; font-size:12px; ${opacityStyle}">
        <input type="number" class="set-load" placeholder="kg" step="0.5" ${disabledAttr} style="padding: 8px 4px; text-align:center; font-size:12px; ${opacityStyle}">
        <input type="text" class="set-reps" placeholder="${repsPlaceholder}" style="padding: 8px 4px; text-align:center; font-size:12px;">
        <button type="button" class="btn-del-set" style="background:transparent; color:var(--accent); border:none; font-size:20px; cursor:pointer; text-align:center; padding-bottom: 4px;">×</button>
    `;
  row
    .querySelector(".btn-del-set")
    .addEventListener("click", () => row.remove());
  setsContainer.appendChild(row);
}

export function renderHistoricoTreinos(treinos, container, onEdit, onDelete) {
  container.innerHTML = "";
  if (treinos.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); font-style:italic; text-align:center; padding: 40px 20px;">Nenhum registro encontrado.</p>`;
    return;
  }

  const treinosPorSemana = {};
  treinos.forEach((t) => {
    const sem = t.semana || t.semanaNum || 1;
    if (!treinosPorSemana[sem]) treinosPorSemana[sem] = [];
    treinosPorSemana[sem].push(t);
  });

  const semanasOrdenadas = Object.keys(treinosPorSemana).sort((a, b) => b - a);

  semanasOrdenadas.forEach((sem, idx) => {
    const accordion = document.createElement("details");
    accordion.className = "semana-accordion";
    if (idx === 0) accordion.setAttribute("open", "");

    const summary = document.createElement("summary");
    summary.className = "semana-summary";
    summary.innerHTML = `<span>SEMANA ${sem}</span> <span style="font-size:11px; color:var(--text-muted); font-weight:normal;">${treinosPorSemana[sem].length} sessão(ões)</span>`;

    const content = document.createElement("div");
    content.className = "accordion-content";

    const treinosDaSemana = treinosPorSemana[sem].sort(
      (a, b) => b.dataMilisegundos - a.dataMilisegundos,
    );

    treinosDaSemana.forEach((sessao) => {
      const card = document.createElement("div");

      let htmlExercicios = "";
      if (sessao.exercicios && Array.isArray(sessao.exercicios)) {
        sessao.exercicios.forEach((ex) => {
          let htmlSeries = "";
          if (ex.series && Array.isArray(ex.series)) {
            ex.series.forEach((s, index) => {
              let badgeStyle = "background: #1b263b; color: #8ecae6;";
              if (s.tipo === "Ajuste")
                badgeStyle = "background: #3e2723; color: #ffb703;";
              if (s.tipo === "Válida")
                badgeStyle = "background: #143622; color: #2ec4b6;";

              let infoPeso = [];
              if (s.placas) infoPeso.push(`${s.placas} Pl.`);
              if (s.carga) infoPeso.push(`${s.carga}kg`);
              let strPeso =
                infoPeso.length > 0 ? infoPeso.join(" / ") : "Sem peso";

              // --- NOVA LÓGICA DE EXIBIÇÃO PARA ISOMETRIA ---
              let labelReps =
                ex.nome === "Canoinha isometria" ? "Segs" : "Reps";
              if (ex.nome === "Canoinha isometria") strPeso = "Isometria";
              // ----------------------------------------------

              htmlSeries += `
                                <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 8px; margin-bottom:3px; border-radius:6px; font-size:11px; font-family:monospace; ${badgeStyle}">
                                    <span>${index + 1}. ${s.tipo}</span>
                                    <span>${strPeso} | <b>${s.reps} ${labelReps}</b></span>
                                </div>`;
            });
          }
          htmlExercicios += `
                        <div style="background:var(--bg-input); padding:8px; border-radius:8px; margin-top:8px;">
                            <div style="font-weight:700; color:#fff; margin-bottom:4px; font-size:13px;">🏋️ ${ex.nome}</div>
                            <div>${htmlSeries}</div>
                            ${ex.feedback ? `<p style="font-size:11px; color:var(--text-muted); font-style:italic; margin-top:4px; padding-top:2px; border-top:1px dashed #222;">↳ ${ex.feedback}</p>` : ""}
                        </div>`;
        });
      }

      card.innerHTML = `
                <details class="semana-accordion" style="margin-bottom: 12px; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-color); border-left: 4px solid var(--accent); width: 100%;">
                    <summary class="semana-summary" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; list-style: none;">
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <h4 style="font-size:15px; font-weight:700; margin: 0;">${sessao.treino}</h4>
                            <span style="font-size:11px; color:var(--text-muted);">${sessao.dataStr} ${sessao.faseDescricao ? `• 🏷️ ${sessao.faseDescricao}` : ""}</span>
                        </div>
                        <div style="display:flex; gap:6px;">
                            <button class="btn-edit" style="background:#2C2C2E; color:#FFF; border:none; padding:6px 10px; border-radius:6px; font-size:12px; cursor:pointer;" title="Editar">✏️</button>
                            <button class="btn-del" style="background:rgba(255,59,48,0.1); color:var(--accent); border:none; padding:6px 10px; border-radius:6px; font-size:12px; cursor:pointer;" title="Excluir">🗑️</button>
                        </div>
                    </summary>
                    
                    <div class="accordion-content" style="padding: 0 12px 12px 12px;">
                        <div style="margin-bottom: 8px;">${htmlExercicios}</div>
                        ${sessao.notasGerais ? `<div style="background:var(--bg-input); border-left:2px solid var(--accent); padding:8px; border-radius:4px; margin-top:8px; font-size:12px; color:#ccc; line-height: 1.4;">📝 <b>Nota:</b> ${sessao.notasGerais}</div>` : ""}
                    </div>
                </details>
            `;

      card.querySelector(".btn-edit").addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit(sessao);
      });

      card.querySelector(".btn-del").addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(sessao.id);
      });

      content.appendChild(card);
    });

    accordion.appendChild(summary);
    accordion.appendChild(content);
    container.appendChild(accordion);
  });
}
