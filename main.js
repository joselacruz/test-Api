const API_URL_RANDOM =
  "https://api.thecatapi.com/v1/images/search?limit=3&";

const API_URL_FAVORITES ="https://api.thecatapi.com/v1/favourites";

const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload";
const API_URL_DELETE = (id) => ` https://api.thecatapi.com/v1/favourites/${id}?`;

const botoncito = document.querySelector("button");
const containerImg = document.querySelector(".random-cats");
const favoritesContain = document.querySelector(".favorites-cats");
const spanError = document.querySelector("#error");
const buttonUplad = document.getElementById('buttonUpload');
botoncito.addEventListener("click", () => viewRandomCat());
const filesLoad = document.getElementById('file');
const imgTag = document.getElementById('prewievCat');

const templateCards = (imgUrl, name, idImg) => {
  return `<article>
    <figure>
    <img src = ${imgUrl} id = "${idImg}">
    </figure>
    <button class = "btn2"> ${name} </button>
    </article>`;
};

async function viewCat(Apiurl, sectionName, nameButton) {
  const response = await fetch(Apiurl, {
    method: 'GET',
    headers:{
        'X-API-KEY':'live_Tsb8bwOJBKDNjjdJc2XKB3i2c3rOOo2VU6CpHknnj23xp5vm4j8mzHCCINKY2A5f',
    },
  });
  
  const data = await response.json();

  if (response.status !== 200) {
    sectionName.innerHTML = `Hubo un Error ${response.status} ${data.message}`;
  } else {
    const cards = data.map((item) => {
      return templateCards(item.url || item.image.url, nameButton, item.id);
    });
    
    sectionName.innerHTML = await cards.join("");
  }
}

async function viewRandomCat() {
  await viewCat(API_URL_RANDOM, containerImg, "Saved Cat and Favorite");
  getButtomOfTemplateHTML(containerImg, saveFavoritesCat);
}
viewRandomCat();

async function viewFavoriteCat() {
  await viewCat(API_URL_FAVORITES, favoritesContain, "Deleted Cat Favorite");
   getButtomOfTemplateHTML(favoritesContain,deleteFavoritesCat);
}
viewFavoriteCat();

async function saveFavoritesCat(id) {
  const response = await fetch(API_URL_FAVORITES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'X-API-KEY':'live_Tsb8bwOJBKDNjjdJc2XKB3i2c3rOOo2VU6CpHknnj23xp5vm4j8mzHCCINKY2A5f'
    },
    body: JSON.stringify({
      image_id: id,
    }),
  });
  viewFavoriteCat();
}
 async function deleteFavoritesCat(id) {
   const response = await fetch(API_URL_DELETE(id), {
    method: "DELETE",
    headers: {
        'X-API-KEY':'live_Tsb8bwOJBKDNjjdJc2XKB3i2c3rOOo2VU6CpHknnj23xp5vm4j8mzHCCINKY2A5f', 
    },
 });
viewFavoriteCat();
  

 }

function getButtomOfTemplateHTML(botonTagName, starFunction) {
  const obtain = botonTagName.childNodes;
  obtain.forEach((button) => {
    const bottonEvent = button.getElementsByTagName("button")[0];
    bottonEvent.addEventListener("click", (event) => {
      const idImgSelect =
        event.path[1].childNodes[1].getElementsByTagName("img")[0].id;
        console.log("ID OR" , idImgSelect);
      starFunction(idImgSelect);
    });
  });
}
 buttonUplad.addEventListener("click", uploadPhotoCat);
async function uploadPhotoCat () {
  imgTag.style.display = "none";//Ocultando imagen de previzualizar al  subir foto
  buttonUpload.style.display = "none"; //Ocultando boton de de click a subir foto
  const form = document.getElementById('uploadingForm');
  const formData = new FormData (form);
  console.log(formData.get('file'));

  const res = await fetch(API_URL_UPLOAD, {
    method: 'POST',
    headers: {
      'X-API-KEY':'live_Tsb8bwOJBKDNjjdJc2XKB3i2c3rOOo2VU6CpHknnj23xp5vm4j8mzHCCINKY2A5f',
    },
    body: formData,
  })
  const data = await res.json();
  console.log(data);
  saveFavoritesCat(data.id);
}


filesLoad.addEventListener("change", showImgPrewiev);

async function showImgPrewiev () {
  const prewiew = filesLoad.files;
  console.log("lt", filesLoad.files);
  const prewiewURL = URL.createObjectURL(prewiew[0]);
  imgTag.style.display = "block";
  imgTag.src = prewiewURL;
  buttonUpload.style.display = "block";
}