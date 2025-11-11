// ---------- Config / Traduções ----------
const placeholderTranslations = {
  pt: {
    taraA: 'Tara A (Resina)',
    cheioA: 'Peso com Resina',
    taraB: 'Tara B (Endurecedor)',
    cheioB: 'Peso com Endurecedor',
    peso1: 'Peso Cola Verde',
    peso2: 'Peso Cola Amarela'
  },
  zh: {
    taraA: '树脂A皮重',
    cheioA: '树脂总重',
    taraB: '固化剂B皮重',
    cheioB: '固化剂总重',
    peso1: '绿色胶重量',
    peso2: '黄色胶重量'
  }
};

const resultTranslations = {
  pt: {
    dentro: '✅ Dentro da tolerância',
    fora: '❌ Fora da tolerância',
    aviso: '⚠️ Preencha todos os campos corretamente.',
    proporcaoLabel: 'Proporção'
  },
  zh: {
    dentro: '✅ 在容差范围内',
    fora: '❌ 超出容差范围',
    aviso: '⚠️ 请完整填写所有字段',
    proporcaoLabel: '比例'
  }
};

// Histórico em memória (sessão)
let history = [];

// ---------- UI básico (abas / tema) ----------
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-content').forEach(c => {
      c.classList.toggle('active', c.id === tab);
    });
  });
});

// Tema persistente
const themeBtn = document.getElementById('toggleTheme');
if (localStorage.getItem('dark-mode') === 'true') document.body.classList.add('dark-mode');
themeBtn.onclick = () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
};

// ---------- Idioma (detecção + troca) ----------
const langBtn = document.getElementById('toggleLang');
const userLang = navigator.language || navigator.userLanguage;
document.documentElement.lang = userLang.startsWith('zh') ? 'zh' : 'pt';

function updateLanguage(lang) {
  // textos fixos
  document.querySelectorAll('[data-pt]').forEach(el => {
    const txt = el.getAttribute(`data-${lang}`);
    if (txt !== null) el.textContent = txt;
  });

  // placeholders
  Object.keys(placeholderTranslations[lang]).forEach(cls => {
    document.querySelectorAll('.' + cls).forEach(input => {
      input.placeholder = placeholderTranslations[lang][cls];
    });
  });

  // traduz botões dinâmicos (export/clear)
  document.querySelectorAll('[data-pt]').forEach(el => {
    // já tratado acima via data-pt/data-zh
  });
}

langBtn.addEventListener('click', () => {
  const html = document.documentElement;
  const newLang = html.lang === 'pt' ? 'zh' : 'pt';
  html.lang = newLang;
  updateLanguage(newLang);
});

// inicializa idioma
updateLanguage(document.documentElement.lang);

// ---------- Função utilitária de timestamp ----------
function nowString() {
  const d = new Date();
  return d.toLocaleString(document.documentElement.lang === 'zh' ? 'zh-CN' : 'pt-BR');
}

// ---------- Render histórico na UI ----------
const historyListEl = document.querySelector('.history-list');
function renderHistory() {
  historyListEl.innerHTML = '';
  if (history.length === 0) {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.textContent = document.documentElement.lang === 'zh' ? 'Nenhum cálculo ainda / 无历史记录' : 'Nenhum cálculo ainda';
    historyListEl.appendChild(li);
    return;
  }

  history.slice().reverse().forEach((entry, idx) => {
    const li = document.createElement('li');
    li.className = 'history-item';
    const left = document.createElement('div');
    left.innerHTML = `<div><strong>${entry.tipoLabel}</strong> — <span class="meta">${entry.when}</span></div>
                      <div class="meta">${entry.summary}</div>`;
    const right = document.createElement('div');
    const btnSingle = document.createElement('button');
    btnSingle.textContent = document.documentElement.lang === 'zh' ? '导出此项 (PDF)' : 'Exportar este (PDF)';
    btnSingle.addEventListener('click', () => exportSingleEntryToPDF(entry));
    right.appendChild(btnSingle);
    li.appendChild(left);
    li.appendChild(right);
    historyListEl.appendChild(li);
  });
}

// ---------- Cálculo e armazenamento ----------
document.querySelectorAll('.btn-calcular').forEach(btn => {
  btn.addEventListener('click', () => {
    const form = btn.closest('form');
    const resultado = form.querySelector('.resultado');
    const tolerancia = parseFloat(form.dataset.tolerancia);
    const tipo = form.dataset.tipo;
    const lang = document.documentElement.lang;

    let proporcao = 0;
    let inside = false;
    let summary = '';
    let inputs = {};

    if (tipo === 'resina' || tipo === 'reparo') {
      const taraA = parseFloat(form.querySelector('.taraA').value);
      const cheioA = parseFloat(form.querySelector('.cheioA').value);
      const taraB = parseFloat(form.querySelector('.taraB').value);
      const cheioB = parseFloat(form.querySelector('.cheioB').value);

      if ([taraA, cheioA, taraB, cheioB].some(isNaN)) {
        resultado.textContent = resultTranslations[lang].aviso;
        resultado.style.backgroundColor = 'var(--error)';
        return;
      }

      const pesoA = cheioA - taraA;
      const pesoB = cheioB - taraB;
      const maior = Math.max(pesoA, pesoB);
      const menor = Math.min(pesoA, pesoB);
      proporcao = (menor / maior) * 100;
      inside = proporcao >= (tolerancia - 2) && proporcao <= (tolerancia + 2);
      summary = `A:${pesoA.toFixed(3)} B:${pesoB.toFixed(3)} => ${proporcao.toFixed(2)}%`;
      inputs = { taraA, cheioA, taraB, cheioB, pesoA, pesoB };
    } else { // cola
      const p1 = parseFloat(form.querySelector('.peso1').value);
      const p2 = parseFloat(form.querySelector('.peso2').value);

      if ([p1, p2].some(isNaN)) {
        resultado.textContent = resultTranslations[lang].aviso;
        resultado.style.backgroundColor = 'var(--error)';
        return;
      }

      const maior = Math.max(p1, p2);
      const menor = Math.min(p1, p2);
      proporcao = (maior / menor) * 100;
      inside = proporcao >= (tolerancia - 2) && proporcao <= (tolerancia + 2);
      summary = `P1:${p1.toFixed(3)} P2:${p2.toFixed(3)} => ${proporcao.toFixed(2)}%`;
      inputs = { p1, p2 };
    }

    resultado.textContent = `${resultTranslations[lang].proporcaoLabel}: ${proporcao.toFixed(2)}%\n${inside ? resultTranslations[lang].dentro : resultTranslations[lang].fora}`;
    resultado.style.backgroundColor = inside ? 'var(--success)' : 'var(--error)';

    // salvar no histórico (obj)
    const entry = {
      id: Date.now(),
      when: nowString(),
      tipo,
      tipoLabel: document.querySelector(`.tab-btn.active`).textContent,
      tolerancia: parseFloat(form.dataset.tolerancia),
      proporcao: Number(proporcao.toFixed(2)),
      dentro: inside,
      summary,
      inputs,
      lang: document.documentElement.lang
    };
    history.push(entry);
    renderHistory();
  });
});

// ---------- Botões export / limpar histórico ----------
document.getElementById('btnClearHistory').addEventListener('click', () => {
  history = [];
  renderHistory();
});

document.getElementById('btnExportHistory').addEventListener('click', () => {
  if (history.length === 0) {
    alert(document.documentElement.lang === 'zh' ? '没有历史记录可导出' : 'Não há histórico para exportar');
    return;
  }
  exportHistoryToPDF(history);
});

// Também adiciona listeners para botões "Exportar resultado (PDF)" por formulário
document.querySelectorAll('.btn-export-single').forEach(btn => {
  btn.addEventListener('click', () => {
    // pega resultado mais recente do formulário (se houver)
    const form = btn.closest('form');
    const tipo = form.dataset.tipo;
    // tentar pegar último histórico com mesmo tipo
    const lastMatch = [...history].reverse().find(e => e.tipo === tipo);
    if (!lastMatch) {
      alert(document.documentElement.lang === 'zh' ? '当前表单无计算结果' : 'Sem resultado calculado para exportar neste formulário');
      return;
    }
    exportSingleEntryToPDF(lastMatch);
  });
});

// ---------- Exportar função (PDF) ----------
async function exportSingleEntryToPDF(entry) {
  // cria um node temporário com conteúdo formatado
  const node = buildPdfNodeForEntry(entry);
  document.body.appendChild(node);
  try {
    await renderNodeToPDF(node, `proporcao_${entry.id}.pdf`);
  } catch (e) {
    console.error(e);
    alert('Erro ao gerar PDF');
  } finally {
    node.remove();
  }
}

async function exportHistoryToPDF(entries) {
  // cria um node que terá páginas separadas; vamos renderizar cada entrada em página separada
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.padding = '16px';
  document.body.appendChild(container);

  for (let i = 0; i < entries.length; i++) {
    const node = buildPdfNodeForEntry(entries[i]);
    container.appendChild(node);
  }

  try {
    // render cada child como página separada no PDF
    await renderContainerChildrenToMultiPagePDF(container, 'historico_proporcoes.pdf');
  } catch (e) {
    console.error(e);
    alert('Erro ao gerar PDF');
  } finally {
    container.remove();
  }
}

// ---------- Helpers: build node HTML para PDF ----------
function buildPdfNodeForEntry(entry) {
  const wrapper = document.createElement('div');
  wrapper.className = 'pdf-page';
  wrapper.style.width = '800px';
  wrapper.style.minHeight = '1120px';
  wrapper.style.padding = '28px';
  wrapper.style.boxSizing = 'border-box';
  wrapper.style.background = '#fff';
  wrapper.style.color = '#222';
  wrapper.style.fontFamily = 'Arial, Helvetica, sans-serif';
  wrapper.style.border = '1px solid #ddd';
  wrapper.style.marginBottom = '12px';

  // Cabeçalho
  const h = document.createElement('div');
  h.style.display = 'flex';
  h.style.justifyContent = 'space-between';
  h.style.alignItems = 'center';
  h.innerHTML = `<div>
      <h2 style="margin:0">${entry.tipoLabel}</h2>
      <div style="font-size:12px;color:#555">${entry.when}</div>
    </div>
    <div style="text-align:right">
      <div style="font-weight:700">${entry.proporcao.toFixed(2)}%</div>
      <div style="font-size:12px;color:#555">Tolerância: ${entry.tolerancia} ± 2</div>
    </div>`;
  wrapper.appendChild(h);

  // Linha
  const hr = document.createElement('hr');
  hr.style.margin = '14px 0';
  wrapper.appendChild(hr);

  // Entradas & cálculos
  const pre = document.createElement('pre');
  pre.style.fontFamily = 'monospace';
  pre.style.fontSize = '13px';
  pre.style.lineHeight = '1.4';
  pre.style.whiteSpace = 'pre-wrap';
  pre.style.margin = '0';
  let content = `Resumo: ${entry.summary}\n\nEntradas:\n`;
  if (entry.tipo === 'resina' || entry.tipo === 'reparo') {
    const i = entry.inputs;
    content += `Tara A: ${i.taraA}\nPeso com Resina (cheioA): ${i.cheioA}\n=> Peso Resina: ${i.pesoA}\n\nTara B: ${i.taraB}\nPeso com Endurecedor (cheioB): ${i.cheioB}\n=> Peso Endurecedor: ${i.pesoB}\n`;
  } else {
    const i = entry.inputs;
    content += `Peso Cola Verde: ${i.p1}\nPeso Cola Amarela: ${i.p2}\n`;
  }
  content += `\nResultado: ${entry.proporcao.toFixed(2)}% — ${entry.dentro ? (entry.lang === 'zh' ? '在容差范围内' : 'Dentro da tolerância') : (entry.lang === 'zh' ? '超出容差范围' : 'Fora da tolerância')}\n`;
  pre.textContent = content;
  wrapper.appendChild(pre);

  // Marca d'água (simples)
  const watermark = document.createElement('div');
  watermark.textContent = 'Gustavo';
  watermark.style.position = 'absolute';
  watermark.style.opacity = '0.06';
  watermark.style.fontSize = '72px';
  watermark.style.transform = 'rotate(-30deg)';
  watermark.style.left = '120px';
  watermark.style.top = '380px';
  watermark.style.pointerEvents = 'none';
  wrapper.style.position = 'relative';
  wrapper.appendChild(watermark);

  return wrapper;
}

// ---------- Renderização de HTML -> Imagem -> jsPDF ----------
async function renderNodeToPDF(node, filename = 'document.pdf') {
  // usa html2canvas para render alta resolução
  const scale = 2; // aumenta resolução
  const canvas = await html2canvas(node, { scale, useCORS: true, backgroundColor: '#ffffff' });
  const imgData = canvas.toDataURL('image/png');

  // cria PDF A4 (mm)
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // converter canvas px -> mm
  const imgProps = { width: canvas.width, height: canvas.height };
  const pxToMm = (px) => px * 25.4 / (96 * scale); // 96dpi * scale
  const imgWidthMm = pxToMm(imgProps.width);
  const imgHeightMm = pxToMm(imgProps.height);

  // se altura maior que página, ajusta para caber proporcionalmente
  const ratio = Math.min(pageWidth / imgWidthMm, pageHeight / imgHeightMm, 1);
  const renderW = imgWidthMm * ratio;
  const renderH = imgHeightMm * ratio;
  pdf.addImage(imgData, 'PNG', (pageWidth - renderW) / 2, 10, renderW, renderH);
  pdf.save(filename);
}

// Para múltiplas páginas (cada child do container => uma página)
async function renderContainerChildrenToMultiPagePDF(container, filename = 'document.pdf') {
  const children = Array.from(container.children);
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const scale = 2;

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    const canvas = await html2canvas(node, { scale, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');

    const imgProps = { width: canvas.width, height: canvas.height };
    const pxToMm = (px) => px * 25.4 / (96 * scale);
    const imgWidthMm = pxToMm(imgProps.width);
    const imgHeightMm = pxToMm(imgProps.height);
    const ratio = Math.min(pageWidth / imgWidthMm, pageHeight / imgHeightMm, 1);
    const renderW = imgWidthMm * ratio;
    const renderH = imgHeightMm * ratio;

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'PNG', (pageWidth - renderW) / 2, 10, renderW, renderH);
  }

  pdf.save(filename);
}
