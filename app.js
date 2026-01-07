const btn = document.getElementById("analyze");
const report = document.getElementById("report");
const errorBox = document.getElementById("error");

btn.addEventListener("click", async () => {

  errorBox.classList.add("hidden");
  report.classList.add("hidden");

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;

  const antecedentes = Array.from(
    document.querySelectorAll(".checkbox-group input:checked")
  ).map(i => i.value);

  if (!raza) {
    alert("Selecciona una raza");
    return;
  }

  try {
    const res = await fetch("https://breedingai-backend.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raza,
        objetivo,
        consanguinidad,
        antecedentes
      })
    });

    if (!res.ok) throw new Error("Backend error");

    const data = await res.json();

    // Pintar resultados (solo si existen)
    document.getElementById("verdict").textContent = data.verdict || "No disponible";
    document.getElementById("score").textContent = data.score !== undefined ? `${data.score} / 10` : "-";

    document.getElementById("summary").textContent = data.sections?.summary || "No disponible.";
    document.getElementById("genetics").textContent = data.sections?.genetics || "No disponible.";
    document.getElementById("consanguinity").textContent = data.sections?.consanguinity || "No disponible.";
    document.getElementById("backgrounds").textContent = data.sections?.backgrounds || "No disponible.";
    document.getElementById("recommendation").textContent = data.sections?.recommendation || "No disponible.";

    report.classList.remove("hidden");

  } catch (e) {
    console.error(e);
    errorBox.classList.remove("hidden");
  }
});

















