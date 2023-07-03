document.addEventListener("DOMContentLoaded", function () {
  var user = JSON.parse(localStorage.getItem("user"));

  if (user && user.isLoggedIn) {
    window.location.href = "/";
  }

  var signupForm = document.querySelector("#signup-form");
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var formData = new FormData(signupForm);
    var email = formData.get("email");
    var password = formData.get("password");
    var repeatPassword = formData.get("repeatPassword");
    var userType = formData.get("userType");

    if (password !== repeatPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/cadastro/", {
        email: email,
        password: password,
        type: userType,
      })
      .then(function (response) {
        var data = response.data;

        localStorage.setItem("user", JSON.stringify(data));

        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          // Redirecionar para a página de login
          window.location.href = "/";
        }
      })
      .catch(function (error) {
        alert(error);
      });
  });
});
