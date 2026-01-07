const analyzeBtn = document.getElementById("analyzeBtn");
const errorDiv = document.getElementById("error");
const report = document.getElementById("report");

analyzeBtn.addEventListener("click", async () => {
  errorDiv.textContent = "";
  report.style.display = "none";

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;

  const antecedentes = Array.from(
    document.querySelectorAll(".checkbox-group input:checked")
  ).map(cb => cb.value);

  if (!raza || !objetivo || !consanguinidad) {
    errorDiv.textContent = "Por favor, completa todos los campos obligatorios.";
    return;
  }

  try {
    const response = await fetch("https://breedingai-backend.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raza,
        objetivo,
        consanguinidad,
        antecedentes
      })
    });

    if (!response.ok) {
      throw new Error("Error en el backend");
    }

    const data = await response.json();

    document.getElementById("verdict").textContent = data.verdict;
    document.getElementById("score").textContent = `Índice de riesgo: ${data.score} / 10`;

    const factorsList = document.getElementById("factors");
    factorsList.innerHTML = "";
    data.factors.forEach(f => {
      const li = document.createElement("li");
      li.textContent = f;
      factorsList.appendChild(li);
    });

    const alertsList = document.getElementById("alerts");
    alertsList.innerHTML = "";
    data.alerts.forEach(a => {
      const li = document.createElement("li");
      li.textContent = a;
      alertsList.appendChild(li);
    });

    document.getElementById("recommendation").textContent =
      data.recommendation;

    report.style.display = "block";

  } catch (err) {
    errorDiv.textContent = "No se pudo generar el análisis. Inténtalo de nuevo.";
    console.error(err);
  }
});












