document.getElementById('calcularBtn').addEventListener('click', calcularProporcao);
document.getElementById('toggleTheme').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

document.getElementById('toggleLang').addEventListener('click', alternarIdioma);

function calcularProporcao() {
  const taraA = parseFloat(document.getElementById('taraA').value);
  const cheioA = parseFloat(document.getElementById('cheioA').value);
  const taraB = parseFloat(document.getElementById('taraB').value);
  const cheioB = parseFloat(document.getElementById('cheioB').value);

  if ([taraA, cheioA, taraB, cheioB].some(isNaN)) return;

  const pesoA = cheioA - taraA;
  const pesoB = cheioB - taraB;

  if (pesoA <= 0 || pesoB <= 0) return;

  let resina, endurecedor, origem;

  if (pesoA > pesoB) {
    resina = pesoA;
    endurecedor = pesoB;
    origem = "Resina: A, Endurecedor: B";
  } else {
    resina = pesoB;
    endurecedor = pesoA;
    origem = "Resina: B, Endurecedor: A";
  }

  const proporcao = (endurecedor / resina).toFixed(2);
  const valor = (proporcao * 100).toFixed(2);

  const dentroIntervalo = valor >= 28 && valor <= 32;
  const resultado = `${dentroIntervalo ? '✅' : '❌'} Proporção: ${valor} (Endurecedor ÷ Resina)\n📘 ${origem}\n${dentroIntervalo ? '✅ Dentro do intervalo (28 a 32)' : '❌ Fora do intervalo (28 a 32)'}`;

  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.textContent = resultado;
  resultadoDiv.style.backgroundColor = dentroIntervalo ? '#d4edda' : '#f8d7da';
}

let idiomaAtual = 'pt';

function alternarIdioma() {
  idiomaAtual = idiomaAtual === 'pt' ? 'zh' : 'pt';

  document.querySelectorAll('label').forEach(label => {
    const texto = label.dataset[idiomaAtual];
    if (texto) label.textContent = texto;
  });

  document.getElementById('titulo').textContent = idiomaAtual === 'pt'
    ? 'Calculadora de Proporção'
    : '配比计算器';

  document.getElementById('calcularBtn').textContent = idiomaAtual === 'pt'
    ? 'Calcular Proporção'
    : '计算比例';
}
