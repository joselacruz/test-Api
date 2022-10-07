const API = axios.create({
  baseURL: 'https://api.thecatapi.com/v1'
});
API.defaults.headers.common['X-API-KEY'] = 'live_Tsb8bwOJBKDNjjdJc2XKB3i2c3rOOo2VU6CpHknnj23xp5vm4j8mzHCCINKY2A5f';

const API_URL_RANDOM =
  "https://api.thecatapi.com/v1/images/search?limit=3&";

const API_URL_FAVORITES = "https://api.thecatapi.com/v1/favourites";

const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload";
const API_URL_DELETE = (id) => ` https://api.thecatapi.com/v1/favourites/${id}?`;

const botoncito = document.querySelector("button");
const containerImg = document.querySelector(".random-cats");
const favoritesContain = document.querySelector(".favorites-cats");
const buttonUplad = document.getElementById('buttonUpload');
botoncito.addEventListener("click", () => viewRandomCat());
const filesLoad = document.getElementById('file');
const imgTag = document.getElementById('prewievCat');
const alertForUploads = document.querySelector('#alert-uploading');

//Template HTML Cards
const templateCards = (imgUrl, idImg, name) => {
  return `<article>
    <figure>
    <img src = ${imgUrl} id = "${idImg}">
    </figure>
    <button class = "btn2"> ${name}
   <span> 
    </span>  
    </button>
    </article>`;
};
//Funcion que carga la logica para cargar las card de Random Cat y Favorites 
async function viewCat(Apiurl, sectionName, nameButton) {
  const response = await fetch(Apiurl, {
    method: 'GET',
    headers: {
      'X-API-KEY': 'live_Tsb8bwOJBKDNjjdJc2XKB3i2c3rOOo2VU6CpHknnj23xp5vm4j8mzHCCINKY2A5f',
    },
  });

  const data = await response.json();

  if (response.status !== 200) {
    sectionName.innerHTML = `Hubo un Error ${response.status} ${data.message}`;
  } else {
    const cards = data.map((item) => {
      return templateCards(item.url || item.image.url, item.id, nameButton);
    });
    const spiner = data.map((item) => {
      return templateCards("./icons/Spinner-1s-200px.svg", item.id, nameButton);
    });
    sectionName.innerHTML = await spiner.join("");
    setTimeout(() => {
      sectionName.innerHTML = " ";
      sectionName.innerHTML = cards.join("");
    }, 1000);

  }
}
//funcion que visualiza la sectio de Random Cat
async function viewRandomCat() {
  await viewCat(API_URL_RANDOM, containerImg, "Add to Favorites");
  setTimeout(() => {
    getButtomOfTemplateHTML(containerImg, saveFavoritesCat);
  }, 2000);
}

viewRandomCat();

//funcion que visualiza la section de favorite cat
async function viewFavoriteCat() {
  await viewCat(API_URL_FAVORITES, favoritesContain, "Remove from Favorites");
  setTimeout(() => {
    getButtomOfTemplateHTML(favoritesContain, deleteFavoritesCat);
  }, 2000)
}
viewFavoriteCat();

//Funcion que carga la logica  para guardar una imagen a favorito
async function saveFavoritesCat(id) {

  const { data, status } = await API.post('/favourites', {
    image_id: id,
  });
  viewFavoriteCat();
}

//Funcion que carga la logica  para borrar una imagen a favorito
async function deleteFavoritesCat(id) {

  const response = await fetch(API_URL_DELETE(id), {
    method: "DELETE",
    headers: {
      'X-API-KEY': 'live_Tsb8bwOJBKDNjjdJc2XKB3i2c3rOOo2VU6CpHknnj23xp5vm4j8mzHCCINKY2A5f',
    },
  });

  viewFavoriteCat();


}
//Funcion que carga la logica del evento add event listener las card en general
function getButtomOfTemplateHTML(botonTagName, starFunction) {
  const obtain = botonTagName.childNodes;
  obtain.forEach((button) => {
    const bottonEvent = button.getElementsByTagName("button")[0];
    bottonEvent.addEventListener("click", (event) => {

      const idImgSelect =
        event.path[2].childNodes[1].getElementsByTagName("img")[0].id;
      console.log("ID OR", idImgSelect);
      starFunction(idImgSelect);
    });
  });
}
buttonUplad.addEventListener("click", uploadPhotoCat);

//Funcion que carga la logica para subir una imagen propia
async function uploadPhotoCat() {
  imgTag.style.display = "none";//Ocultando imagen de previzualizar al  subir foto
  buttonUpload.style.display = "none"; //Ocultando boton de de click a subir foto
  alertForUploads.style.display = "block";
  alertForUploads.innerText = "Waiting . . .";
  try {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);
    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
      method: 'POST',
      headers: {
        'X-API-KEY': 'live_Tsb8bwOJBKDNjjdJc2XKB3i2c3rOOo2VU6CpHknnj23xp5vm4j8mzHCCINKY2A5f',
      },
      body: formData,
    })
    const data = await res.json();
    console.log(data);
    await saveFavoritesCat(data.id);
    alertForUploads.style.display = "none";
  }
  catch {
    alertForUploads.innerText = "Seleciona una imagen de Gatito valida";
    setTimeout(() => {
      alertForUploads.style.display = "none";
    }, 5000)
  }
}

filesLoad.addEventListener("change", showImgPrewiev);

//Funcion que muestra una vista previa de la  imagen seleciona en el input type File
async function showImgPrewiev() {
  const prewiew = filesLoad.files;
  console.log("lt", filesLoad.files);
  const prewiewURL = URL.createObjectURL(prewiew[0]);
  imgTag.style.display = "block";
  imgTag.src = prewiewURL;
  buttonUpload.style.display = "block";
}

