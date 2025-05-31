const translations = {
  pt: {
    title: "Cálculo de Proporção",
    toggle_theme: "Modo Escuro",
    tara_a: "Tara Balde A (Resina):",
    cheio_a: "Peso com Resina:",
    tara_b: "Tara Balde B (Endurecedor):",
    cheio_b: "Peso com Endurecedor:",
    result: "Proporção",
    valid_range: "Dentro do intervalo (28 a 32)",
    invalid_range: "Fora do intervalo (28 a 32)",
  },
  en: {
    title: "Proportion Calculator",
    toggle_theme: "Dark Mode",
    tara_a: "Bucket A Tare (Resin):",
    cheio_a: "Weight with Resin:",
    tara_b: "Bucket B Tare (Hardener):",
    cheio_b: "Weight with Hardener:",
    result: "Proportion",
    valid_range: "Within range (28 to 32)",
    invalid_range: "Out of range (28 to 32)",
  },
  zh: {
    title: "比例计算器",
    toggle_theme: "深色模式",
    tara_a: "桶 A 皮重（树脂）：",
    cheio_a: "加树脂的重量：",
    tara_b: "桶 B 皮重（固化剂）：",
    cheio_b: "加固化剂的重量：",
    result: "比例",
    valid_range: "在范围内（28 到 32）",
    invalid_range: "超出范围（28 到 32）",
  },
};

function translate(key) {
  const lang = languageSelector.value;
  return translations[lang][key] || key;
}

function updateLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = translate(key);
  });
  calcularProporcao(); // traduz resultado também
}

languageSelector.addEventListener('change', updateLanguage);
document.addEventListener('DOMContentLoaded', updateLanguage);
