// Traduções
const translations = {
  pt: {
    title: "Teste de Proporção",
    taraA: "Tara do Balde A (resina)",
    taraB: "Tara do Balde B (endurecedor)",
    finalA: "Peso com resina (A)",
    finalB: "Peso com endurecedor (B)",
    tecnico: "Técnico Responsável",
    observacoes: "Observações",
    calcular: "Calcular",
    exportarPDF: "Exportar PDF",
    resultado: "Resultado"
  },
  zh: {
    title: "比例测试",
    taraA: "桶 A 的皮重（树脂）",
    taraB: "桶 B 的皮重（固化剂）",
    finalA: "树脂重量 (A)",
    finalB: "固化剂重量 (B)",
    tecnico: "技术员",
    observacoes: "备注",
    calcular: "计算",
    exportarPDF: "导出 PDF",
    resultado: "结果"
  }
};

const body = document.body;
const langSelect = document.getElementById('lang-select');
const themeToggle = document.getElementById('theme-toggle');
const form = document.getElementById('calc-form');
const resultBox = document.getElementById('result-box');
const resultText = document.getElementById('result-text');

// Aplica traduções na interface
function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

// Modo escuro toggle
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  themeToggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
});

// Troca idioma e aplica
langSelect.addEventListener('change', e => {
  applyTranslations(e.target.value);
});

// Aplica idioma inicial
applyTranslations(langSelect.value);

// Função para calcular proporção
function calcularProporcao(taraA, taraB, finalA, finalB) {
  const pesoResina = finalA - taraA;
  const pesoEndurecedor = finalB - taraB;

  if (pesoResina <= 0 || pesoEndurecedor <= 0) {
    throw new Error("Pesos inválidos: valor deve ser maior que tara.");
  }

  const menor = Math.min(pesoResina, pesoEndurecedor);
  const maior = Math.max(pesoResina, pesoEndurecedor);
  const proporcao = maior / menor;

  return {
    proporcao: proporcao.toFixed(2),
    pesoResina: pesoResina.toFixed(3),
    pesoEndurecedor: pesoEndurecedor.toFixed(3)
  };
}

// Manipula submit do formulário
form.addEventListener('submit', e => {
  e.preventDefault();

  const taraA = parseFloat(form.taraA.value);
  const taraB = parseFloat(form.taraB.value);
  const finalA = parseFloat(form.finalA.value);
  const finalB = parseFloat(form.finalB.value);
  const tecnico = form.tecnico.value.trim();
  const observacoes = form.observacoes.value.trim();

  try {
    const resultado = calcularProporcao(taraA, taraB, finalA, finalB);

    const aceitavel = (resultado.proporcao >= 28 && resultado.proporcao <= 32);

    resultText.innerHTML = `
      <strong>Proporção (A / B):</strong> ${resultado.proporcao} <br>
      <strong>Peso Resina (A):</strong> ${resultado.pesoResina} <br>
      <strong>Peso Endurecedor (B):</strong> ${resultado.pesoEndurecedor} <br>
      <strong>Status:</strong> ${aceitavel ? '<span class="text-green-600 font-bold">Dentro do intervalo aceitável (28 - 32)</span>' : '<span class="text-red-600 font-bold">Fora do intervalo aceitável (28 - 32)</span>'} <br>
      <strong>Técnico:</strong> ${tecnico || '—'} <br>
      <strong>Observações:</strong> ${observacoes || '—'}
    `;

    resultBox.classList.remove('hidden');

    // Armazena os dados no histórico localStorage (opcional)
    addHistorico({ ...resultado, tecnico, observacoes, timestamp: new Date().toLocaleString() });

  } catch (error) {
    alert(error.message);
  }
});

// Histórico guardado no localStorage (opcional)
function addHistorico(item) {
  let historico = JSON.parse(localStorage.getItem('historicoTestes') || '[]');
  historico.unshift(item);
  localStorage.setItem('historicoTestes', JSON.stringify(historico));
}

// Exporta PDF
document.getElementById('export-pdf').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  if (resultBox.classList.contains('hidden')) {
    alert("Faça um cálculo primeiro.");
    return;
  }

  doc.setFontSize(18);
  doc.text("Resultado do Teste de Proporção", 14, 22);
  doc.setFontSize(12);
  
  let y = 30;

  const lines = resultText.innerText.split('\n');
  lines.forEach(line => {
    doc.text(line.trim(), 14, y);
    y += 8;
  });

  doc.save("resultado_teste_proporcao.pdf");
});
