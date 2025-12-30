const form = document.getElementById("analysisForm");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    raza: form.raza.value,
    objetivo: form.objetivo.value,
    consanguinidad: form.consanguinidad.value,
    antecedentes: [...form.querySelectorAll("input:checked")].map(i => i.value)
  };

  result.classList.remove("hidden");
  result.innerHTML = "Generando análisis...";

  try {
    const res = await fetch("https://breedingai-backend.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await res.json();

    result.innerHTML = `
      <h2>${json.clasificacion}</h2>
      <p><strong>Compatibilidad genética:</strong> ${json.compatibilidad}/10</p>
      <p><strong>Riesgo hereditario:</strong> ${json.riesgo}/10</p>
      <p><strong>Adecuación al objetivo:</strong> ${json.adecuacion}/10</p>
      <p>${json.recomendacion}</p>
    `;
  } catch {
    result.innerHTML = "Error al generar el análisis.";
  }
});


