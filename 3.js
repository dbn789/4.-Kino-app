const url = "https://www.imdb.com/chart/top/?ref_=chtmvm_ql_3";
const searchUrl = "https://kinobox.tv/api/search/suggestions?query=";

const topFilmArray = [];

const scrollUp = document.querySelector(".scroll-up");
const scrollDown = document.querySelector(".scroll-down");

const filmTitle = document.querySelector(".film-title");
const filmPoster = document.querySelector(".film-poster");
const blockTitle = document.querySelector(".title-block");

const bestFilm = document.querySelector(".film-best");
const randomFilm = document.querySelector(".film-random");

const inputSearch = document.querySelector(".search-input");
const buttonSearch = document.querySelector(".search-btn");
const listFilms = document.getElementsByClassName("films-list")[0];

const backToList = document.querySelector(".films-back");
const watchFilm = document.querySelector(".film-watch");
const playerKinobox = document.querySelector(".kinobox_player");

let slide, kinobox;

scrollUp.addEventListener("click", () => {
  slide--;
  slide = run(slide);
});

scrollDown.addEventListener("click", () => {
  slide++;
  slide = run(slide);
});

bestFilm.addEventListener("click", () => run(0));
randomFilm.addEventListener("click", () => run(getRandomFilm()));
watchFilm.addEventListener("click", () => play());
buttonSearch.addEventListener("click", () => search());
listFilms.addEventListener("click", (e) => runAndPlay(e));
backToList.addEventListener("click", () => getFilmList());

async function getData(url) {
  const data = await fetch(url);
  const result = await data.text();
  return result;
}

async function getTop250ver2() {
  const reg =
    /{"currentRank":[A-Za-zА-яа-яÅÇÖёôöèéçüùûíáäñ 0-9:,.·'"«»{}()+_@/-]*,"voteCount"/g;
  const rank = /"currentRank":\d+/g;
  const name = /"titleText":{"text":"[^"]+/g;
  const nameOrig = /"originalTitleText":{"text":"[^"]+/g;
  const image = /,"url":"[^"]+/g;
  const year = /"releaseYear":{"year":\d+/g;
  const res = await getData(url);
  const dataArray = res.match(reg);

  dataArray.forEach((text, index) => {
    topFilmArray[index] = {
      ...topFilmArray[index],
      ...{ rank: text.match(rank)[0].replace('"currentRank":', "") },
    };
    topFilmArray[index] = {
      ...topFilmArray[index],
      ...{ title: text.match(name)[0].replace('"titleText":{"text":"', "") },
    };
    topFilmArray[index] = {
      ...topFilmArray[index],
      ...{
        orig: text
          .match(nameOrig)[0]
          .replace('"originalTitleText":{"text":"', ""),
      },
    };
    topFilmArray[index] = {
      ...topFilmArray[index],
      ...{ poster: text.match(image)[0].replace(',"url":"', "") },
    };
    topFilmArray[index] = {
      ...topFilmArray[index],
      ...{ year: text.match(year)[0].replace('"releaseYear":{"year":', "") },
    };
  });
  console.log(topFilmArray);
}

async function getTop250() {
  const rank = /"currentRank":\d+/g;
  const name = /"titleText":{"text":"[^"]+/g;
  const nameOrig = /"originalTitleText":{"text":"[^"]+/g;
  const image = /,"url":"[^"]+/g;
  const year = /"releaseYear":{"year":\d+/g;

  const res = await getData(url);
  //console.log(res);
  let dataArray = res.match(rank);
  dataArray.forEach((rank) =>
    topFilmArray.push({ rank: rank.replace('"currentRank":', "") })
  );

  dataArray = res.match(name);
  dataArray.forEach((el, index) => {
    const text = { title: el.replace('"titleText":{"text":"', "") };
    topFilmArray[index] = { ...topFilmArray[index], ...text };
  });

  dataArray = res.match(nameOrig);
  dataArray.forEach((el, index) => {
    const text = { orig: el.replace('"originalTitleText":{"text":"', "") };
    topFilmArray[index] = { ...topFilmArray[index], ...text };
  });

  dataArray = res.match(image);
  dataArray.forEach((el, index) => {
    const image = { poster: el.replace(',"url":"', "") };
    topFilmArray[index] = { ...topFilmArray[index], ...image };
  });

  dataArray = res.match(year);
  dataArray.forEach((el, index) => {
    const year = { year: el.replace('"releaseYear":{"year":', "") };
    topFilmArray[index] = { ...topFilmArray[index], ...year };
  });

  console.log(topFilmArray);
}

function run(number) {
  watchFilm.classList.remove("hidden");
  playerKinobox.classList.add("hidden");
  playerKinobox.innerHTML = "";
  listFilms.classList.add("hidden");
  backToList.classList.add("hidden");
  listFilms.innerHTML = "";
  blockTitle.classList.remove("hidden");

  if (number === -1) number = 249;
  if (number === 250) number = 0;

  slide = number;
  getBackground(topFilmArray[number].poster).then((result) => {
    topFilmArray[number] = { ...topFilmArray[number], ...result };

    filmTitle.style.backgroundImage = topFilmArray[number].color;
    blockTitle.firstElementChild.textContent = `${topFilmArray[number].title} (${topFilmArray[number].year})`;
    blockTitle.lastElementChild.textContent = `Номер ${topFilmArray[number].rank} в рейтинге IMDB`;
    filmPoster.style.background = `URL(${topFilmArray[number].poster}) no-repeat`;
    filmPoster.style.backgroundSize = "cover";
  });

  return number;
}

function runAndPlay(event) {
  const { id, name, year, rank } = event.target.dataset;
  playerKinobox.innerHTML = "";
  playerKinobox.classList.add("hidden");
  blockTitle.classList.remove("hidden");
  watchFilm.classList.add("hidden");
  listFilms.style.display = "none";
  blockTitle.firstElementChild.textContent = `${name} (${year})`;
  blockTitle.lastElementChild.textContent = `Рейтинг Кинопоиска ${rank}`;
  filmPoster.style.background = `URL(https://st.kp.yandex.net/images/film_iphone/iphone360_${id}.jpg) no-repeat`;
  filmPoster.style.backgroundSize = "cover";
  getBackground(
    `https://st.kp.yandex.net/images/film_iphone/iphone360_${id}.jpg`
  ).then((result) => {
    filmTitle.style.backgroundImage = result.color;
    play(id);
    backToList.classList.remove("hidden");
  });
}

function getFilmList() {
  playerKinobox.classList.add("hidden");
  backToList.classList.add("hidden");
  blockTitle.classList.add("hidden");
  playerKinobox.innerHTML = "";
  listFilms.style.display = "flex";
}

async function getBackground(poster) {
  const urlPoster = encodeURIComponent(poster);
  console.log(urlPoster);

  const res = await getData(
    `https://www.degraeve.com/color-palette/cp.php?url=${urlPoster}`
  );
  const backArray = res.match(/<div style="background:#\w+/g);
  let str = "linear-gradient(135deg";
  for (let i = 0; i < 3; i++) {
    str += backArray[i].replace('<div style="background:', `, `);
  }
  str += ")";

  return { color: str };
}

function getRandomFilm() {
  slide = Math.floor(Math.random() * 250);
  return slide;
}

async function getIdFilm(query) {
  const data = await fetch(searchUrl + query);
  const result = await data.json();
  return result;
}

async function search() {
  const query = encodeURI(inputSearch.value);
  const filmIds = await getIdFilm(query);
  inputSearch.value = "";

  listFilms.innerHTML = "";
  playerKinobox.innerHTML = "";
  playerKinobox.classList.add("hidden");
  watchFilm.classList.add("hidden");
  blockTitle.classList.add("hidden");
  backToList.classList.add("hidden");
  listFilms.classList.remove("hidden");
  listFilms.style.height = "70vh";

  if (filmIds.length === 0) {
    listFilms.style.border = "none";
    listFilms.innerHTML =
      "<h2 style='color: white; text-align: center; margin: 200px auto'>Фильмы не найдены!</h2>";
  } else {
    appendFilms(filmIds);
  }
}

function appendFilms(filmsArray) {
  listFilms.style.display = "flex";
  for (film of filmsArray) {
    const filmBlock = document.createElement("div");
    const filmName = document.createElement("div");
    filmName.setAttribute("id", "film__name");
    filmName.innerText = `${film.primaryTitle} (${film.year})`;
    filmBlock.setAttribute("class", "film");
    filmBlock.setAttribute("data-id", film.id);
    filmBlock.setAttribute("data-name", film.primaryTitle);
    filmBlock.setAttribute("data-year", film.year);
    filmBlock.setAttribute("data-rank", film.rating);
    filmBlock.style.background = `url(https://st.kp.yandex.net/images/film_iphone/iphone360_${film.id}.jpg)`;
    filmBlock.style.backgroundSize = "cover";
    filmBlock.style.backgroundRepeat = "no-repeat";
    filmBlock.append(filmName);
    listFilms.append(filmBlock);
  }
}

function play(filmNameOrId = "") {
  watchFilm.classList.add("hidden");
  playerKinobox.classList.remove("hidden");
  if (!filmNameOrId) {
    filmNameOrId = topFilmArray[slide].orig;
  }
  initPlayer(filmNameOrId);
}

function initPlayer(id) {
  const defaultConfig = {
    enable: true,
    token: "{token}",
  };

  kinobox = new Kinobox(".kinobox_player", {
    search: { query: id },
    menu: {
      format: "{N} :: {S} ({T}, {Q})",
    },
    players: {
      Collaps: {
        ...defaultConfig,
        position: 0,
      },
      Bazon: {
        ...defaultConfig,
        token: "7705a0ec196f4b05f1acba6e89442af7",
      },
      Alloha: defaultConfig,
      Ashdi: defaultConfig,
      Cdnmovies: defaultConfig,
      Hdvb: defaultConfig,
      Iframe: defaultConfig,
      Kodik: defaultConfig,
      Videocdn: defaultConfig,
      Voidboost: defaultConfig,
    },
  });

  kinobox.init();
}

async function begin() {
  let date = Date.now();
  scrollUp.classList.add("hidden");
  scrollDown.classList.add("hidden");
  bestFilm.classList.add("hidden");
  randomFilm.classList.add("hidden");
  watchFilm.classList.add("hidden");
  inputSearch.classList.add("hidden");
  buttonSearch.classList.add("hidden");

  //await getTop250();
  await getTop250ver2();
  const initFilm = getRandomFilm();
  slide = run(initFilm);

  scrollUp.classList.remove("hidden");
  scrollDown.classList.remove("hidden");
  bestFilm.classList.remove("hidden");
  randomFilm.classList.remove("hidden");
  watchFilm.classList.remove("hidden");
  inputSearch.classList.remove("hidden");
  buttonSearch.classList.remove("hidden");

  console.log(Date.now() - date);
}
/////////////////////////      BEGIN     //////////////////////////////////

begin();
