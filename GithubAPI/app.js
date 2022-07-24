//* Elements
const githubForm = document.getElementById("github-form");
const nameInput = document.getElementById("githubname");
const clearLastUsers = document.getElementById("clear-last-users");
const lastUsers = document.getElementById("last-users");
const github = new Github();
const ui = new UI();

eventListeners();

function eventListeners() {
  githubForm.addEventListener("submit", getData);
  clearLastUsers.addEventListener("click", clearAllSearched);
  document.addEventListener("DOMContentLoaded", getAllSearched); //* Sayfa yenilendiğinde çalışan event
}

function getData(e) {
  let username = nameInput.value.trim();

  if (username === "") {
    alert("Lütfen geçerli bir kullanıcı adı giriniz.");
  } else {
    github
      .getGithubData(username)
      .then((response) => {
        if (response.user.message === "Not Found") {
          ui.showError("Kullanıcı bulunamadı.");
        } else {
          ui.addSearchUserToUI(username);
          Storage.addSearchUserToStorage(username);
          ui.showUserInfo(response.user);
          ui.showRepoInfo(response.repo);
        }
      })
      .catch((err) => ui.showError(err));
  }

  ui.clearInput(); //* Input temizleme

  e.preventDefault();
}

function clearAllSearched() {
  if(confirm("Emin misiniz?")){
    Storage.clearAllSearchedUsersFromStorage();
    ui.clearAllSearchedUsersFromUI()
  }
}

function getAllSearched() {
  let users = Storage.getSearchedUsersFromStorage();
  let result = "";
  users.forEach((user) => {
    result += `<li class="list-group-item">${user}</li>`;
  });
  lastUsers.innerHTML = result;
}
