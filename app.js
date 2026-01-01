const API_URL = "https://breedingai-backend.onrender.com";

const analyzeBtn = document.getElementById("analyze");
const resultBox = document.getElementById("result");
const proBox = document.getElementById("proBox");
const proBtn = document.getElementById("pro");

analyzeBtn.addEventListener("click", async () => {
  resultBox.innerHTML = "<p>Analizando...</p>";
  proBox.style.display = "none";

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;

  const antecedentes = Array.from(
    document.querySelectorAll("input[type='checkbox']:checked")
  ).map(el => el.value);

  try {
    const response = await fetch(`${API_URL}/analyze`, {
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

    // 🔴 LÍMITE GRATUITO ALCANZADO
    if (response.status === 403 && data.error === "FREE_LIMIT_REACHED") {
      resultBox.innerHTML = `
        <h3>Límite alcanzado</h3>
        <p>Has utilizado tus 5 análisis gratuitos.</p>
      `;
      proBox.style.display = "block";
      return;
    }

    // 🟢 RESULTADO NORMAL
    resultBox.innerHTML = `
      <h2>Resultado del análisis</h2>
      <p><strong>Veredicto:</strong> ${data.resultado.veredicto}</p>
      <p><strong>Puntuación:</strong> ${data.resultado.puntuacion}</p>
      <p>${data.resultado.descripcion}</p>
      <p><strong>Recomendación:</strong> ${data.resultado.recomendacion}</p>
      <p><em>Usos gratuitos restantes: ${data.usosRestantes}</em></p>
    `;

    if (data.usosRestantes <= 0) {
      proBox.style.display = "block";
    }

  } catch (err) {
    console.error(err);
    resultBox.innerHTML =
      "<p>Error al generar el análisis. Inténtalo de nuevo.</p>";
  }
});

// =====================
// STRIPE PRO
// =====================
proBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(
      `${API_URL}/create-checkout-session`,
      { method: "POST" }
    );
    const data = await res.json();
    window.location.href = data.url;
  } catch (err) {
    alert("Error al iniciar el pago.");
  }
});









