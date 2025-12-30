const form = document.getElementById("analysisForm");
const resultBox = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const breed = document.getElementById("breed").value;
  const goal = document.getElementById("goal").value;
  const inbreeding = document.getElementById("inbreeding").value;

  const issues = [...form.querySelectorAll("input[type=checkbox]:checked")]
    .map(i => i.value);

  resultBox.classList.remove("hidden");
  resultBox.textContent = "Generando análisis...";

  try {
    const res = await fetch("https://breedingai-backend.vercel.app/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ breed, goal, inbreeding, issues })
    });

    if (!res.ok) throw new Error("Backend error");

    const data = await res.json();

    resultBox.innerHTML = `
      <h2>${data.verdict}</h2>
      <p><strong>Compatibilidad genética:</strong> ${data.compatibility}/10</p>
      <p><strong>Riesgo hereditario:</strong> ${data.risk}/10</p>
      <p><strong>Adecuación al objetivo:</strong> ${data.goalScore}/10</p>
      <p>${data.summary}</p>
    `;

  } catch (err) {
    resultBox.textContent =
      "El análisis no está disponible en este momento. Inténtalo de nuevo.";
  }
});


