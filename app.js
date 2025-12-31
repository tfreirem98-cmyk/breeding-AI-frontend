document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analysis-form");
  const resultCard = document.getElementById("result");

  const verdictEl = document.getElementById("verdict");
  const scoreEl = document.getElementById("score");
  const summaryEl = document.getElementById("summary");
  const recommendationEl = document.getElementById("recommendation");

  const params = new URLSearchParams(window.location.search);
  const isPro = params.get("pro") === "true";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const breed = document.getElementById("breed").value;
    const goal = document.getElementById("goal").value;
    const inbreeding = document.getElementById("inbreeding").value;

    const antecedentes = Array.from(
      document.querySelectorAll("fieldset input[type='checkbox']:checked")
    ).map((el) => el.value);

    resultCard.classList.remove("hidden");
    verdictEl.textContent = "Analizando…";
    scoreEl.textContent = "—";
    summaryEl.textContent = "";
    recommendationEl.textContent = "";

    const res = await fetch(
      "https://breedingai-backend.onrender.com/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          breed,
          goal,
          consanguinity: inbreeding,
          antecedentes,
          pro: isPro,
        }),
      }
    );

    const data = await res.json();

    verdictEl.textContent = data.verdict;
    scoreEl.textContent = `${data.score} / 10`;
    summaryEl.textContent = data.summary;

    if (data.locked) {
      recommendationEl.innerHTML = `
        <strong>🔒 Informe PRO bloqueado</strong><br/>
        Desbloquea el análisis completo y recomendaciones profesionales.
        <br/><br/>
        <button id="payPro" class="btn-primary">Desbloquear PRO</button>
      `;

      document.getElementById("payPro").addEventListener("click", iniciarPago);
    } else {
      recommendationEl.textContent = data.recommendation;
    }
  });

  async function iniciarPago() {
    const res = await fetch(
      "https://breedingai-backend.onrender.com/create-checkout-session",
      { method: "POST" }
    );

    const data = await res.json();
    window.location.href = data.url;
  }
});






