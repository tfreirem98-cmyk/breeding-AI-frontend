document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const resultBox = document.getElementById("result");

  if (!form) {
    console.error("Formulario no encontrado");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const breed = document.getElementById("breed")?.value;
    const goal = document.getElementById("goal")?.value;
    const consanguinity = document.getElementById("consanguinity")?.value;

    const antecedentes = [];
    document
      .querySelectorAll("input[name='antecedentes']:checked")
      .forEach((el) => antecedentes.push(el.value));

    if (!breed || !goal || !consanguinity) {
      alert("Faltan datos del formulario");
      return;
    }

    if (resultBox) {
      resultBox.innerHTML = "Analizando…";
    }

    try {
      const response = await fetch(
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

      if (!response.ok) {
        throw new Error("Error en backend");
      }

      const data = await response.json();

      if (resultBox) {
        resultBox.innerHTML = `
          <h3>Resultado del análisis</h3>
          <p><strong>Veredicto:</strong> ${data.verdict}</p>
          <p><strong>Puntuación:</strong> ${data.score}</p>
          <p>${data.explanation}</p>
          <p><strong>Recomendación:</strong> ${data.recommendation}</p>
        `;
      }
    } catch (error) {
      console.error(error);
      if (resultBox) {
        resultBox.innerHTML =
          "El análisis no está disponible en este momento. Inténtalo de nuevo.";
      }
    }
  });

  // ======================
  // BOTÓN PLAN PRO
  // ======================
  const proBtn = document.getElementById("payPro");

  if (proBtn) {
    proBtn.addEventListener("click", async () => {
      try {
        const res = await fetch(
          "https://breedingai-backend.onrender.com/create-checkout-session",
          {
            method: "POST",
          }
        );

        if (!res.ok) throw new Error("Stripe error");

        const data = await res.json();
        window.location.href = data.url;
      } catch (err) {
        alert("No se pudo iniciar el pago PRO");
      }
    });
  }
});





