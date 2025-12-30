document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analysisForm");
  const report = document.getElementById("report");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const raza = document.getElementById("raza").value;
    const objetivo = document.getElementById("objetivo").value;
    const consanguinidad = document.getElementById("consanguinidad").value;

    const antecedentes = Array.from(
      document.querySelectorAll(".checks input:checked")
    ).map(cb => cb.value);

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

    const data = await res.json();
    const r = data.resultado;

    document.getElementById("clasificacion").textContent = r.clasificacion;
    document.getElementById("riesgo").textContent = r.scores.riesgoHereditario;
    document.getElementById("compatibilidad").textContent = r.scores.compatibilidadGenetica;
    document.getElementById("adecuacion").textContent = r.scores.adecuacionObjetivo;

    report.classList.remove("hidden");
    report.scrollIntoView({ behavior: "smooth" });
  });
});


