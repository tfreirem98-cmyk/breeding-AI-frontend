const form = document.getElementById("analysis-form");
const resultBox = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const breed = document.getElementById("breed").value;
  const goal = document.getElementById("goal").value;
  const inbreeding = document.getElementById("inbreeding").value;

  // 🔥 AQUÍ ESTABA EL ERROR
  const conditions = Array.from(
    document.querySelectorAll('input[name="conditions"]:checked')
  ).map((c) => c.value);

  try {
    const res = await fetch(
      "https://breedingai-backend.vercel.app/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          breed,
          goal,
          inbreeding,
          conditions,
        }),
      }
    );

    if (!res.ok) throw new Error("Error en backend");

    const data = await res.json();

    resultBox.innerHTML = `
      <h3>${data.status}</h3>
      <p><strong>Compatibilidad:</strong> ${data.compatibility}/10</p>
      <p><strong>Riesgo hereditario:</strong> ${data.hereditaryRisk}/10</p>
      <p><strong>Adecuación al objetivo:</strong> ${data.suitability}/10</p>
      <p>${data.message}</p>
    `;
  } catch (err) {
    resultBox.innerHTML =
      "El análisis no está disponible en este momento. Inténtalo de nuevo.";
  }
});



