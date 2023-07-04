document.addEventListener("DOMContentLoaded", function () {
  var user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.isLoggedIn) {
    window.location.href = "/";
  }

  var publishForm = document.querySelector("#publish-form");

  publishForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var formData = new FormData(publishForm);
    var title = formData.get("title");
    var price = formData.get("price");
    var image = document.getElementById("image-input").files[0];

    axios
      .post(
        "http://localhost:8000/api/publish-image/",
        {
          title: title,
          price: price,
          image: image,
          user: user.id,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data", // Defina o cabeçalho "Content-Type"
          },
        }
      )
      .then(function (response) {
        var data = response.data;

        alert(data.message);
        window.location.href = "/";
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

  var previewImage = document.querySelector("#preview-image");
  var imageInput = document.getElementById("image-input");
  imageInput.addEventListener("change", function () {
    var file = imageInput.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      previewImage.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
});
