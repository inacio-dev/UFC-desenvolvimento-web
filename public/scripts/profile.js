function renderPageProfile() {
  var profileData = JSON.parse(localStorage.getItem("profileData"));

  if (profileData) {
    var profileImage = document.querySelector(".profile-image");
    var username = document.querySelector(".profile-card-left p");
    var imagesCount = document.querySelector(".profile-stat:nth-child(1) p");
    var price = document.querySelector(".price");
    var description = document.querySelector(".description");

    profileImage.src = profileData.image_user;
    username.textContent = profileData.name;
    imagesCount.textContent = profileData.images
      ? profileData.images.length
      : 0;
    price.textContent = profileData.wallet;
    description.textContent = profileData.description;

    var gridContainer = document.querySelector(".grid-container");
    gridContainer.innerHTML = "";

    if (profileData.images && Array.isArray(profileData.images)) {
      for (var i = 0; i < profileData.images.length; i++) {
        var gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");

        var img = document.createElement("img");
        img.src = profileData.images[i].imageSrc;
        img.alt = profileData.images[i].title;
        img.classList.add("image");

        gridItem.appendChild(img);
        gridContainer.appendChild(gridItem);
      }
    }
  }
}

function getUserIdFromURL() {
  var url = window.location.href;
  var userId = url.substring(url.lastIndexOf("/") + 1);
  return userId;
}

function fetchDataAndRenderProfile() {
  var userId = getUserIdFromURL();

  axios
    .get("http://127.0.0.1:8000/api/profile/" + userId)
    .then(function (response) {
      var profileData = response.data;

      localStorage.setItem("profileData", JSON.stringify(profileData));

      renderPageProfile();
    })
    .catch(function (error) {
      console.error(error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndRenderProfile();

  var user = JSON.parse(localStorage.getItem("user"));
  var editProfileButton = document.querySelector("#edit-profile-button");
  var withdrawMoneyButton = document.querySelector("#withdraw-money-button");
  var addMoneyButton = document.querySelector("#add-money-button");

  editProfileButton.style.display = "none";
  withdrawMoneyButton.style.display = "none";
  addMoneyButton.style.display = "none";

  if (user && user.isLoggedIn) {
    editProfileButton.style.display = "block";
    editProfileButton.addEventListener("click", function () {
      // Quando o botão "Editar Perfil" for clicado, vamos abrir ou fechar o formulário de edição
      var editProfileForm = document.getElementById("edit-profile-form");
      if (editProfileForm) {
        if (editProfileForm.style.display === "block") {
          editProfileForm.style.display = "none"; // Fecha o formulário se estiver visível
        } else {
          editProfileForm.style.display = "block"; // Abre o formulário se estiver oculto
        }
      }
    });

    if (user.type === "normal") {
      withdrawMoneyButton.style.display = "block";
      withdrawMoneyButton.addEventListener("click", function () {
        // Lógica para redirecionar para a página de retirar dinheiro
      });
    } else if (user.type === "empresa") {
      addMoneyButton.style.display = "block";
      addMoneyButton.addEventListener("click", function () {
        // Lógica para redirecionar para a página de adicionar dinheiro
      });
    }
  }

  var user = JSON.parse(localStorage.getItem("user"));

  var editProfileForm = document.querySelector("#edit-profile-form");
  editProfileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var formData = new FormData(editProfileForm);
    var description = formData.get("description");
    var username = formData.get("username");

    axios
      .patch("http://localhost:8000/api/update-profile/", {
        description: description,
        username: username,
        user: user.id,
      })
      .then(function (response) {
        var data = response.data;

        alert(data.message);
        window.location.reload();
      })
      .catch(function (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("user");
          alert(error.response);
          window.location.href = "/";
        } else {
          alert("Ocorreu um erro na solicitação. Por favor, tente novamente.");
          console.log(error);
        }
      });
  });
});
