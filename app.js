const API_URL = "https://breedingai-backend.onrender.com";

const form = document.getElementById("analysis-form");
const resultBox = document.getElementById("result");
const proBox = document.getElementById("pro-box");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  resultBox.innerHTML = "Analizando...";
  proBox.style.display = "none";

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;

  const antecedentes = [];
  document
    .querySelectorAll("input[name='antecedentes']:checked")
    .forEach((el) => antecedentes.push(el.value));

  try {
    const res = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raza,
        objetivo,
        consanguinidad,
        antecedentes,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      resultBox.innerHTML = `<p class="error">${data.error}</p>`;
      if (data.usosRestantes === 0) mostrarPro();
      return;
    }

    renderResultado(data);

    if (data.usosRestantes === 0) {
      mostrarPro();
    }
  } catch (err) {
    resultBox.innerHTML =
      "<p class='error'>No se pudo conectar con el servidor</p>";
  }
});

function renderResultado(data) {
  resultBox.innerHTML = `
    <h2>Resultado del análisis</h2>

    <div class="badge ${data.riesgo.toLowerCase()}">
      Riesgo ${data.riesgo}
    </div>

    <p><strong>Puntuación:</strong> ${data.score}/10</p>

    <h3>Resumen profesional</h3>
    <p>${data.resumen}</p>

    <h3>Diagnóstico técnico</h3>
    <p>${data.diagnostico}</p>

    ${
      data.riesgos.length
        ? `<h3>Riesgos identificados</h3>
           <ul>${data.riesgos.map((r) => `<li>${r}</li>`).join("")}</ul>`
        : ""
    }

    <h3>Recomendación</h3>
    <p>${data.recomendacion}</p>

    <p class="nota">${data.notaProfesional}</p>

    <p class="usos">Usos gratuitos restantes: ${data.usosRestantes}</p>
  `;
}

function mostrarPro() {
  proBox.style.display = "block";
}

document.getElementById("go-pro").addEventListener("click", async () => {
  const res = await fetch(`${API_URL}/create-checkout-session`);
  const data = await res.json();
  window.location.href = data.url;
});






