let font_size = 0;
var html = document.querySelector("html");

function renderPageHeader() {
  var user = JSON.parse(localStorage.getItem("user"));

  var fontSizePreference = getFontSizePreference();
  if (fontSizePreference) {
    font_size = parseInt(fontSizePreference);
    html.classList.add("A" + font_size);
  }

  if (user && user.isLoggedIn) {
    var navItems = document.createElement("ul");

    var exploreItem = document.createElement("li");
    var exploreLink = document.createElement("a");
    exploreLink.href = "/";
    exploreLink.textContent = "Explore";
    exploreItem.appendChild(exploreLink);
    navItems.appendChild(exploreItem);

    if (user.type === "normal") {
      var publishItem = document.createElement("li");
      var publishLink = document.createElement("a");
      publishLink.href = "/publish";
      publishLink.textContent = "Publish";
      publishItem.appendChild(publishLink);
      navItems.appendChild(publishItem);
    }

    var profileItem = document.createElement("li");
    var profileLink = document.createElement("a");
    profileLink.href = "/profile/" + user.id;
    profileLink.textContent = "My Profile";
    profileItem.appendChild(profileLink);
    navItems.appendChild(profileItem);

    var exitItem = document.createElement("li");
    var exitForm = document.createElement("form");
    exitForm.id = "formLogout"; // Atribui o mesmo ID do formulário do HTML
    exitForm.method = "POST";
    exitForm.action = "/request/logout";
    exitForm.classList.add("exit-form"); // Adiciona a classe "exit-form" ao formulário
    var exitButton = document.createElement("button");
    exitButton.type = "submit";
    exitButton.textContent = "Exit";
    exitForm.appendChild(exitButton);
    exitItem.appendChild(exitForm);
    navItems.appendChild(exitItem);

    var nav = document.querySelector("nav");
    nav.innerHTML = ""; // Limpar o conteúdo anterior
    nav.appendChild(navItems);
  } else {
    var navItems = document.createElement("ul");

    var exploreItem = document.createElement("li");
    var exploreLink = document.createElement("a");
    exploreLink.href = "/";
    exploreLink.textContent = "Explore";
    exploreItem.appendChild(exploreLink);
    navItems.appendChild(exploreItem);

    var signInItem = document.createElement("li");
    var signInLink = document.createElement("a");
    signInLink.href = "/login";
    signInLink.textContent = "Sign in";
    signInItem.appendChild(signInLink);
    navItems.appendChild(signInItem);

    var signUpItem = document.createElement("li");
    var signUpLink = document.createElement("a");
    signUpLink.href = "/register";
    signUpLink.textContent = "Sign up";
    signUpItem.appendChild(signUpLink);
    navItems.appendChild(signUpItem);

    var nav = document.querySelector("nav");
    nav.innerHTML = ""; // Limpar o conteúdo anterior
    nav.appendChild(navItems);
  }
}

function saveFontSizePreference(fontSize) {
  localStorage.setItem("fontSizePreference", fontSize);
}

function getFontSizePreference() {
  return localStorage.getItem("fontSizePreference");
}

function aumentar() {
  if (font_size < 4) {
    font_size = font_size + 1;
    html.classList.toggle("A" + font_size);
    saveFontSizePreference(font_size);
    console.log("Aumentou para " + font_size);
  } else {
    console.log("Valor máximo " + font_size);
  }
}

function diminuir() {
  if (font_size > 0) {
    html.classList.toggle("A" + font_size);
    font_size = font_size - 1;
    saveFontSizePreference(font_size);
    console.log("Diminuiu para " + font_size);
  } else {
    console.log("Valor mínimo " + font_size);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  renderPageHeader();
  window.addEventListener("popstate", renderPageHeader);

  var logoutForm = document.querySelector("#formLogout");
  if (logoutForm) {
    logoutForm.addEventListener("submit", function (event) {
      event.preventDefault();

      axios
        .post("http://127.0.0.1:8000/api/logout/")
        .then(function (response) {
          var user = response.data;

          localStorage.removeItem("user");
          axios.defaults.headers.common["Authorization"] = "";

          console.log(user);
          window.location.href = "/";
        })
        .catch(function (error) {
          console.error(error);
        });
    });
  }

  document
    .getElementById("searchForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      var searchValue = document.querySelector(".search-input").value;
      var url = "/search?value=" + encodeURIComponent(searchValue);

      window.location.href = url;
    });

  /* const chk = document.getElementById("chk");

  chk.addEventListener("change", () => {
    // document.main.classList.toggle('light')
    html.classList.toggle("light");
  }); */
});
