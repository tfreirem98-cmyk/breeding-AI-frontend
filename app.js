const API_URL = "https://breedingai-backend.onrender.com";

const analyzeBtn = document.getElementById("analyze");
const resultBox = document.getElementById("result");
const proBox = document.getElementById("proBox");
const proBtn = document.getElementById("pro");
const proResult = document.getElementById("proResult");

analyzeBtn.addEventListener("click", async () => {
  resultBox.innerHTML = "<p>Analizando...</p>";
  proResult.innerHTML = "";
  proBox.style.display = "none";

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;
  const antecedentes = [...document.querySelectorAll("input:checked")].map(
    el => el.value
  );

  const res = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      raza,
      objetivo,
      consanguinidad,
      antecedentes
    })
  });

  const data = await res.json();

  if (res.status === 403) {
    resultBox.innerHTML = `<p>${data.message}</p>`;
    proBox.style.display = "block";
    return;
  }

  resultBox.innerHTML = `
    <h3>${data.resultado.veredicto}</h3>
    <p>${data.resultado.descripcion}</p>
    <p><strong>Recomendación:</strong> ${data.resultado.recomendacion}</p>
    <p><em>Usos restantes: ${data.usosRestantes}</em></p>
  `;
});

proBtn.addEventListener("click", async () => {
  proResult.innerHTML = "<p>Generando informe profesional…</p>";

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;
  const antecedentes = [...document.querySelectorAll("input:checked")].map(
    el => el.value
  );

  const res = await fetch(`${API_URL}/analyze-pro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      raza,
      objetivo,
      consanguinidad,
      antecedentes
    })
  });

  const data = await res.json();

  proResult.innerHTML = `
    <h2>Informe profesional</h2>
    <p>${data.informeProfesional.replace(/\n/g, "<br><br>")}</p>
  `;
});





