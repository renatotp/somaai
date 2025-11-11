// --- CARREGAMENTO DO FUNDO ALEATÓRIO ---

// 1. Liste os nomes dos seus arquivos de fundo aqui
const listaDeFundos = [
  'verde.jpg',
  'rosinha.png',
  'laranja.jpg',
  'especial.png' // Adicione quantas imagens você tiver na pasta 'fundos'
];

// 2. Esta função é executada assim que o script carrega
(function() {
  // 3. Escolhe um nome de arquivo aleatório da lista
  const fundoEscolhido = listaDeFundos[Math.floor(Math.random() * listaDeFundos.length)];

  // 4. Aplica o fundo e a animação no body
  document.body.style.backgroundImage = `url('./assets/imagens/fundos/${fundoEscolhido}')`;
  document.body.style.animation = 'rolar-fundo 80s linear infinite';
})();

// --- FIM DO SCRIPT DE FUNDO ---

// --- INICIALIZAÇÃO ---
const container = document.getElementById('cruzadinha-container');
const respostasContainer = document.getElementById('respostas-container');

// 🔸 Renderiza a imagem para números OU símbolos (+, -, =)
function getImagemSprite(valor) {
    // valor pode ser '1'..'9', '+', '-', '='
    const safe = String(valor);
    return `
        <img 
            src="./assets/imagens/Numerais/${safe}.png" 
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
// FASE 0 é a que já estava no seu arquivo (você chamou de fase 1, mas no código ela é índice 0).
// Abaixo eu adicionei as fases 2, 3, 4, 5 e a EXTRA (como fase 6 = índice 5).
let fases = [
    // --- FASE 1 (a que estava no arquivo) ---
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
    },

    // --- FASE 2 (a próxima que você vai editar depois) ---
    // você pode manter essa vazia ou reaproveitar a que já estava começada
    {
        cruzada: [
            [" ", "3", "+", "3", "=", 0, " ", " ", " ", " ", " ", " ", " "],
            [" ", "-", " ", " ", " ", "-", " ", " ", " ", " ", " ", " ", " "],
            [" ", "2", " ", "2", " ", "2", " ", 0, " ", " ", " ", " ", " "],
            [" ", "=", " ", "+", " ", "=", " ", "+", " ", " ", " ", " ", " "],
            [" ", 0, "+", "3", "=", 0, "+", "1", "=", 0, " ", " ", " "],
            [" ", "+", " ", "=", " ", " ", " ", "=", " ", " ", " ", " ", " "],
            [" ", "3", " ", 0, " ", 0, "-", "3", "=", "2", " ", " ", " "],
            [" ", "=", " ", " ", " ", " ", " ", " ", " ", "+", " ", " ", " "],
            [" ", 0, " ", " ", " ", "2", " ", "2", "+", 0, "=", 0, " "],
            [" ", " ", " ", " ", " ", "+", " ", " ", " ", "=", " ", " ", " "],
            [" ", " ", " ", " ", " ", "4", "-", 0, "=", "3", " ", " ", " "],
            [" ", " ", " ", " ", " ", "=", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", 0, " ", " ", " ", " ", " ", " ", " "]
        ],
        respostas: [6, 1, 4, 5, 5, 5, 4, 2, 1, 3, 1, 6]
    },

    // --- FASE 3 ---
    {
        cruzada: [
            [" ", " ", " ", " ", "1", " ", " ", " ", " ", " ", "2", " ", " "],
            [" ", " ", " ", " ", "+", " ", " ", " ", " ", " ", "+", " ", " "],
            [0, "-", "3", "=", 0, " ", 0, "+", "2", "=", 0, " ", " "],
            [" ", " ", " ", " ", "=", " ", "-", " ", " ", " ", "=", " ", " "],
            [" ", " ", " ", " ", "5", "-", "1", "=", 0, " ", 0, " ", " "],
            [" ", " ", " ", " ", " ", " ", "=", " ", "-", " ", " ", " ", " "],
            [" ", " ", " ", " ", "1", "+",   0, "=", "3", " ", " ", " ", " "],
            [" ", " ", " ", " ", "+", " ", " ", " ", "=", " ", " ", " ", " "],
            [" ", " ", 0, "-", 0, "=", "1", " ", 0, "+", "3", "=", 0],
            [" ", " ", "-", " ", "=", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", "4", " ", "7", "-", "1", "=", 0, " ", " ", " ", " "],
            [" ", " ", "=", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", 0, " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
        ],

        respostas: [7, 4 ,3 ,5 ,4 ,7 ,2 ,7 ,6 ,1 ,4 ,6 ,3]
    },

    // --- FASE 4 ---
    {
        cruzada: [
            [" ", " ", " ", " ", " ", " ", " ", " ", "3", "+", "5", "=", 0],
            [" ", " ", " ", " ", " ", " ", " ", " ", "+", " ", " ", " ", " "],
            ["3", "+", "2", "=", 0, " ", " ", " ", 0, " ", " ", " ", " "],
            [" ", " ", " ", " ", "+", " ", " ", " ", "=", " ", " ", " ", " "],
            [" ", " ", 0, " ", 0, "+", "6", "=", 0, "-", 0, "=", "1"],
            [" ", " ", "-", " ", "=", " ", "-", " ", " ", " ", " ", " ", " "],
            ["8", "-", 0, "=", "6", " ", "1", " ", " ", " ", " ", " ", " "],
            [" ", " ", "=", " ", " ", " ", "=", " ", " ", " ", " ", " ", " "],
            [" ", " ", "3", " ", " ", " ", 0, "-", "3", "=", 0, " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", "+", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", 0, " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", "=", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " ", "8", " ", " ", " ", " "]
        ],
        respostas: [5, 4, 5, 1, 7, 8, 6, 2, 5, 2, 5]
    },
    // --- FASE 5 ---
    {
        cruzada: [
            [" ", " ", "7", "-", "2", "=", 0, " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", "+", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", 0, "+", "5", "=", 0, " ", " ", " ", " "],
            [" ", " ", " ", " ", "=", " ", " ", " ", "-", " ", " ", " ", " "],
            [" ", " ", "5", "+", "4", "=", 0, " ", "5", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", "-", " ", "=", " ", " ", " ", " "],
            ["1", "+", 0, "=", "9", " ", "3", " ", 0, "+", 0, "=", "9"],
            [" ", " ", "-", " ", " ", " ", "=", " ", " ", " ", " ", " ", "-"],
            [" ", " ", "2", " ", "3", "+", 0, "=", 0, " ", " ", " ", "8"],
            [" ", " ", "=", " ", "-", " ", " ", " ", " ", " ", " ", " ", "="],
            [" ", " ", 0, "+", 0, "=", "8", " ", " ", " ", " ", " ", 0],
            [" ", " ", " ", " ", "=", " ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", "1", " ", " ", " ", " ", " ", " ", " ", " "]
        ],
        respostas: [5, 2, 7, 9, 8, 2, 7, 6, 9, 6, 2, 1]
    },

    // --- FASE 6 (EXTRA / 6ª fase) ---
    {
        cruzada: [
            [" ", " ", " ", " ", " ", " ", "5", " ", " ", "3", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", "B", " ", " ", "B", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", 0, " ", " ", 0, " ", " ", " "],
            [" ", " ", " ", "2", " ", " ", 0, " ", " ", 0, " ", " ", " "],
            [" ", " ", " ", "B", "9", "F", 0, 0, 0, 0, " ", " ", " "],
            [" ", " ", " ", 0, " ", " ", 0, " ", " ", 0, " ", " ", " "],
            [" ", "8", "F", 0, 0, 0, 0, " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", 0, " ", " ", " ", " ", "7", " ", " ", " ", " "],
            [" ", "6", "F", 0, 0, 0, 0, " ", "B", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", "1", " ", 0, " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", "B", " ", 0, " ", " ", " ", " "],
            [" ", " ", " ", "4", "F", 0, 0, 0, 0, 0, 0, " ", " "],
            [" ", " ", " ", " ", " ", " ", 0, " ", 0, " ", " ", " ", " "]
        ],
        respostas: [
            "C", "T", "I", "R","N", "O", "V", "E", "D", "C", "S", "O", "I", "T", "O", "I", "S", "E", "I", "S",
            "S", "E", "Q", "U", "A", "T", "R", "O", "M", "E"
        ]
    },
];

// gabarito esperado
// por enquanto só a fase 0 tem gabarito, as demais ficam vazias pra você preencher depois
const gabaritos = {
    // Fase 1
    0: {
        "2-4": 2, "2-8": 4, "4-2": 4, "4-6": 3, "4-8": 1,
        "6-0": 2, "6-10": 3, "6-12": 2, "10-4": 5, "10-6": 2, "12-6": 3
    },
    // Fase 2
    1: {
   "0-5": 6,
        "2-7": 2,
        "4-1": 1,
        "4-5": 4,
        "4-9": 5,
        "6-3": 5,
        "6-5": 5,
        "8-1": 4,
        "8-9": 1,
        "8-11": 3,
        "10-7": 1,
        "12-5": 6
    },
    // Fase 3
    2: {
    "2-0": 7,
    "2-4": 4,
    "2-6": 3,
    "2-10": 5,
    "4-8": 4,
    "4-10": 7,
    "6-6": 2,
    "8-2": 7,
    "8-4": 6,
    "8-8": 1,
    "8-12": 4,
    "10-8": 6,
    "12-2": 3
    },
    // Fase 4
    3: {
        "0-12": 8, "2-4": 5, "2-8": 4, "4-2": 5, "4-4": 1,
        "4-8": 7, "4-10": 6, "6-2": 2, "8-6": 5, "8-10": 2, "10-8": 5
    },
    // Fase 5
    4: {
        "0-6": 5, "2-4": 2, "2-8": 7, "4-6": 9, "6-2": 8,
        "6-8": 2, "6-10": 7, "8-6": 6, "8-8": 9,
        "10-2": 6, "10-4": 2, "10-12": 1
    },
    // Fase 6
    5: {
        "2-6": "C", "2-9": "T", "3-6": "I", "3-9": "R",
        "4-6": "N", "4-7": "O", "4-8": "V", "4-9": "E",
        "5-3": "D", "5-6": "C", "5-9": "S", "6-3": "O",
        "6-4": "I", "6-5": "T", "6-6": "O", "7-3": "I",
        "8-3": "S", "8-4": "E", "8-5": "I", "8-6": "S",
        "9-8": "S", "10-8": "E", "11-5": "Q", "11-6": "U",
        "11-7": "A", "11-8": "T", "11-9": "R", "11-10": "O",
        "12-6": "M", "12-8": "E"
    }
};


// --- ESTADO DO JOGO ---
let faseAtual = 0; // Esta variável será atualizada pelo código de carregamento
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
    carregarFase(faseAtual); // Recarrega a fase atual
    mostrarMensagemStatus('Você ganhou 5 novas vidas. Tente novamente!', '#1976d2');
}

// --- MONTA A FASE VISUALMENTE ---
function carregarFase(n) {
    // Verifica se a fase 'n' existe nos dados
    if (!fases[n] || !gabaritos[n]) {
        console.error(`Fase ${n} não encontrada! Carregando fase 0.`);
        n = 0; // Garante que o jogo não quebre
    }

    faseAtual = n; // Define a fase atual do jogo

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

                const ehImagemEspecial = ['B', 'F'].includes(valor);


                // renderiza sempre como imagem (número OU símbolo)
                // OBS: para a fase EXTRA, que tem "C", "T", "O", ">" e "\\/", isso aqui vai cair no else e mostrar texto mesmo.
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

                const conteudoCelula = (ehNumeroSimples || ehSimbolo || ehImagemEspecial) ? blocoImagem : valor;

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
        respostasContainer.innerHTML = (respostas || []).map((valor, i) => `
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
        try { ev.dataTransfer.setData('text', ev.target.id); } catch (_) { }
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

        // 👇👇 AQUI está a correção
        if (typeof esperado !== 'undefined') {
            const valorBruto = resposta.dataset.numero; // vem como string sempre
            let acertou = false;

            if (typeof esperado === 'number') {
                // fases numéricas
                acertou = Number(valorBruto) === esperado;
            } else {
                // fase de letras (fase 5)
                // normaliza para maiúsculo pra evitar erro
                acertou = String(valorBruto).toUpperCase() === String(esperado).toUpperCase();
            }

            if (acertou) {
                dropzone.style.background = '#c8e6c9';
                resposta.style.background = '#c8e6c9';
                dropzone.dataset.correta = 'true';

                tocarSom('./assets/bgm/acerto.mp3');
                verificarVitoria();
            } else {
                dropzone.style.background = 'rgba(255,0,0,0.6)';
                resposta.style.background = 'rgba(255,0,0,0.6)';
                dropzone.dataset.correta = 'false';

                tocarSom('./assets/bgm/erro.mp3');

                vidas--;
                atualizarVidasUI();

                if (vidas === 1) {
                    mostrarMensagemStatus('⚠️ Cuidado! Mais um erro e você vai ter que recomeçar!', '#f57c00');
                }

                if (vidas <= 0) {

                    tocarSom('./assets/bgm/falha.mp3');
                    
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


// --- PROGRESSO / VITÓRIA ---
/** Salva o progresso no localStorage */
function desbloquearProximaFase() {
    let proximoNivel = faseAtual + 1;
    let nivelMaximoSalvo = parseInt(localStorage.getItem('nivelMaximoSomaAI')) || 0;
    if (proximoNivel > nivelMaximoSalvo) {
        localStorage.setItem('nivelMaximoSomaAI', proximoNivel);
        console.log("Progresso salvo! Nível " + proximoNivel + " desbloqueado.");
    }
}

/** Verifica se o jogador completou todas as respostas da fase */
function verificarVitoria() {
  const gabaritoFase = gabaritos[faseAtual];
  if (!gabaritoFase) return;

  const totalRespostas = Object.keys(gabaritoFase).length;
  const respostasCorretas = document.querySelectorAll('.dropzone[data-correta="true"]').length;

  // Verifica se o número de acertos é igual ao total de respostas
  if (respostasCorretas === totalRespostas) {
    
    // --- O JOGADOR VENCEU! ---
    
    // 1. Salva o progresso
    desbloquearProximaFase();
    tocarSom('./assets/bgm/vitoria.mp3');

    // 2. Pega os elementos do novo modal
    const overlay = document.getElementById('vitoria-overlay');
    const btnProxima = document.getElementById('btn-vitoria-proxima');
    const msgVitoria = document.getElementById('vitoria-msg');
    
    // 3. Calcula qual é a próxima fase
    const proximaFaseId = faseAtual + 1;
    
    // 4. Configura o link do botão "Próxima Fase"
    if (fases[proximaFaseId]) {
      // Se a próxima fase existe, configura o link
      btnProxima.href = `jogo.html?fase=${proximaFaseId}`;
      btnProxima.style.display = 'block'; // Garante que ele apareça
      msgVitoria.textContent = 'Você desbloqueou a próxima fase!';
    } else {
      // É a última fase! Esconde o botão "Próxima Fase"
      btnProxima.style.display = 'none';
      msgVitoria.textContent = 'Parabéns, você completou todas as fases!';
    }

    // 5. Mostra o modal de vitória
    overlay.style.display = 'flex';
  }
}



// --- START ---
// 1. Pega os parâmetros da URL (ex: ?fase=1)
const urlParams = new URLSearchParams(window.location.search);
// 2. Converte o parâmetro 'fase' para um número. Se não existir, usa 0.
let faseId = parseInt(urlParams.get('fase')) || 0;
// 3. Verifica se a faseId é válida
if (faseId < 0 || faseId >= fases.length || !fases[faseId]) {
    console.warn("ID da fase inválido. Carregando fase 0.");
    faseId = 0;
}
// 4. Carrega a fase correta vinda da URL
carregarFase(faseId);

// forçando um novo commit
