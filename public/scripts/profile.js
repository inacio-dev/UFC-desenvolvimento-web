var userId = document.getElementById("user-id").getAttribute("data-user-id");
var userType = document
  .getElementById("user-type")
  .getAttribute("data-user-type");

function updateProfileData(newProfileData) {
  var usernameElement = document.querySelector(".username");
  var descriptionElement = document.querySelector(".details-div p");

  usernameElement.textContent = newProfileData.username;
  descriptionElement.textContent = newProfileData.description;
}

function fetchDataAndRender() {
  axios
    .get("/data/profile", {
      headers: {
        id: userId,
        type: userType,
      },
    })
    .then(function (response) {
      var profileData = response.data;
      console.log(profileData);

      axios
        .post("/ejs/updateProfileData", { profileData: profileData })
        .then(function (response) {
          console.log(response.data);

          updateProfileData(profileData);
          updateImageData(profileData.images);
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
