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

// Alternância de idioma e tema
document.getElementById('toggleTheme').onclick = () => {
  document.body.classList.toggle('dark-mode');
};

document.getElementById('toggleLang').onclick = () => {
  const lang = document.documentElement.lang === 'pt' ? 'zh' : 'pt';
  document.documentElement.lang = lang;
  alert(`Idioma alterado para: ${lang === 'pt' ? 'Português' : 'Chinês (Mandarim)'}`);
};

// Cálculo geral para todos os formulários
document.querySelectorAll('.btn-calcular').forEach(btn => {
  btn.addEventListener('click', () => {
    const form = btn.closest('form');
    const resultado = form.querySelector('.resultado');
    const tolerancia = parseFloat(form.dataset.tolerancia);

    if (form.classList.contains('calc-form') && form.querySelector('.taraA')) {
      // Proporção de resina ou reparo
      const taraA = parseFloat(form.querySelector('.taraA').value);
      const cheioA = parseFloat(form.querySelector('.cheioA').value);
      const taraB = parseFloat(form.querySelector('.taraB').value);
      const cheioB = parseFloat(form.querySelector('.cheioB').value);
      if ([taraA, cheioA, taraB, cheioB].some(isNaN)) return;

      const pesoA = cheioA - taraA;
      const pesoB = cheioB - taraB;

      const maior = Math.max(pesoA, pesoB);
      const menor = Math.min(pesoA, pesoB);
      const proporcao = (menor / maior) * 100;
      const dentro = proporcao >= (tolerancia - 2) && proporcao <= (tolerancia + 2);

      resultado.textContent = `Proporção: ${proporcao.toFixed(2)}%\n${dentro ? '✅ Dentro da tolerância' : '❌ Fora da tolerância'} (${tolerancia} ± 2)`;
      resultado.style.backgroundColor = dentro ? '#d4edda' : '#f8d7da';
    } else {
      // Massa de cola
      const p1 = parseFloat(form.querySelector('.peso1').value);
      const p2 = parseFloat(form.querySelector('.peso2').value);
      if ([p1, p2].some(isNaN)) return;

      const maior = Math.max(p1, p2);
      const menor = Math.min(p1, p2);
      const proporcao = (maior / menor) * 100;
      const dentro = proporcao >= (tolerancia - 2) && proporcao <= (tolerancia + 2);

      resultado.textContent = `Proporção: ${proporcao.toFixed(2)}%\n${dentro ? '✅ Dentro da tolerância' : '❌ Fora da tolerância'} (${tolerancia} ± 2)`;
      resultado.style.backgroundColor = dentro ? '#d4edda' : '#f8d7da';
    }
  });
});
