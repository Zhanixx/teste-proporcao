// Traduções
const translations = {
  pt: {
    proporcaoIdeal: "Teste de Proporção",
    taraA: "Tara do Balde A (resina)",
    taraB: "Tara do Balde B (endurecedor)",
    pesoA: "Peso com resina (A)",
    pesoB: "Peso com endurecedor (B)",
    tecnico: "Técnico Responsável",
    observacoes: "Observações",
    calcular: "Calcular",
    exportarPDF: "Exportar PDF",
    exportarExcel: "Exportar Excel",
    historico: "Histórico de Testes"
  },
  zh: {
    proporcaoIdeal: "比例测试",
    taraA: "桶 A 的皮重（树脂）",
    taraB: "桶 B 的皮重（固化剂）",
    pesoA: "树脂重量 (A)",
    pesoB: "固化剂重量 (B)",
    tecnico: "技术员",
    observacoes: "备注",
    calcular: "计算",
    exportarPDF: "导出 PDF",
    exportarExcel: "导出 Excel",
    historico: "测试历史"
  }
};

const body = document.getElementById('main-body');
const themeToggle = document.getElementById('theme-toggle');
const langSelect = document.getElementById('lang-select');
const form = document.getElementById('calc-form');
const resultBox = document.getElementById('result-box');
const resultText = document.getElementById('result');
const historicoList = document.getElementById('historico');
const chartCtx = document.getElementById('chart').getContext('2d');

let chart;

// Função para aplicar traduções
function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

// Alternar modo escuro
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
});

// Trocar idioma
langSelect.addEventListener('change', (e) => {
  applyTranslations(e.target.value);
});

// Função de cálculo
function calcularProporcao(taraA, taraB, finalA, finalB) {
  const pesoResina = finalA - taraA;
  const pesoEndurecedor = finalB - taraB;
  const menor = Math.min(pesoResina, pesoEndurecedor);
  const maior = Math.max(pesoResina, pesoEndurecedor);
  const proporcao = maior / menor;
  return {
    proporcao: Number(proporcao.toFixed(2)),
    pesoResina: Number(pesoResina.toFixed(3)),
    pesoEndurecedor: Number(pesoEndurecedor.toFixed(3))
  };
}

// Histórico
let historico = [];

// Atualizar gráfico
function atualizarGrafico() {
  if (chart) chart.destroy();

  chart = new Chart(chartCtx, {
    type: 'bar',
    data: {
      labels: historico.map((_, i) => `Teste ${i + 1}`),
      datasets: [
        {
          label: 'Resina (A)',
          data: historico.map(item => item.pesoResina),
          backgroundColor: '#3b82f6'
        },
        {
          label: 'Endurecedor (B)',
          data: historico.map(item => item.pesoEndurecedor),
          backgroundColor: '#10b981
