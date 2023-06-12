
document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio do formulário padrão

    var searchValue = document.querySelector(".search-input").value;
    var url = "/search?value=" + encodeURIComponent(searchValue);

    window.location.href = url; // Redireciona para a página desejada
  }); 

  const chk = document.getElementById('chk');
  const html = document.querySelector('html');
  
  chk.addEventListener('change', () => {
      // document.main.classList.toggle('light')
      html.classList.toggle('light')
  })

let font_size = 0 ;


function aumentar(){

    if (font_size < 4)
    {
      font_size = font_size + 1 ;
      html.classList.toggle('A'+font_size);
      console.log("Aumentou para " + font_size);
    }else{console.log("Valor maximo " + font_size);}
    
    
}

function diminuir(){
  if (font_size > 0){
  html.classList.toggle('A'+font_size);
  font_size = font_size - 1 ;
  console.log("Diminuiu para " + font_size);
  }else{
    console.log("Valor mínimo " + font_size);}
}
