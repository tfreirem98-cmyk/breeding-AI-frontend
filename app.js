// ======================
// ANALYSIS FORM
// ======================
const form = document.getElementById("analysisForm");
const resultBox = document.getElementById("result");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const breed = document.getElementById("breed").value;
    const goal = document.getElementById("goal").value;
    const consanguinity = document.getElementById("consanguinity").value;

    const antecedentes = [];
    document
      .querySelectorAll("input[name='antecedentes']:checked")
      .forEach((el) => antecedentes.push(el.value));

    resultBox.innerHTML = "Analizando…";

    try {
      const res = await fetch(
        "https://breedingai-backend.onrender.com/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            breed,
            goal,
            consanguinity,
            antecedentes,
          }),
        }
      );

      if (!res.ok) throw new Error("Error backend");

      const data = await res.json();

      resultBox.innerHTML = `
        <h3>Resultado del análisis</h3>
        <p><strong>Veredicto:</strong> ${data.verdict}</p>
        <p><strong>Puntuación:</strong> ${data.score}</p>
        <p>${data.explanation}</p>
        <p><strong>Recomendación:</strong> ${data.recommendation}</p>
      `;
    } catch (err) {
      resultBox.innerHTML =
        "El análisis no está disponible en este momento. Inténtalo de nuevo.";
    }
  });
}

// ======================
// STRIPE PRO BUTTON
// ======================
const proBtn = document.getElementById("payPro");

if (proBtn) {
  proBtn.addEventListener("click", async () => {
    try {
      const res = await fetch(
        "https://breedingai-backend.onrender.com/create-checkout-session",
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Stripe error");

      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      alert("No se pudo iniciar el pago PRO");
    }
  });
}




