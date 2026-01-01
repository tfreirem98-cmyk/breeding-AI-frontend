const API_URL = "https://breedingai-backend.onrender.com";

const form = document.getElementById("analysisForm");
const resultBox = document.getElementById("result");
const proBox = document.getElementById("proBox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // LIMPIAR RESULTADO SIEMPRE
  resultBox.innerHTML = "";
  proBox.style.display = "none";

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;

  const antecedentes = Array.from(
    document.querySelectorAll("input[name='antecedentes']:checked")
  ).map((el) => el.value);

  try {
    const res = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        raza,
        objetivo,
        consanguinidad,
        antecedentes
      })
    });

    const data = await res.json();

    // ====== LIMITE ALCANZADO ======
    if (!res.ok && data.error === "FREE_LIMIT_REACHED") {
      resultBox.innerHTML = `
        <h3>Límite alcanzado</h3>
        <p>Has usado tus 5 análisis gratuitos.</p>
      `;
      proBox.style.display = "block";
      return;
    }

    // ====== MOSTRAR RESULTADO ======
    resultBox.innerHTML = `
      <h3>Resultado del análisis</h3>
      <p><strong>Veredicto:</strong> ${data.resultado.veredicto}</p>
      <p><strong>Puntuación:</strong> ${data.resultado.puntuacion}</p>
      <p>${data.resultado.descripcion}</p>
      <p><strong>Recomendación:</strong> ${data.resultado.recomendacion}</p>
      <p><em>Usos gratuitos restantes: ${data.usosRestantes}</em></p>
    `;

    // SI SE ACABAN → CTA PRO
    if (data.usosRestantes <= 0) {
      proBox.style.display = "block";
    }

  } catch (err) {
    console.error(err);
    resultBox.innerHTML = "<p>Error al generar el análisis.</p>";
  }
});

// ==================
// STRIPE PRO
// ==================
async function goPro() {
  try {
    const res = await fetch(`${API_URL}/create-checkout-session`, {
      method: "POST"
    });
    const data = await res.json();
    window.location.href = data.url;
  } catch (err) {
    alert("Error al redirigir a Stripe");
  }
}



