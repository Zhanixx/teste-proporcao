const inputs = document.querySelectorAll('input');
const resultadoDiv = document.getElementById('resultado');
const toggleTheme = document.getElementById('toggleTheme');

function calcularProporcao() {
  const taraA = parseFloat(document.getElementById('taraA').value);
  const cheioA = parseFloat(document.getElementById('cheioA').value);
  const taraB = parseFloat(document.getElementById('taraB').value);
  const cheioB = parseFloat(document.getElementById('cheioB').value);

  if (isNaN(taraA) || isNaN(cheioA) || isNaN(taraB) || isNaN(cheioB)) return;

  const pesoA = cheioA - taraA; // resina
  const pesoB = cheioB - taraB; // endurecedor

  if (pesoA <= 0 || pesoB <= 0) return;

  let resina, endurecedor, origem;

  if (pesoA > pesoB) {
    resina = pesoA;
    endurecedor = pesoB;
    origem = "(Resina do balde A / Endurecedor do balde B)";
  } else {
    resina = pesoB;
    endurecedor = pesoA;
    origem = "(Resina do balde B / Endurecedor do balde A)";
  }

  const proporcao = (endurecedor / resina).toFixed(2);
  const valor = parseFloat(proporcao) * 100;

  let status = '';
  if (valor >= 28 && valor <= 32) {
    status = `✅ Proporção: ${valor.toFixed(2)} (Endurecedor ÷ Resina)\n📘 ${origem}\n✅ Dentro do intervalo (28 a 32)`;
    resultadoDiv.style.backgroundColor = "#d4edda";
  } else {
    status = `❌ Proporção: ${valor.toFixed(2)} (Endurecedor ÷ Resina)\n📘 ${origem}\n❌ Fora do intervalo (28 a 32)`;
    resultadoDiv.style.backgroundColor = "#f8d7da";
  }

  resultadoDiv.textContent = status;
}

inputs.forEach(input => {
  input.addEventListener('input', calcularProporcao);
});

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
