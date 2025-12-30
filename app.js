const form = document.getElementById("analysisForm");
const resultBox = document.getElementById("resultado");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;

  const antecedentes = Array.from(
    document.querySelectorAll("input[type=checkbox]:checked")
  ).map(cb => cb.value);

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

    const data = await response.json();

    if (!data.success) throw new Error("Respuesta inválida");

    const r = data.resultado;

    document.getElementById("estado").textContent = r.estado;
    document.getElementById("compatibilidad").textContent = r.compatibilidad;
    document.getElementById("riesgo").textContent = r.riesgoHereditario;
    document.getElementById("adecuacion").textContent = r.adecuacionObjetivo;
    document.getElementById("recomendacion").textContent = r.recomendacion;

    const ul = document.getElementById("advertencias");
    ul.innerHTML = "";
    r.advertencias.forEach(a => {
      const li = document.createElement("li");
      li.textContent = a;
      ul.appendChild(li);
    });

    resultBox.classList.remove("hidden");
    resultBox.scrollIntoView({ behavior: "smooth" });

  } catch (err) {
    alert("Error al generar el análisis. Revisa el backend.");
    console.error(err);
  }
});


