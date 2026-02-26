const url = 'https://api.github.com/repos/DanMartinez-kz/ArrMidi/contents/presets/';

async function cargarListaPresets() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const archivosJson = data.filter(file => file.name.endsWith('.json'));
    const lista = document.getElementById('mi-lista');
    lista.innerHTML = "";

    archivosJson.forEach(file => {
      const li = document.createElement('li');
      li.textContent = file.name;
      li.addEventListener("click", () => {
        fetch(file.download_url)
          .then(r => r.json())
          .then(json => {
            console.log("Preset cargado:", json);
            aplicarPreset(json);
          });
      });
      lista.appendChild(li);
    });
  } catch (error) {
    console.error('Error al obtener archivos:', error);
  }
}

function aplicarPreset(data) {
  console.log("Style cargado:", data);
  style = data;
  drawNotes();
}

// Toggle menú flotante
document.getElementById("toggle-explorador").addEventListener("click", () => {
  // Llamada inicial
cargarListaPresets();
  const menu = document.getElementById("menu-flotante");
  menu.style.display = (menu.style.display === "none" || menu.style.display === "") ? "block" : "none";
});

// Guardar preset
async function guardarPreset(nombre, contenidoJson) {
  const urlGuardar = "https://api.github.com/repos/DanMartinez-kz/ArrMidi/contents/presets/" + nombre;
  const token = ""; // ⚠️ usa variable de entorno en backend, no expongas token en frontend

  const data = {
    message: "Añadir preset " + nombre,
    content: toBase64(JSON.stringify(contenidoJson, null, 2)),
  };

  const response = await fetch(urlGuardar, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  console.log(result);

  // 🔄 Recargar lista después de guardar
  cargarListaPresets();
}

function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

// Abrir el diálogo
const dialogo = document.getElementById("dialogo-preset");
document.getElementById("abrir-dialogo").addEventListener("click", () => {
  dialogo.showModal();
});

// Guardar cuando se confirma
document.getElementById("guardar").addEventListener("click", () => {
  const nombre = document.getElementById("nombre-preset").value.trim();
  if (nombre) {
    guardarPreset(nombre, style);
  }
});