function updateImageData(newImageData) {
  var gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = "";

  newImageData.forEach(function (image) {
    var gridItem = document.createElement("div");
    gridItem.className = "grid-item";

    var img = document.createElement("img");
    img.src = image.imageSrc;
    img.alt = image.altText;
    img.className = "image";

    gridItem.appendChild(img);
    gridContainer.appendChild(gridItem);
  });
}

function fetchDataAndRender() {
  axios
    .get("/data")
    .then(function (response) {
      var imageData = response.data;
      console.log(imageData);

      axios
        .post("/ejs/updateImageData", { imageData: imageData })
        .then(function (response) {
          console.log(response.data);

          updateImageData(imageData);
        })
        .catch(function (error) {
          console.error(error);
        });
    })
    .catch(function (error) {
      console.error(error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndRender();
});
