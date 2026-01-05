const API_URL = "https://breedingai-backend.onrender.com/analyze";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("analyzeBtn");
  if (!btn) {
    console.error("Botón de análisis no encontrado");
    return;
  }

  btn.addEventListener("click", async () => {
    const raza = document.getElementById("raza").value;
    const objetivo = document.getElementById("objetivo").value;
    const consanguinidad = document.getElementById("consanguinidad").value;

    const antecedentes = {
      displasia: document.getElementById("ant_displasia")?.checked || false,
      oculares: document.getElementById("ant_oculares")?.checked || false,
      respiratorios: document.getElementById("ant_respiratorios")?.checked || false,
      neurologicos: document.getElementById("ant_neurologicos")?.checked || false
    };

    const payload = {
      raza,
      objetivo,
      consanguinidad,
      antecedentes
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();
      renderResult(data);

    } catch (err) {
      console.error(err);
      document.getElementById("result").innerHTML =
        "<p>Error de conexión con el servidor</p>";
    }
  });
});

function renderResult(data) {
  const container = document.getElementById("result");

  container.innerHTML = `
    <h3>Resultado del análisis</h3>
    <p><strong>Veredicto:</strong> ${data.veredicto}</p>
    <p><strong>Puntuación:</strong> ${data.puntuacion}</p>
    <p>${data.descripcion}</p>
    <p><strong>Recomendación:</strong> ${data.recomendacion}</p>
    <p><em>Usos gratuitos restantes: ${data.usosRestantes}</em></p>
  `;
}









