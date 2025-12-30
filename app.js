fetch("https://breedingai-backend.vercel.app/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    breed,
    goal,
    inbreeding,
    conditions,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Resultado:", data);
    // pintar resultado en UI
  })
  .catch(() => {
    showError("El análisis no está disponible en este momento.");
  });



