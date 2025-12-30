const form = document.getElementById("analysisForm");
const result = document.getElementById("resultado");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;
  const antecedentes = [...document.querySelectorAll("input:checked")].map(i => i.value);

  result.classList.remove("hidden");
  result.textContent = "Generando análisis...";

  const res = await fetch("https://breedingai-backend.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ raza, objetivo, consanguinidad, antecedentes })
  });

  const data = await res.json();
  const r = data.resultado;

  result.innerHTML = `
    <h2>${r.estado}</h2>
    <p>Compatibilidad genética: ${r.compatibilidad}/10</p>
    <p>Riesgo hereditario: ${r.riesgoHereditario}/10</p>
    <p>Adecuación al objetivo: ${r.adecuacionObjetivo}/10</p>
    <p>${r.recomendacion}</p>
    <ul>${r.advertencias.map(a => `<li>${a}</li>`).join("")}</ul>
  `;
});


