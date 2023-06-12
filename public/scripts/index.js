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
