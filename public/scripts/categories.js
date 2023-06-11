function updateCategoriesData(newCategoriesData) {
  var categoriesGrid = document.querySelector(".grid-container");
  categoriesGrid.innerHTML = "";

  newCategoriesData.forEach(function (category) {
    var gridItem = document.createElement("div");
    gridItem.className = "grid-item";

    var gridImage = document.createElement("div");
    gridImage.className = "grid-image";

    var image = document.createElement("img");
    image.src = category.imageSrc;
    image.alt = category.altText;
    image.className = "image";

    gridImage.appendChild(image);

    var categoryName = document.createElement("span");
    categoryName.className = "category-name";
    categoryName.innerText = category.name;

    gridItem.appendChild(gridImage);
    gridItem.appendChild(categoryName);

    categoriesGrid.appendChild(gridItem);
  });
}

function fetchDataAndRender() {
  axios
    .get("/data/categories")
    .then(function (response) {
      var categoriesData = response.data;
      console.log(categoriesData);

      axios
        .post("/ejs/updateCategoriesData", { categoriesData: categoriesData })
        .then(function (response) {
          console.log(response.data);

          updateCategoriesData(categoriesData);
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
