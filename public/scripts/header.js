
document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio do formulário padrão

    var searchValue = document.querySelector(".search-input").value;
    var url = "/search?value=" + encodeURIComponent(searchValue);

    window.location.href = url; // Redireciona para a página desejada
  }); 

  const chk = document.getElementById('chk')
  const html = document.querySelector('html')
  
  chk.addEventListener('change', () => {
      // document.main.classList.toggle('light')
      html.classList.toggle('light')
  })

  