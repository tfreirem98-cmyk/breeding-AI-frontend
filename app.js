const breeds = [
  "Golden Retriever","Labrador Retriever","Pastor Alemán","Border Collie",
  "Caniche","Bulldog Francés","Bulldog Inglés","Doberman","Rottweiler",
  "Beagle","Cocker Spaniel","Husky Siberiano","Chihuahua","Shih Tzu",
  "Mastín Español","Dogo Argentino","Akita Inu","Samoyedo","Yorkshire Terrier",
  "Whippet","Galgo Español","Shar Pei","Cane Corso","San Bernardo",
  "Gran Danés","Weimaraner","Basset Hound","Pastor Australiano","Malinois"
];

const breedSelect = document.getElementById("breed");
breeds.forEach(b => {
  const o = document.createElement("option");
  o.value = b;
  o.textContent = b;
  breedSelect.appendChild(o);
});

document.getElementById("analysis-form").addEventListener("submit", async e => {
  e.preventDefault();

  const antecedentes = [...document.querySelectorAll("input[type=checkbox]:checked")]
    .map(c => c.value);

  const payload = {
    breed: breedSelect.value,
    goal: document.getElementById("goal").value,
    consanguinity: document.getElementById("consanguinity").value,
    antecedentes
  };

  const res = await fetch("https://breedingai-backend.vercel.app/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  document.getElementById("result").innerHTML = `
    <h2>${data.veredicto}</h2>
    <p>Compatibilidad genética: ${data.compatibilidadGenetica}/10</p>
    <p>Riesgo hereditario: ${data.riesgoHereditario}/10</p>
    <p>Adecuación al objetivo: ${data.adecuacionObjetivo}/10</p>
    <p>${data.recomendacion}</p>
  `;
});



