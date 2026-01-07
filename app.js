// ===============================
// BreedingAI · app.js
// Render clínico premium estable
// ===============================

const analyzeBtn = document.getElementById("analyze");
const resultBox = document.getElementById("result");
const proBox = document.getElementById("proBox");

if (!analyzeBtn || !resultBox) {
  console.error("Botón o contenedor de resultados no encontrado");
}

analyzeBtn.addEventListener("click", async () => {
  resultBox.innerHTML = "";
  resultBox.style.display = "block";

  const raza = document.getElementById("raza")?.value;
  const objetivo = document.getElementById("objetivo")?.value;
  const consanguinidad = document.getElementById("consanguinidad")?.value;

  const antecedentes = Array.from(
    document.querySelectorAll(".checkbox-group input:checked")
  ).map((el) => el.value);

  if (!raza || !objetivo || !consanguinidad) {
    resultBox.innerHTML = `<p style="color:red">Completa todos los campos obligatorios.</p>`;
    return;
  }

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
          antecedentes,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Error de backend");
    }

    const data = await res.json();

    renderClinicalReport(data);

    if (data.freeLeft !== undefined && data.freeLeft <= 0 && proBox) {
      proBox.style.display = "block";
    }

  } catch (err) {
    console.error(err);
    resultBox.innerHTML = `
      <p style="color:red">
        No se pudo generar el análisis. Inténtalo de nuevo.
      </p>
    `;
  }
});

function renderClinicalReport(data) {
  const verdict = data.verdict || "No disponible";
  const score = data.score !== undefined ? data.score : "-";
  const analysis = data.analysis || "Análisis clínico no disponible.";
  const recommendation =
    data.recommendation ||
    "Se recomienda consultar con un veterinario especializado.";

  resultBox.innerHTML = `
    <div style="margin-top:40px">

      <h2>🧬 Informe clínico de viabilidad de cruce</h2>

      <p>
        <strong>Veredicto clínico:</strong>
        <span>${verdict}</span>
      </p>

      <p>
        <strong>Índice de riesgo:</strong>
        ${score} / 10
      </p>

      <hr style="margin:20px 0" />

      <section>
        <h3>📋 Evaluación clínica detallada</h3>
        <p>${analysis}</p>
      </section>

      <hr style="margin:20px 0" />

      <section>
        <h3>✅ Recomendación final</h3>
        <p>${recommendation}</p>
      </section>

    </div>
  `;
}

// ===============================
// Botón PRO (Stripe)
// ===============================
const proBtn = document.getElementById("pro");

if (proBtn) {
  proBtn.addEventListener("click", async () => {
    try {
      const res = await fetch(
        "https://breedingai-backend.onrender.com/create-checkout-session",
        { method: "POST" }
      );

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Error al redirigir a Stripe", err);
    }
  });
}













