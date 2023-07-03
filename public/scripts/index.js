function renderPage() {
  var imageData = JSON.parse(localStorage.getItem("imageData"));
  var totalPages = parseInt(localStorage.getItem("totalPages"));
  var currentPage = parseInt(localStorage.getItem("currentPage"));

  if (imageData && Array.isArray(imageData)) {
    var gridContainer = document.querySelector(".grid-container");
    gridContainer.innerHTML = "";

    for (var i = 0; i < imageData.length; i++) {
      var gridItem = document.createElement("div");
      gridItem.classList.add("grid-item");

      var img = document.createElement("img");
      img.src = imageData[i].imageSrc;
      img.alt = imageData[i].title;
      img.classList.add("image");

      gridItem.appendChild(img);
      gridContainer.appendChild(gridItem);
    }
  }

  var paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  if (totalPages > 1) {
    if (currentPage > 1) {
      var previousButton = document.createElement("button");
      previousButton.textContent = "Anterior";
      previousButton.onclick = function () {
        changePage(currentPage - 1);
      };
      paginationContainer.appendChild(previousButton);
    }

    if (currentPage < totalPages) {
      var nextButton = document.createElement("button");
      nextButton.textContent = "Próximo";
      nextButton.onclick = function () {
        changePage(currentPage + 1);
      };
      paginationContainer.appendChild(nextButton);
    }
  }
}

function fetchDataAndRender() {
  axios
    .get("http://127.0.0.1:8000/api/images/")
    .then(function (response) {
      var imageData = response.data.images;
      var totalPages = response.data.totalPages;
      var currentPage = response.data.currentPage;

      localStorage.setItem("imageData", JSON.stringify(imageData));
      localStorage.setItem("totalPages", totalPages);
      localStorage.setItem("currentPage", currentPage);

      renderPage();
    })
    .catch(function (error) {
      console.error(error);
    });
}

function changePage(pageNumber) {
  axios
    .get(`http://127.0.0.1:8000/api/images?page=${pageNumber}`)
    .then(function (response) {
      var imageData = response.data.images;
      var totalPages = response.data.totalPages;
      var currentPage = response.data.currentPage;

      localStorage.setItem("imageData", JSON.stringify(imageData));
      localStorage.setItem("totalPages", totalPages);
      localStorage.setItem("currentPage", currentPage);

      renderPage();
    })
    .catch(function (error) {
      console.error(error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndRender();
});
