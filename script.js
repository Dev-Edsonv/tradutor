const inputTexto = document.querySelector(".inputTexto");
const idiomaSelect = document.getElementById("idioma");
const traducao = document.querySelector(".traducao");

// 🔘 Traduzir (SEM backend)
async function traduzir() {
  const texto = inputTexto.value.trim();
  const idioma = idiomaSelect.value; // 👈 já existe, NÃO crie outra

  if (!texto) {
    traducao.innerText = "Digite um texto.";
    return;
  }

  traducao.innerText = "Traduzindo... ⏳";

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      texto
    )}&langpair=pt-BR|${idioma}`;

    console.log("Idioma selecionado:", idioma); // 🔍 debug

    const response = await fetch(url);
    const data = await response.json();

    traducao.innerText =
      data.responseData?.translatedText ||
      "Não foi possível traduzir.";

  } catch (error) {
    traducao.innerText = "Erro ao traduzir.";
  }
}

// 🎤 Microfone (continua igual)
function ouvir() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Seu navegador não suporta reconhecimento de voz.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onstart = () => {
    traducao.innerText = "Ouvindo... 🎤";
  };

  recognition.onresult = (event) => {
    inputTexto.value = event.results[0][0].transcript;
    traducao.innerText = "Texto capturado. Clique em traduzir.";
  };

  recognition.onerror = (event) => {
    traducao.innerText = "Erro ao usar o microfone.";
  };
}

function isMobile() {
  return window.innerWidth <= 768;
}

if (isMobile()) {

  function traduzirAutomatico() {
    if (!inputTexto.value.trim()) return;
    traduzir();
  }

  // Tradução automática ao digitar
  inputTexto.addEventListener("input", () => {
    clearTimeout(window.autoTimeout);
    window.autoTimeout = setTimeout(traduzirAutomatico, 600);
  });

  // 🔄 Tradução automática ao trocar idioma
  idiomaSelect.addEventListener("change", () => {
    traduzirAutomatico();
  });
}



