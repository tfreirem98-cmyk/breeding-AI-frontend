// ===== CONFIG =====
const BACKEND_URL = "https://breedingai-backend.onrender.com";

// ===== ELEMENTOS =====
const btnAnalizar = document.getElementById("btn-analizar");
const btnPro = document.getElementById("btn-pro");
const resultado = document.getElementById("resultado");

// ===== ANÁLISIS =====
btnAnalizar.addEventListener("click", async () => {
  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;

  const antecedentes = Array.from(
    document.querySelectorAll("input[name='antecedentes']:checked")
  ).map((el) => el.value);

  try {
    const res = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raza,
        objetivo,
        consanguinidad,
        antecedentes,
      }),
    });

    const data = await res.json();

    resultado.innerHTML = `
      <h3>Resultado del análisis</h3>
      <p><strong>Veredicto:</strong> ${data.veredicto}</p>
      <p><strong>Puntuación:</strong> ${data.puntuacion}</p>
      <p>${data.descripcion}</p>
      <p><strong>Recomendación:</strong> ${data.recomendacion}</p>
    `;
  } catch (err) {
    resultado.innerHTML = "Error al generar el análisis.";
  }
});

// ===== STRIPE PRO =====
btnPro.addEventListener("click", async () => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/create-checkout-session`,
      { method: "POST" }
    );

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("No se pudo iniciar el pago.");
    }
  } catch (err) {
    alert("Error al conectar con el servidor.");
  }
});








