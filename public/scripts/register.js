document.addEventListener("DOMContentLoaded", function () {
  var user = JSON.parse(localStorage.getItem("user"));

  if (user && user.isLoggedIn) {
    window.location.href = "/";
  }
});
