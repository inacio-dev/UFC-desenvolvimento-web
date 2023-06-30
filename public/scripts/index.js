function renderPage() {
  var imageData = JSON.parse(localStorage.getItem("imageData"));
  if (imageData && Array.isArray(imageData)) {
    var gridContainer = document.querySelector(".grid-container");
    gridContainer.innerHTML = "";

    for (var i = 0; i < imageData.length; i++) {
      var gridItem = document.createElement("div");
      gridItem.classList.add("grid-item");

      var img = document.createElement("img");
      img.src = imageData[i].imageSrc;
      img.alt = imageData[i].altText;
      img.classList.add("image");

      gridItem.appendChild(img);
      gridContainer.appendChild(gridItem);
    }
  }
}

function fetchDataAndRender() {
  axios
    .get("http://localhost:3000/data")
    .then(function (response) {
      var imageData = response.data;
      console.log(imageData);
      localStorage.setItem("imageData", JSON.stringify(imageData));
      renderPage();
    })
    .catch(function (error) {
      console.error(error);
    });
}

function changePage(pageNumber) {
  axios
    .get(`http://localhost:3000/data?pag=${pageNumber}`)
    .then(function (response) {
      var imageData = response.data;
      localStorage.setItem("imageData", JSON.stringify(imageData));
      renderPage();
    })
    .catch(function (error) {
      console.error(error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndRender();
});
