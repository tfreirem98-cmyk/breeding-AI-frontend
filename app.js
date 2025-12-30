document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analysisForm");
  const result = document.getElementById("result");

  const verdictEl = document.getElementById("verdict");
  const analysisTextEl = document.getElementById("analysisText");
  const recommendationTextEl = document.getElementById("recommendationText");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const breed = document.getElementById("breed").value;
    const goal = document.getElementById("goal").value;
    const inbreeding = document.getElementById("consanguinity").value;

    const conditions = Array.from(
      document.querySelectorAll("input[name='conditions']:checked")
    ).map((c) => c.value);

    const res = await fetch(
      "https://breedingai-backend.onrender.com/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ breed, goal, inbreeding, conditions }),
      }
    );

    const data = await res.json();

    result.style.display = "block";
    verdictEl.textContent = data.verdict;
    analysisTextEl.textContent = data.explanation;
    recommendationTextEl.textContent = data.recommendations;
  });

  document.getElementById("payPro").addEventListener("click", async () => {
    const res = await fetch(
      "https://breedingai-backend.onrender.com/create-checkout-session",
      {
        method: "POST",
      }
    );

    const data = await res.json();
    window.location.href = data.url;
  });
});





