// --- INICIALIZAÇÃO ---
const container = document.getElementById('cruzadinha-container');
const respostasContainer = document.getElementById('respostas-container');



// 🔸 Renderiza a imagem para números OU símbolos (+, -, =)
function getImagemSprite(valor) {
    // valor pode ser '1'..'9', '+', '-', '='
    const safe = String(valor);
    return `
        <img 
            src="./style/imagens/Numerais/${safe}.png" 
            alt="${safe}" 
            style="
                width: 100%;
                height: 100%;
                object-fit: contain;
                pointer-events: none;
                user-select: none;
                background: transparent !important;
                mix-blend-mode: multiply;
                display: block;
            "
        />
    `;
}

function tocarSom(arquivo) {
    const audio = new Audio(arquivo);
    audio.play();
}

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

// gabarito esperado
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

function atualizarVidasUI() {
    const vidasEl = document.getElementById('vidas-container');
    if (!vidasEl) return;
    let coracoes = '';
    for (let i = 1; i <= 5; i++) coracoes += i <= vidas ? '❤️' : '🤍';
    vidasEl.innerHTML = coracoes;
}

function mostrarMensagemStatus(msg, cor = '#000') {
    const fb = document.getElementById('feedback-cruzadinha');
    if (fb) {
        fb.textContent = msg;
        fb.style.color = cor;
        fb.style.fontWeight = 'bold';
    }
}

function gameOver() {
    jogoEncerrado = true;
    document.querySelectorAll('.resposta').forEach(el => {
        el.setAttribute('draggable', 'false');
        el.style.opacity = '0.4';
        el.style.cursor = 'not-allowed';
    });
    mostrarMensagemStatus('💀 Suas vidas acabaram!', '#b71c1c');
}

function abrirGameOverModal() {
    const overlay = document.getElementById('gameover-overlay');
    const msgBox = document.getElementById('gameover-msg');
    const botaoOk = document.getElementById('btn-gameover-ok');
    if (!overlay || !msgBox || !botaoOk) return;

    msgBox.textContent = 'As vidas acabaram! Você vai precisar recomeçar.';
    overlay.style.display = 'flex';

    botaoOk.onclick = function () {
        overlay.style.display = 'none';
        reiniciarFase();
    };
}

function reiniciarFase() {
    vidas = 5;
    jogoEncerrado = false;
    carregarFase(faseAtual);
    mostrarMensagemStatus('Você ganhou 5 novas vidas. Tente novamente!', '#1976d2');
}

// --- MONTA A FASE VISUALMENTE ---
function carregarFase(n) {
    faseAtual = n;
    const { cruzada, respostas } = fases[n];
    let html = '<table style="border-collapse:collapse; border:none; background:transparent;">';

    for (let r = 0; r < cruzada.length; r++) {
        html += '<tr style="background:transparent;">';
        for (let c = 0; c < cruzada[r].length; c++) {
            const celula = cruzada[r][c];

            if (celula === 0) {
                // célula dropável - fundo branco + sombra difusa
                html += `
                    <td class="dropzone"
                        data-row="${r}"
                        data-col="${c}"
                        ondrop="drop(event)"
                        ondragover="allowDrop(event)"
                        style="
                            width:40px;
                            height:40px;
                            background:white;
                            border:1px solid #000;
                            box-shadow: 0 3px 8px rgba(0,0,0,0.5);
                            text-align:center;
                            vertical-align:middle;
                        ">
                    </td>`;
            } else if (celula === " ") {
                // célula vazia (sem sombra)
                html += `
                    <td style="
                        width:40px;
                        height:40px;
                        background:transparent;
                        border:none;
                    "></td>`;
            } else {
                // célula com conteúdo fixo (número OU símbolo)
                const valor = String(celula);
                const ehNumeroSimples = /^[0-9]$/.test(valor);
                const ehSimbolo = ['+', '-', '='].includes(valor);

                // renderiza sempre como imagem (número OU símbolo)
                const blocoImagem = `
                    <div style="
                        width:40px;
                        height:40px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:white;
                        border:none;
                        padding:0;
                    ">
                        ${getImagemSprite(valor)}
                    </div>
                `;

                const conteudoCelula = (ehNumeroSimples || ehSimbolo) ? blocoImagem : valor;

                html += `
                    <td style="
                        width:40px;
                        height:40px;
                        border:1px solid #000;
                        background:white;
                        box-shadow: 0 3px 8px rgba(0,0,0,0.5);
                        text-align:center;
                        vertical-align:middle;
                        padding:0;
                    ">
                        ${conteudoCelula}
                    </td>`;
            }
        }
        html += '</tr>';
    }
    html += '</table>';

    container.innerHTML = html;

    if (respostasContainer) {
        respostasContainer.innerHTML = respostas.map((valor, i) => `
            <div class="resposta cor-${valor}"
                 draggable="true"
                 ondragstart="drag(event)"
                 ondragend="dragend(event)"
                 id="resp-${n}-${i}"
                 data-numero="${valor}"
                 style="
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    width:40px;
                    height:40px;
                    border:2px solid #000;
                    border-radius:0;
                    cursor:grab;
                    user-select:none;
                    background:transparent !important;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.5);
                    box-sizing:border-box;
                    padding:0;
                    overflow:hidden;
                 ">
                ${getImagemSprite(valor)}
            </div>
        `).join("");

        respostasContainer.ondrop = retornarResposta;
        respostasContainer.ondragover = allowDrop;
    }

    document.querySelectorAll('.resposta').forEach(el => {
        el.setAttribute('draggable', 'true');
        el.style.opacity = '1';
        el.style.cursor = 'grab';
    });

    jogoEncerrado = false;
    atualizarVidasUI();
    mostrarMensagemStatus('');
}

// --- DRAG & DROP ---
function drag(ev) {
    if (jogoEncerrado) return;
    try {
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData('text/plain', ev.target.id);
        if (ev.dataTransfer.setDragImage) ev.dataTransfer.setDragImage(ev.target, 20, 20);
    } catch (e) {
        try { ev.dataTransfer.setData('text', ev.target.id); } catch (_) {}
    }
    setTimeout(() => ev.target.style.display = 'none', 0);
}

function allowDrop(ev) { ev.preventDefault(); }

function drop(ev) {
    ev.preventDefault();
    if (jogoEncerrado) return;

    let data = ev.dataTransfer.getData('text/plain');
    const resposta = document.getElementById(data);
    let dropzone = ev.target.closest('.dropzone');

    if (resposta && dropzone && dropzone.children.length === 0) {
        const originalParent = resposta.parentElement;
        resposta.style.display = 'flex';
        dropzone.appendChild(resposta);

        if (originalParent && originalParent.classList.contains('dropzone') && originalParent !== dropzone) {
            originalParent.style.background = 'white';
            delete originalParent.dataset.correta;
        }

        const row = dropzone.dataset.row;
        const col = dropzone.dataset.col;
        const chave = `${row}-${col}`;
        const esperado = (gabaritos[faseAtual] || {})[chave];

        if (typeof esperado !== 'undefined') {
            const valor = Number(resposta.dataset.numero);
            if (valor === esperado) {
                // SEU CÓDIGO DE ACERTO ORIGINAL
                dropzone.style.background = '#c8e6c9';
                resposta.style.background = '#c8e6c9';
                dropzone.dataset.correta = 'true';
                
                // 👇 ÚNICA ADIÇÃO PARA ACERTO
                tocarSom('./style/bgm/acerto.mp3');

            } else {
                // SEU CÓDIGO DE ERRO ORIGINAL
                dropzone.style.background = 'rgba(255,0,0,0.6)';
                resposta.style.background = 'rgba(255,0,0,0.6)';
                dropzone.dataset.correta = 'false';

                // 👇 ÚNICA ADIÇÃO PARA ERRO
                tocarSom('./style/bgm/erro.mp3');

                vidas--;
                atualizarVidasUI();

                if (vidas === 1) {
                    mostrarMensagemStatus('⚠️ Cuidado! Mais um erro e você vai ter que recomeçar!', '#f57c00');
                }

                if (vidas <= 0) {
                    gameOver();
                    abrirGameOverModal();
                }
            }
        } else {
            dropzone.style.background = 'white';
            resposta.style.background = 'white';
            dropzone.dataset.correta = '';
        }
    }
}

function dragend(ev) {
    if (document.getElementById(ev.target.id)) ev.target.style.display = "flex";
}

function retornarResposta(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData('text/plain');
    const resposta = document.getElementById(data);

    if (resposta && ev.currentTarget.id === 'respostas-container') {
        const parent = resposta.parentElement;
        if (parent && parent.classList.contains('dropzone')) {
            parent.style.background = 'white';
            delete parent.dataset.correta;
        }
        resposta.style.background = 'transparent';
        ev.currentTarget.appendChild(resposta);
        resposta.style.display = 'flex';
    }
}

// --- START ---
carregarFase(0);

// forçando um novo commit
