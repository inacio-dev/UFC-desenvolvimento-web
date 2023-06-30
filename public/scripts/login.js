document.addEventListener("DOMContentLoaded", function () {
  var user = JSON.parse(localStorage.getItem("user"));

  if (user && user.isLoggedIn) {
    window.location.href = "/";
  }

  var loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var emailInput = document.querySelector('input[type="text"]');
    var passwordInput = document.querySelector('input[type="password"]');

    var email = emailInput.value;
    var password = passwordInput.value;

    axios
      .post("/request/user", { email: email, password: password })
      .then(function (response) {
        var user = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        axios.defaults.headers.common["Authorization"] = "Bearer " + user.token;

        console.log(user);
        window.location.href = "/";
      })
      .catch(function (error) {
        console.error(error);
      });
  });
});
