const API = "https://breedingai-backend.onrender.com";

const params = new URLSearchParams(window.location.search);
const isPro = params.get("pro") === "1";

document.getElementById("analyze").onclick = async () => {
  const antecedentes = [...document.querySelectorAll("input:checked")].map(i => i.value);

  const res = await fetch(`${API}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      raza: raza.value,
      objetivo: objetivo.value,
      consanguinidad: consanguinidad.value,
      antecedentes,
      isPro
    })
  });

  if (res.status === 403) {
    result.innerHTML = "Límite gratuito alcanzado.";
    return;
  }

  const data = await res.json();
  result.innerText = data.analysis + `\n\nUsos restantes: ${data.usesLeft}`;
};

document.getElementById("pro").onclick = async () => {
  const res = await fetch(`${API}/create-checkout-session`, { method: "POST" });
  const data = await res.json();
  window.location.href = data.url;
};







