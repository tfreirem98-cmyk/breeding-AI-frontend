const form = document.getElementById("analysisForm");
const resultDiv = document.getElementById("result");

const API_URL = "https://breedingai-backend.vercel.app/analyze";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  resultDiv.classList.add("hidden");
  resultDiv.innerHTML = "Generando análisis...";

  const breed = document.getElementById("breed").value;
  const objective = document.getElementById("objective").value;
  const consanguinity = document.getElementById("consanguinity").value;

  const antecedentes = Array.from(
    document.querySelectorAll("input[type=checkbox]:checked")
  ).map(cb => cb.value);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        breed,
        objective,
        consanguinity,
        antecedentes
      })
    });

    const data = await response.json();

    resultDiv.innerHTML = `
      <h3>${data.clasificacion}</h3>
      <p><strong>Compatibilidad genética:</strong> ${data.compatibilidadGenetica}/10</p>
      <p><strong>Riesgo hereditario:</strong> ${data.riesgoHereditario}/10</p>
      <p><strong>Adecuación al objetivo:</strong> ${data.adecuacionObjetivo}/10</p>
      <p>${data.recomendacion}</p>
    `;

    resultDiv.classList.remove("hidden");

  } catch (err) {
    resultDiv.innerHTML = "Error al generar el análisis.";
    resultDiv.classList.remove("hidden");
  }
});
