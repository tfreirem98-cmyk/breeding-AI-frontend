const form = document.getElementById("analysisForm");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;

  const antecedentes = [...document.querySelectorAll("input[type=checkbox]:checked")]
    .map(cb => cb.value);

  const response = await fetch("https://breedingai-backend.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      raza,
      objetivo,
      consanguinidad,
      antecedentes
    })
  });

  const data = await response.json();

  result.classList.remove("hidden");
  result.innerHTML = `
    <h2>${data.clasificacion}</h2>
    <p><strong>Compatibilidad genética:</strong> ${data.compatibilidad}/10</p>
    <p><strong>Riesgo hereditario:</strong> ${data.riesgo}/10</p>
    <p><strong>Adecuación al objetivo:</strong> ${data.adecuacion}/10</p>
    <p>${data.recomendacion}</p>
  `;
});

