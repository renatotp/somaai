// --- CONTROLE DE MÚSICA DE FUNDO ---
const musica = document.getElementById("musicaFundo");
const botao = document.getElementById("botaoMutar");
const icone = document.getElementById("iconeVolume");

// --- Define seus ícones ---
const iconeMutado = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24">
    <path d="M16.5 12a4.5 4.5 0 0 1-1.12 2.96l1.42 1.42A6.49 6.49 0 0 0 19.5 12a6.49 6.49 0 0 0-2.7-5.38l-1.42 1.42A4.5 4.5 0 0 1 16.5 12zM3 10v4h4l5 5V5l-5 5H3zM20 4.41L18.59 3 3 18.59 4.41 20 20 4.41z"/>
  </svg>`;

const iconeAtivo = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24">
    <path d="M3 10v4h4l5 5V5l-5 5H3zm13.5 2a4.5 4.5 0 0 1-1.12 2.96l1.42 1.42A6.49 6.49 0 0 0 19.5 12a6.49 6.49 0 0 0-2.7-5.38l-1.42 1.42A4.5 4.5 0 0 1 16.5 12z"/>
  </svg>`;

// --- (NOVO) LISTA DE MÚSICAS ---
// Nomes dos arquivos com base na sua imagem:
const playlist = [
  'musica1.mp3',
  'musica2.mp3',
  'musica3.mp3'
];

// --- (NOVO) Variável para não repetir a mesma música
let musicaAtual = '';

// --- (NOVO) Função para tocar a próxima música aleatória
function tocarProximaMusica() {
  let proximaMusica;
  
  do {
    proximaMusica = playlist[Math.floor(Math.random() * playlist.length)];
  } while (proximaMusica === musicaAtual && playlist.length > 1);
  
  musicaAtual = proximaMusica;
  
  // 👇 ÚNICA MUDANÇA (CAMINHO CORRIGIDO) 👇
  musica.src = `assets/bgm/${musicaAtual}`; // Ex: "assets/bgm/musica1.mp3"
  
  musica.play().catch(err => console.error("Erro ao tocar próxima música:", err));
}

// --- INÍCIO DA LÓGICA ---

// Define ícone inicial como "MUTADO"
icone.innerHTML = iconeMutado;

// (MODIFICADO) Ativa a PRIMEIRA música após o clique do usuário
document.body.addEventListener("click", () => {
  if (musica.paused) { 
    
    tocarProximaMusica(); 
    
    musica.muted = false;
    icone.innerHTML = iconeAtivo;
  }
}, { once: true }); 

// (NOVO) Quando uma música terminar, toca a próxima
musica.addEventListener("ended", () => {
  tocarProximaMusica(); 
});

// Alterna som ligado/desligado no botão (Sem alterações)
botao.addEventListener("click", () => {
  if (musica.paused) {
      return;
  }
  
  musica.muted = !musica.muted;
  icone.innerHTML = musica.muted ? iconeMutado : iconeAtivo;
});