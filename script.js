// -------------------------------
// Alternância de abas
// -------------------------------
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

// -------------------------------
// Tema (com persistência)
// -------------------------------
const themeBtn = document.getElementById('toggleTheme');
if (localStorage.getItem('dark-mode') === 'true') {
  document.body.classList.add('dark-mode');
}
themeBtn.onclick = () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
};

// -------------------------------
// Sistema de idiomas (Português ⇄ Chinês Simplificado)
// -------------------------------
const langBtn = document.getElementById('toggleLang');
langBtn.addEventListener('click', () => {
  const html = document.documentElement;
  const newLang = html.lang === 'pt' ? 'zh' : 'pt';
  html.lang = newLang;
  updateLanguage(newLang);
});

function updateLanguage(lang) {
  // Tradução de textos fixos
  document.querySelectorAll('[data-pt]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  // Tradução de placeholders
  const translations = {
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

  Object.keys(translations[lang]).forEach(cls => {
    document.querySelectorAll('.' + cls).forEach(input => {
      input.placeholder = translations[lang][cls];
    });
  });
}

// Inicializa idioma padrão
updateLanguage(document.documentElement.lang);

// -------------------------------
// Cálculo geral das proporções
// -------------------------------
document.querySelectorAll('.btn-calcular').forEach(btn => {
  btn.addEventListener('click', () => {
    const form = btn.closest('form');
    const resultado = form.querySelector('.resultado');
    const tolerancia = parseFloat(form.dataset.tolerancia);
    const tipo = form.dataset.tipo;
    let proporcao = 0;

    if (tipo === 'resina' || tipo === 'reparo') {
      const taraA = parseFloat(form.querySelector('.taraA').value);
      const cheioA = parseFloat(form.querySelector('.cheioA').value);
      const taraB = parseFloat(form.querySelector('.taraB').value);
      const cheioB = parseFloat(form.querySelector('.cheioB').value);

      if ([taraA, cheioA, taraB, cheioB].some(isNaN)) {
        resultado.textContent = '⚠️ Preencha todos os campos corretamente.';
        resultado.style.backgroundColor = 'var(--error)';
        return;
      }

      const pesoA = cheioA - taraA;
      const pesoB = cheioB - taraB;
      const maior = Math.max(pesoA, pesoB);
      const menor = Math.min(pesoA, pesoB);
      proporcao = (menor / maior) * 100;
    } else if (tipo === 'cola') {
      const p1 = parseFloat(form.querySelector('.peso1').value);
      const p2 = parseFloat(form.querySelector('.peso2').value);

      if ([p1, p2].some(isNaN)) {
        resultado.textContent = '⚠️ Preencha todos os campos corretamente.';
        resultado.style.backgroundColor = 'var(--error)';
        return;
      }

      const maior = Math.max(p1, p2);
      const menor = Math.min(p1, p2);
      proporcao = (maior / menor) * 100;
    }

    const dentro = proporcao >= (tolerancia - 2) && proporcao <= (tolerancia + 2);
    resultado.textContent = `Proporção: ${proporcao.toFixed(2)}%\n${dentro ? '✅ Dentro da tolerância' : '❌ Fora da tolerância'} (${tolerancia} ± 2)`;
    resultado.style.backgroundColor = dentro ? 'var(--success)' : 'var(--error)';
  });
});
