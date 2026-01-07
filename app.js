const analyzeBtn = document.getElementById("analyze");
const resultDiv = document.getElementById("result");
const proBox = document.getElementById("proBox");

analyzeBtn.addEventListener("click", async () => {
  resultDiv.innerHTML = "";
  proBox.style.display = "none";

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;

  const antecedentes = Array.from(
    document.querySelectorAll(".checkbox-group input:checked")
  ).map(cb => cb.value);

  try {
    const response = await fetch(
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

    if (!response.ok) {
      throw new Error("Backend error");
    }

    const data = await response.json();

    const veredicto = data.veredicto || "No disponible";
    const puntuacion = data.puntuacion ?? "-";
    const analisis = data.analisis || "Análisis no disponible.";
    const recomendacion = data.recomendacion || "";
    const usosRestantes = data.usosRestantes;

    resultDiv.innerHTML = `
      <h2>Resultado del análisis</h2>
      <p><strong>Veredicto:</strong> ${veredicto}</p>
      <p><strong>Puntuación:</strong> ${puntuacion}</p>
      <p>${analisis}</p>
      ${
        recomendacion
          ? `<p><strong>Recomendación:</strong> ${recomendacion}</p>`
          : ""
      }
      ${
        typeof usosRestantes === "number"
          ? `<p><em>Usos gratuitos restantes: ${usosRestantes}</em></p>`
          : ""
      }
    `;

    if (usosRestantes === 0) {
      proBox.style.display = "block";
    }

  } catch (error) {
    console.error(error);
    resultDiv.innerHTML =
      "<p style='color:red'>No se pudo generar el análisis. Inténtalo de nuevo.</p>";
  }
});

const proBtn = document.getElementById("pro");
if (proBtn) {
  proBtn.addEventListener("click", () => {
    window.location.href =
      "https://breedingai-backend.onrender.com/create-checkout-session";
  });
}













