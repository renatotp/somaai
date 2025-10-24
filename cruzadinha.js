// --- INICIALIZAÇÃO ---
const container = document.getElementById('cruzadinha-container');
const respostasContainer = document.getElementById('respostas-container');

// --- DADOS DO JOGO ---
let fases = [
    {
        cruzada: [
            [" ", " ", " ", " ", "3", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", "-", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", "5", " ", 0, "+", "2", "=", 0, " ", " ", " ", " "],
            [" ", " ", "-", " ", "=", " ", " ", " ", "+", " ", " ", " ", " "],
            [" ", " ", 0, "-", "1", "=", 0, " ", 0, " ", "2", " ", " "],
            [" ", " ", "=", " ", " ", " ", " ", " ", "=", " ", "+", " ", " "],
            [0, "+", "1", "=", "3", " ", " ", " ", "5", "-", 0, "=", 0],
            [" ", " ", " ", " ", "+", " ", " ", " ", " ", " ", "=", " ", " "],
            [" ", " ", " ", " ", "2", " ", "1", " ", " ", " ", "5", " ", " "],
            [" ", " ", " ", " ", "=", " ", "+", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", 0, "-", 0, "=", "3", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", "=", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", 0, " ", " ", " ", " ", " ", " "]
        ],
        respostas: [1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 5]
    }
];

// gabarito esperado de cada célula dropável (linha-coluna → número correto)
const gabaritos = {
    0: {
        "2-4": 2,
        "2-8": 4,
        "4-2": 4,
        "4-6": 3,
        "4-8": 1,
        "6-0": 2,
        "6-10": 3,
        "6-12": 2,
        "10-4": 5,
        "10-6": 2,
        "12-6": 3
    }
};

// --- ESTADO DO JOGO ---
let faseAtual = 0;
let vidas = 5;
let jogoEncerrado = false;

// Atualiza visualmente os corações
function atualizarVidasUI() {
    const vidasEl = document.getElementById('vidas-container');
    if (!vidasEl) return;

    let coracoes = '';
    for (let i = 1; i <= 5; i++) {
        coracoes += i <= vidas ? '❤️' : '🤍';
    }
    vidasEl.innerHTML = coracoes;
}

// Mensagem de status (acerto, erro, alerta, etc)
function mostrarMensagemStatus(msg, cor = '#000') {
    const fb = document.getElementById('feedback-cruzadinha');
    if (fb) {
        fb.textContent = msg;
        fb.style.color = cor;
        fb.style.fontWeight = 'bold';
    }
}

// Bloqueia o tabuleiro quando acabou a vida
function gameOver() {
    jogoEncerrado = true;

    // trava peças pra não arrastar mais
    document.querySelectorAll('.resposta').forEach(el => {
        el.setAttribute('draggable', 'false');
        el.style.opacity = '0.4';
        el.style.cursor = 'not-allowed';
    });

    // mensagem embaixo dos corações
    mostrarMensagemStatus('💀 Suas vidas acabaram!', '#b71c1c');
}

// Mostra o modal de "acabaram as vidas"
function abrirGameOverModal() {
    const overlay = document.getElementById('gameover-overlay');
    const msgBox = document.getElementById('gameover-msg');
    const botaoOk = document.getElementById('btn-gameover-ok');

    if (!overlay || !msgBox || !botaoOk) return;

    msgBox.textContent = 'As vidas acabaram! Você vai precisar recomeçar.';
    overlay.style.display = 'flex';

    // garante que cada clique execute só uma vez
    botaoOk.onclick = function () {
        overlay.style.display = 'none';
        reiniciarFase();
    };
}

// Reinicia a fase atual, restaurando vidas
function reiniciarFase() {
    vidas = 5;
    jogoEncerrado = false;
    carregarFase(faseAtual);
    mostrarMensagemStatus('Você ganhou 5 novas vidas. Tente novamente!', '#1976d2');
}

// Monta a fase visualmente
function carregarFase(n) {
    faseAtual = n;
    const { cruzada, respostas } = fases[n];

    let html = '<table style="border-collapse:collapse; border:none;">';

    for (let r = 0; r < cruzada.length; r++) {
        html += '<tr>';

        for (let c = 0; c < cruzada[r].length; c++) {
            const celula = cruzada[r][c];

            if (celula === 0) {
                html += `
                    <td class="dropzone"
                        data-row="${r}"
                        data-col="${c}"
                        ondrop="drop(event)"
                        ondragover="allowDrop(event)"
                        style="
                            width:40px;
                            height:40px;
                            background:#f9f9f9;
                            border:1px solid #ccc;
                            text-align:center;
                            vertical-align:middle;
                            font-weight:bold;
                        ">
                    </td>
                `;
            } else if (celula === " ") {
                html += `
                    <td
                        style="
                            width:40px;
                            height:40px;
                            background:transparent;
                            border:none;
                        ">
                    </td>
                `;
            } else {
                html += `
                    <td
                        style="
                            width:40px;
                            height:40px;
                            border:1px solid #ccc;
                            text-align:center;
                            vertical-align:middle;
                            font-weight:bold;
                        ">
                        ${celula}
                    </td>
                `;
            }
        }

        html += '</tr>';
    }

    html += '</table>';

    // coloca a tabela pronta
    container.innerHTML = html;

    // monta as bolinhas de resposta
    if (respostasContainer) {
        respostasContainer.innerHTML = respostas
            .map((r, i) => `
                <div class="resposta cor-${r}"
                     draggable="true"
                     ondragstart="drag(event)"
                     ondragend="dragend(event)"
                     id="resp-${n}-${i}"
                     style="
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        width:40px;
                        height:40px;
                        min-width:40px;
                        min-height:40px;
                        border-radius:50%;
                        font-weight:bold;
                        font-size:18px;
                        cursor:grab;
                        user-select:none;
                    ">
                    ${r}
                </div>
            `)
            .join("");

        // permitir devolver peça pro banco
        respostasContainer.ondrop = retornarResposta;
        respostasContainer.ondragover = allowDrop;
    }

    // destrava as peças se tava em game over
    document.querySelectorAll('.resposta').forEach(el => {
        el.setAttribute('draggable', 'true');
        el.style.opacity = '1';
        el.style.cursor = 'grab';
    });

    // reset flags
    jogoEncerrado = false;

    // atualiza corações
    atualizarVidasUI();

    // limpa mensagem de status
    mostrarMensagemStatus('');
}

// Valida todas as respostas de uma vez (função opcional de auditoria geral)
function validarRespostas() {
    const dropzones = container.querySelectorAll('.dropzone');
    const gabaritoFase = gabaritos[faseAtual] || {};
    let total = 0;
    let corretas = 0;

    dropzones.forEach(dz => {
        const row = dz.dataset.row;
        const col = dz.dataset.col;
        const chave = `${row}-${col}`;
        const esperado = gabaritoFase[chave];

        dz.style.transition = 'background-color 200ms ease';
        dz.style.outline = '';

        if (typeof esperado !== 'undefined') {
            total++;
            if (dz.firstElementChild) {
                const valor = Number(dz.firstElementChild.textContent.trim());
                if (!isNaN(valor) && valor === esperado) {
                    dz.style.background = '#c8e6c9';
                    dz.dataset.correta = 'true';
                    corretas++;
                } else {
                    dz.style.background = '#ffcdd2';
                    dz.dataset.correta = 'false';
                }
            } else {
                dz.style.background = '#fff9c4';
                dz.dataset.correta = 'false';
            }
        }
    });

    const feedbackEl = document.getElementById('feedback-cruzadinha');
    if (feedbackEl) {
        feedbackEl.textContent = `${corretas} de ${total} corretas`;
        if (total > 0 && corretas === total) {
            feedbackEl.textContent += ' — Parabéns! Todas corretas.';
            feedbackEl.style.color = '#2e7d32';
        } else {
            feedbackEl.style.color = '#000';
        }
    }
}

// --- DRAG & DROP ---
function drag(ev) {
    if (jogoEncerrado) return; // se acabou o jogo, não deixa nem começar a arrastar

    try {
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData('text/plain', ev.target.id);
        if (ev.dataTransfer.setDragImage) {
            ev.dataTransfer.setDragImage(ev.target, 20, 20);
        }
    } catch (e) {
        try { ev.dataTransfer.setData('text', ev.target.id); } catch (_) {}
    }

    setTimeout(() => {
        ev.target.style.display = 'none';
    }, 0);
}

function allowDrop(ev) {
    ev.preventDefault();
    try { ev.dataTransfer.dropEffect = 'move'; } catch (e) {}
}

function drop(ev) {
    ev.preventDefault();

    // se já acabou o jogo, ignora qualquer tentativa de soltar
    if (jogoEncerrado) return;

    let data = null;
    try { data = ev.dataTransfer.getData('text/plain'); } catch (e) {}
    if (!data) {
        try { data = ev.dataTransfer.getData('text'); } catch (e) {}
    }

    const resposta = document.getElementById(data);

    let dropzone = ev.target;
    if (!dropzone || !dropzone.classList || !dropzone.classList.contains('dropzone')) {
        dropzone = ev.target.closest ? ev.target.closest('.dropzone') : null;
    }

    if (
        resposta &&
        dropzone &&
        dropzone.classList.contains('dropzone') &&
        dropzone.children.length === 0
    ) {
        const originalParent = resposta.parentElement;

        resposta.style.display = 'flex';
        dropzone.appendChild(resposta);

        if (
            originalParent &&
            originalParent.classList &&
            originalParent.classList.contains('dropzone') &&
            originalParent !== dropzone
        ) {
            originalParent.style.background = '';
            delete originalParent.dataset.correta;
        }

        // validação imediata daquela célula
        const row = dropzone.dataset.row;
        const col = dropzone.dataset.col;
        const chave = `${row}-${col}`;
        const gabaritoFase = gabaritos[faseAtual] || {};
        const esperado = gabaritoFase[chave];

        dropzone.style.outline = '';

        if (typeof esperado !== 'undefined') {
            const valor = Number(resposta.textContent.trim());
            if (!isNaN(valor) && valor === esperado) {
                // ACERTO ✅
                dropzone.style.background = '#c8e6c9';
                dropzone.dataset.correta = 'true';
            } else {
                // ERRO ❌
                dropzone.style.background = 'rgba(255,0,0,0.6)';
                dropzone.dataset.correta = 'false';

                // perde 1 vida
                vidas = vidas - 1;
                atualizarVidasUI();

                // aviso com 1 vida restante
                if (vidas === 1) {
                    mostrarMensagemStatus(
                        '⚠️ Cuidado! Mais um erro e você vai ter que recomeçar!',
                        '#f57c00'
                    );
                }

                // acabou as vidas
                if (vidas <= 0) {
                    gameOver();           // trava o jogo e mostra msg vermelha
                    abrirGameOverModal(); // abre o popup com botão OK
                }
            }
        } else {
            // célula que não precisa validar (só por segurança)
            dropzone.style.background = '';
            delete dropzone.dataset.correta;
        }
    }
}

function dragend(ev) {
    // se ainda existe o elemento, volta a aparecer
    if (document.getElementById(ev.target.id)) {
        ev.target.style.display = "flex";
    }
}

// Soltar de volta no banco de respostas
function retornarResposta(ev) {
    ev.preventDefault();

    let data = null;
    try { data = ev.dataTransfer.getData('text/plain'); } catch (e) {}
    if (!data) {
        try { data = ev.dataTransfer.getData('text'); } catch (e) {}
    }

    const resposta = document.getElementById(data);

    if (resposta && ev.currentTarget.id === 'respostas-container') {
        const parent = resposta.parentElement;
        if (parent && parent.classList && parent.classList.contains('dropzone')) {
            parent.style.background = '';
            delete parent.dataset.correta;
        }

        ev.currentTarget.appendChild(resposta);
        resposta.style.display = 'flex';
    }
}

// --- LEGENDA LATERAL ---
function carregarLegenda() {
    const legendaContainer = document.querySelector('.legenda-container');
    const numerosPorExtenso = [
        "UM", "DOIS", "TRÊS", "QUATRO", "CINCO",
        "SEIS", "SETE", "OITO", "NOVE", "DEZ"
    ];

    let htmlLegenda = '';
    for (let i = 1; i <= 10; i++) {
        htmlLegenda += `
            <div class="legenda-item">
                <span class="legenda-numero cor-${i}">${i}</span>
                <span class="legenda-nome cor-${i}">${numerosPorExtenso[i - 1]}</span>
            </div>
        `;
    }
    legendaContainer.innerHTML = htmlLegenda;
}

// --- START ---
carregarFase(0);
carregarLegenda();
