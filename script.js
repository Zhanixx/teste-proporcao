// Alternância de abas
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-content').forEach(c => {
      c.classList.remove('active');
      if (c.id === tab) c.classList.add('active');
    });
  });
});

// Tema escuro
const themeBtn = document.getElementById('toggleTheme');
if (localStorage.getItem('dark-mode') === 'true') document.body.classList.add('dark-mode');
themeBtn.onclick = () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
};

// Tradução
const langBtn = document.getElementById('toggleLang');

// Tradução de placeholders
const placeholderTranslations = {
  pt: {
    taraA: 'Tara A (Resina)',
    cheioA: 'Peso com Resina',
    taraB: 'Tara B (Endurecedor)',
    cheioB: 'Peso com Endurecedor',
    peso1: 'Peso Cola Verde',
    peso2: 'Peso Cola Amarela',
  },
  zh: {
    taraA: '树脂A皮重',
    cheioA: '树脂总重',
    taraB: '固化剂B皮重',
    cheioB: '固化剂总重',
    peso1: '绿色胶重量',
    peso2: '黄色胶重量',
  }
};

// Tradução de resultados
const resultTranslations = {
  pt: {
    dentro: '✅ Dentro da tolerância',
    fora: '❌ Fora da tolerância',
    aviso: '⚠️ Preencha todos os campos corretamente.'
  },
  zh: {
    dentro: '✅ 在容差范围内',
    fora: '❌ 超出容差范围',
    aviso: '⚠️ 请完整填写所有字段'
  }
};

// Função de tradução
function updateLanguage(lang) {
  // Textos fixos
  document.querySelectorAll('[data-pt]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  // Placeholders
  Object.keys(placeholderTranslations[lang]).forEach(cls => {
    document.querySelectorAll('.' + cls).forEach(input => {
      input.placeholder = placeholderTranslations[lang][cls];
    });
  });
}

// Detecção automática do idioma
const userLang = navigator.language || navigator.userLanguage;
document.documentElement.lang = userLang.startsWith('zh') ? 'zh' : 'pt';

// Inicializa idioma
updateLanguage(document.documentElement.lang);

// Botão alterna idioma
langBtn.addEventListener('click', () => {
  const html = document.documentElement;
  const newLang = html.lang === 'pt' ? 'zh' : 'pt';
  html.lang = newLang;
  updateLanguage(newLang);
});

// Cálculo das proporções
document.querySelectorAll('.btn-calcular').forEach(btn => {
  btn.addEventListener('click', () => {
    const form = btn.closest('form');
    const resultado = form.querySelector('.resultado');
    const tolerancia = parseFloat(form.dataset.tolerancia);
    const tipo = form.dataset.tipo;
    const lang = document.documentElement.lang;

    let proporcao = 0;
    let dentro = false;

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
      dentro = proporcao >= (tolerancia - 2) && proporcao <= (tolerancia + 2);
    } else if (tipo === 'cola') {
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
      dentro = proporcao >= (tolerancia - 2) && proporcao <= (tolerancia + 2);
    }

    resultado.textContent = `Proporção: ${proporcao.toFixed(2)}%\n${dentro ? resultTranslations[lang].dentro : resultTranslations[lang].fora}`;
    resultado.style.backgroundColor = dentro ? 'var(--success)' : 'var(--error)';
  });
});
