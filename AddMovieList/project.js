const form = document.getElementById("film-form");
const titleElement = document.querySelector("#title");
const directorElement = document.querySelector("#director");
const urlElement = document.querySelector("#url");
const cardBody = document.querySelectorAll(".card-body")[1];
const clear = document.getElementById("clear-films");

//* Tüm eventleri yükleme
eventListeners();

function eventListeners() {
  form.addEventListener("submit", addFilm);
  document.addEventListener("DOMContentLoaded", function () {
    let films = Storage.getFilmsFromStorage();
    UI.loadAllFilms(films);
  });
  cardBody.addEventListener("click", deleteFilm);
  clear.addEventListener("click", clearAllFilms);
}

function addFilm(e) {
  const title = titleElement.value;
  const director = directorElement.value;
  const url = urlElement.value;

  if (title === "" || director === "" || url === "") {
    UI.displayMessages("Tüm alanları doldurunuz...", "danger");
  } else {
    //* Yeni Film
    const newFilm = new Film(title, director, url);
    UI.addFilmToUI(newFilm); //* Arayüze film ekleme
    Storage.addFilmToStorage(newFilm); //* Storage film ekleme
    UI.displayMessages("Film eklendi...", "success");
  }
  UI.clearInputs(titleElement, directorElement, urlElement);

  e.preventDefault();
}

function deleteFilm(e) {
  if (e.target.id === "delete-film") {
    UI.deleteFilmFromUI(e.target);
    Storage.deleteFilmFromStorage(
      e.target.parentElement.previousElementSibling.previousElementSibling
        .textContent
    );
    UI.displayMessages("Silme işlemi başarılı...", "success");
  }
}

function clearAllFilms() {
  if (confirm("Emin misiniz ?")) {
    UI.clearAllFilmsFromUI();
    Storage.clearAllFilmsFromStorage();
  }
}
