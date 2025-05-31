// ELEMENTOS
const form = document.getElementById("calc-form");
const resA = document.getElementById("taraA");
const finalA = document.getElementById("finalA");
const resB = document.getElementById("taraB");
const finalB = document.getElementById("finalB");
const resultBox = document.getElementById("result-box");
const resultText = document.getElementById("result");
const historicoList = document.getElementById("historico");
const langSelect = document.getElementById("lang-select");
const themeToggle = document.getElementById("theme-toggle");
const obsInput = document.getElementById("observacoes");
const nomeInput = document.getElementById("tecnico");
const chartCanvas = document.getElementById("chart");

// TRADUÇÕES
const i18n = {
  pt: {
    proporcaoIdeal: "Proporção ideal: 30%",
    foraIntervalo: "Fora do intervalo ideal!",
    dentroIntervalo: "Dentro do intervalo ideal!",
    historico: "Histórico de testes",
    resultado: "Resultado",
    tecnico: "Técnico Responsável",
    observacoes: "Observações",
    exportarPDF: "Exportar para PDF",
    exportarExcel: "Exportar para Excel",
  },
  zh: {
    proporcaoIdeal: "理想比例: 30%",
    foraIntervalo: "超出理想范围！",
    dentroIntervalo: "在理想范围内！",
    historico: "测试历史",
    resultado: "结果",
    tecnico: "负责人",
    observacoes: "备注",
    exportarPDF: "导出为PDF",
    exportarExcel: "导出为Excel",
  },
};

// THEME
themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

// IDIOMA
let lang = "pt";
langSelect.addEventListener("change", (e) => {
  lang = e.target.value;
  renderHistorico();
  updateLabels();
});

function updateLabels() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = i18n[lang][key] || key;
  });
}

// CÁLCULO
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const taraA = parseFloat(resA.value);
  const finalPesoA = parseFloat(finalA.value);
  const taraB = parseFloat(resB.value);
  const finalPesoB = parseFloat(finalB.value);

  const pesoA = finalPesoA - taraA;
  const pesoB = finalPesoB - taraB;

  const proporcao = (pesoB / pesoA) * 100;
  const resultado = proporcao.toFixed(2);

  let status = "";
  if (proporcao >= 28 && proporcao <= 32) {
    status = i18n[lang].dentroIntervalo;
  } else {
    status = i18n[lang].foraIntervalo;
  }

  const data = {
    data: new Date().toLocaleString(),
    proporcao: resultado,
    status,
    tecnico: nomeInput.value || "-",
    observacoes: obsInput.value || "-",
  };

  salvarHistorico(data);
  renderHistorico();
  renderGrafico(proporcao);
  resultBox.classList.remove("hidden");
  resultText.innerText = `→ ${resultado}% - ${status}`;
});

// HISTÓRICO
function salvarHistorico(dados) {
  const antigo = JSON.parse(localStorage.getItem("historico") || "[]");
  antigo.unshift(dados);
  localStorage.setItem("historico", JSON.stringify(antigo));
}

function renderHistorico() {
  const dados = JSON.parse(localStorage.getItem("historico") || "[]");
  historicoList.innerHTML = dados
    .map(
      (item) => `
    <li class="border-b py-1">
      <strong>${item.data}</strong>: ${item.proporcao}% - ${item.status}
    </li>
  `
    )
    .join("");
}

// GRÁFICO
let chart;
function renderGrafico(valor) {
  if (chart) chart.destroy();
  chart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: ["Ideal", "Calculado"],
      datasets: [
        {
          label: "%",
          data: [30, valor],
          backgroundColor: ["#3b82f6", "#10b981"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true, max: 40 },
      },
    },
  });
}

// EXPORTAÇÃO PDF
document.getElementById("export-pdf").addEventListener("click", () => {
  const dados = JSON.parse(localStorage.getItem("historico") || "[]");
  let texto = `Teste de Proporção - Técnico: ${nomeInput.value || "-"}\n`;
  texto += `Observações: ${obsInput.value || "-"}\n\n`;

  dados.forEach((item, i) => {
    texto += `${i + 1}) ${item.data}: ${item.proporcao}% - ${item.status}\n`;
  });

  const doc = new jsPDF();
  doc.text(texto, 10, 10);
  doc.save("relatorio_teste.pdf");
});

// EXPORTAÇÃO CSV
document.getElementById("export-excel").addEventListener("click", () => {
  const dados = JSON.parse(localStorage.getItem("historico") || "[]");
  let csv = "Data,Proporção (%),Status,Técnico,Observações\n";

  dados.forEach((item) => {
    csv += `"${item.data}",${item.proporcao},${item.status},"${item.tecnico}","${item.observacoes}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "historico_teste.csv";
  link.click();
});
