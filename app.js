const API = "https://breedingai-backend.onrender.com";
const result = document.getElementById("result");

document.getElementById("analyze").onclick = async () => {
  result.innerHTML = "Analizando con IA...";

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;
  const antecedentes = [...document.querySelectorAll("input:checked")].map(
    el => el.value
  );

  try {
    const res = await fetch(`${API}/analyze`, {
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

    const formatted = data.analysis
      .replace("VEREDICTO:", "<h2>Veredicto</h2>")
      .replace("EXPLICACIÓN:", "<h3>Explicación técnica</h3>")
      .replace("RECOMENDACIÓN:", "<h3>Recomendación profesional</h3>");

    result.innerHTML = formatted;
  } catch {
    result.innerHTML = "Error al generar el análisis.";
  }
};

document.getElementById("pro").onclick = () => {
  window.location.href =
    "https://breedingai-backend.onrender.com/create-checkout-session";
};


