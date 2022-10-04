const API_URL_RANDOM =
  "https://api.thecatapi.com/v1/images/search?limit=3&api_key=live_Tsb8bwOJBKDNjjdJc2XKB3i2c3rOOo2VU6CpHknnj23xp5vm4j8mzHCCINKY2A5f";

const API_URL_FAVORITES =
  "https://api.thecatapi.com/v1/favourites?limit=3&api_key=live_Tsb8bwOJBKDNjjdJc2XKB3i2c3rOOo2VU6CpHknnj23xp5vm4j8mzHCCINKY2A5f";

const botoncito = document.querySelector("button");
const containerImg = document.querySelector(".random-cats");
const favoritesContain = document.querySelector(".favorites-cats");
const spanError = document.querySelector("#error");
botoncito.addEventListener('click', () => viewCat(API_URL_RANDOM,containerImg,"Saved Cat and Favorite"));

const templateCards = (imgUrl, name) => {
  return `<article>
    <figure>
    <img src = ${imgUrl}>
    </figure>
    <button class = "btn2"> ${name} </button>
    </article>`
};

async function viewCat(Apiurl, sectionName, nameButton) {
  const response = await fetch(Apiurl);
  const data = await response.json();
  console.log("data", data);

  if (response.status !== 200) {
    sectionName.innerHTML = `Hubo un Error ${response.status} ${data.message}`;
  } 
  else {
    const cards = data.map((item) => {
      return templateCards(item.url || item.image.url , nameButton);
    });
  
    sectionName.innerHTML = cards.join('');
    console.log(cards, "Quien es cards" );

  }
}

async function viewRandomCat() {
  await viewCat(API_URL_RANDOM, containerImg, "Saved Cat and Favorite");
  const obtain = containerImg.childNodes;
  obtain.forEach( button => {
    const bottonEvent = button.getElementsByTagName('button')[0];
    bottonEvent.addEventListener("click", (event) => {
     console.log("me Llame");
     viewFavoriteCat();
     let imgSelect =  event.path[1].childNodes[1].getElementsByTagName('img')[0];
    
    })
 
 })
};
viewRandomCat();
async function viewFavoriteCat() {
    await viewCat(API_URL_FAVORITES, favoritesContain, "Deleted Cat Favorite");

    const obtain = favoritesContain.childNodes;
    obtain.forEach( button => {
       const bottonEvent = button.getElementsByTagName('button')[0];
       bottonEvent.addEventListener("click", (event) => {
        console.log("me Llame log");
        let imgSelect =  event.path[1].childNodes[1].getElementsByTagName('img')[0];
       
       })
    
    })
    
}
viewFavoriteCat();




async function saveFavoritesCat(id) {
  const response = await fetch(API_URL_FAVORITES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_id: id,
    }),
  });
  console.log("Response", response);
}

saveFavoritesCat();
