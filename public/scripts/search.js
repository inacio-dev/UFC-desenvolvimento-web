document.addEventListener("DOMContentLoaded", function () {
  var searchValue = new URLSearchParams(window.location.search).get("value");

  axios
    .get("http://localhost:8000/api/search/?value=" + searchValue)
    .then(function (response) {
      var data = response.data;
      var imagesContainer = document.querySelector(".grid-container");

      imagesContainer.innerHTML = ""; // Limpar o conteúdo existente

      if (data.images.length === 0) {
        imagesContainer.innerHTML = "Nenhum resultado encontrado.";
      } else {
        data.images.forEach(function (image) {
          var gridItem = document.createElement("div");
          gridItem.classList.add("grid-item");

          var gridImage = document.createElement("div");
          gridImage.classList.add("grid-image");

          var img = document.createElement("img");
          img.src = image.imageSrc;
          img.alt = "image";
          img.classList.add("image");

          gridImage.appendChild(img);
          gridItem.appendChild(gridImage);

          imagesContainer.appendChild(gridItem);
        });
      }
    })
    .catch(function (error) {
      console.error(error);
    });
});
