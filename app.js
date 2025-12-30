const form = document.getElementById("analysisForm");
const output = document.getElementById("resultado");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  output.innerHTML = "⏳ Generando análisis profesional...";

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;

  const antecedentes = [];
  document
    .querySelectorAll("input[name='antecedentes']:checked")
    .forEach((el) => antecedentes.push(el.value));

  try {
    const res = await fetch(
      "https://breedingai-backend.onrender.com/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raza,
          objetivo,
          consanguinidad,
          antecedentes
        })
      }
    );

    const data = await res.json();

    output.innerHTML = `
      <h2>${data.clasificacion}</h2>

      <p><strong>Compatibilidad genética:</strong> ${data.puntuaciones.compatibilidadGenetica} / 10</p>
      <p><strong>Riesgo hereditario:</strong> ${data.puntuaciones.riesgoHereditario} / 10</p>
      <p><strong>Adecuación al objetivo:</strong> ${data.puntuaciones.adecuacionObjetivo} / 10</p>

      <h3>Recomendación profesional</h3>
      <p>${data.recomendacion}</p>

      ${
        data.observaciones.length
          ? `<h4>Observaciones</h4><ul>${data.observaciones
              .map((o) => `<li>${o}</li>`)
              .join("")}</ul>`
          : ""
      }

      ${
        data.advertencias.length
          ? `<h4>Advertencias</h4><ul>${data.advertencias
              .map((a) => `<li>${a}</li>`)
              .join("")}</ul>`
          : ""
      }

      <p><strong>Nivel de confianza:</strong> ${data.nivelConfianza}</p>

      <small>${data.notaTecnica}</small>
    `;
  } catch (err) {
    output.innerHTML = "❌ Error al generar el análisis.";
  }
});




