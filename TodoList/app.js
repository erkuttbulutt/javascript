//! Tüm elementleri seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

// !Tüm event listenerlar
function eventListeners() {
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  secondCardBody.addEventListener("click", deleteTodo);
  filter.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearAllTodos);
}

//! Tüm taskları silme
function clearAllTodos() {
  //* Arayüzden kaldırma
  if (confirm("Tümünü silmek istediğinize emin misiniz?")) {
    //todoList.innerHTML = "";//yavaş yöntem
    while (todoList.firstElementChild != null) {
      todoList.removeChild(todoList.firstElementChild);
    }
    localStorage.removeItem("todos");
  }
}

//! Filtreleme işlemi
function filterTodos(e) {
  const filterValue = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function (listItem) {
    //* her bir li'nin texti'ni atama
    const text = listItem.textContent.toLowerCase();
    //* text index.of diyerek array'de arama yapılıyor. Eğer uygun sonuç varsa 0 yoksa -1 değeri dönmüş oluyor.
    if (text.indexOf(filterValue) === -1) {
      //Bulunamadı
      //* li elementinin içinde boostrap classı olan d-flex bulunuyor. Bu class display özelliklerini değiştirmemize engellediği için important kullanarak bunun önüne geçmiş oluyoruz.
      listItem.setAttribute("style", "display:none !important");
    } else {
      listItem.setAttribute("style", "display: block");
    }
  });
}

//! Silme işlemi (UI)
function deleteTodo(e) {
  if (e.target.className === "fa fa-remove") {
    //* i > a > li
    e.target.parentElement.parentElement.remove();
    //* local storage'dan silmek için li'nin text'ini gönderiyoruz
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    showAlert("success", "Todo başarıyla silindi");
  }
}

//! Silme işlemi (Local Storage)
function deleteTodoFromStorage(deletetodo) {
  let todos = getTodosFromStorage();

  //* deletetodo: silmek istenilen li'deki text, todos: local storage'dan getirilen veriler. Bunların kontrolünü sağlıyoruz
  todos.forEach(function (todo, index) {
    if (todo === deletetodo) {
      todos.splice(index, 1); //array'den forEach'deki index'e göre silme. 1: ise o index'den sonra kaç eleman silineceği
    }
  });
  //* local storage yeni veriyle güncelleme
  localStorage.setItem("todos", JSON.stringify(todos));
}

//! sayfa yenilendiğinde önceden oluşturulan todoları(local stroage'dan) UI'ya aktarma
function loadAllTodosToUI() {
  let todos = getTodosFromStorage();
  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}

function addTodo(e) {
  //* trim fonskiyonu baştaki ve sondaki boşlukları silerek bir string verir
  const newTodo = todoInput.value.trim();
  if (newTodo === "") {
    showAlert("danger", "Lütfen bir todo girin!");
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("success", "Başarıyla eklendi.");
  }
  e.preventDefault();
}

//! Bu fonskiyon local stroage boşsa todos key'ini oluşturur. Boş değilse todoları todos array'ine kaydeder ve return ile döndürür.
function getTodosFromStorage() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

//! Local Storeage'a Kaydetme
function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

//TODO Altta oluşturulan alert
{
  /* <div class="alert alert-danger" role="alert">
  <strong>asdasd</strong>asdasdasdasdd
</div>; */
}

function showAlert(type, message) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  firstCardBody.appendChild(alert);

  //* setTimeout: alert'in 1 sn sonra yok olması için kullandık
  setTimeout(function () {
    alert.remove();
  }, 1000);
}

//TODO Alttaki fonskiyonda bu elemetleri oluşturduk
{
  /* <li class="list-group-item d-flex justify-content-between">
  Todo 1
  <a href="#" class="delete-item">
    <i class="fa fa-remove"></i>
  </a>
</li>; */
}

//! Bu fonksiyon alınan string değeri (newTodo) list item olarak UI'ya aktaracak
function addTodoToUI(newTodo) {
  //* list item oluşturma
  const listItem = document.createElement("li");
  listItem.className = "list-group-item d-flex justify-content-between";

  //* a yani link oluşturma
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class='fa fa-remove'></i>";

  //* text node ekleme
  listItem.appendChild(document.createTextNode(newTodo));

  //* a yı li'nin çocuğu olarak ekleme
  listItem.appendChild(link);

  //* ul'ye oluşturulan li'yi çocuk olarak ekleme
  todoList.appendChild(listItem);

  //* ekleme işlemi yapıldıktan sonra inputta yazılan yazı durduğu için silme işlemi
  todoInput.value = "";
}
