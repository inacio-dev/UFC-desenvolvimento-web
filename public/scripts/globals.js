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
