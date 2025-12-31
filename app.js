const result = document.getElementById("result");

document.getElementById("analyze").onclick = () => {
  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;
  const antecedentes = [...document.querySelectorAll("input:checked")].map(a => a.value);

  let score = 0;
  if (consanguinidad === "Media") score += 2;
  if (consanguinidad === "Alta") score += 4;
  score += antecedentes.length;

  let verdict = "RIESGO BAJO";
  if (score >= 4) verdict = "RIESGO MODERADO";
  if (score >= 7) verdict = "RIESGO ALTO";

  result.innerHTML = `
    <h2>Resultado del análisis</h2>
    <p><strong>Veredicto:</strong> ${verdict}</p>
    <p><strong>Puntuación:</strong> ${score}</p>
    <p>
      Evaluación basada en raza (${raza}), objetivo (${objetivo}),
      consanguinidad (${consanguinidad}) y antecedentes.
    </p>
  `;
};

document.getElementById("pro").onclick = () => {
  window.location.href = "https://breedingai-backend.onrender.com/create-checkout-session";
};






