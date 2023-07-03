/* document.addEventListener("DOMContentLoaded", function () {
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
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then(function (response) {
        var data = response.data;

        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          // Redirect to the homepage
          window.location.href = "/";
        }
      })
      .catch(function (error) {
        alert(error);
      });
  });
}); */
