const form = document.getElementById("analysis-form");
const resultBox = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const breed = document.getElementById("breed").value;
  const goal = document.getElementById("goal").value;
  const consanguinity = document.getElementById("consanguinity").value;

  const antecedents = Array.from(
    document.querySelectorAll("input[name='antecedents']:checked")
  ).map(el => el.value);

  try {
    const res = await fetch("https://breedingai-backend.vercel.app/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        breed,
        goal,
        consanguinity,
        antecedents
      })
    });

    if (!res.ok) throw new Error("Error servidor");

    const data = await res.json();

    resultBox.innerHTML = `
      <h3>${data.label}</h3>
      <p>Compatibilidad genética: ${data.scores.compatibility}/10</p>
      <p>Riesgo hereditario: ${data.scores.risk}/10</p>
      <p>Adecuación al objetivo: ${data.scores.goal}/10</p>
      <p>${data.text}</p>
    `;
  } catch (err) {
    resultBox.innerHTML = "<p>Error al generar el análisis</p>";
  }
});




