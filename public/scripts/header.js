
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

var font_size = 0 ;
const btn_plus = document.getElementById('A-plus');
const btn_minus = document.getElementById('A-minus')
const font = html.getElementById("size_btn"); //.classList ;

btn_plus.addEventListener("click", () => {
  // document.main.classList.toggle('light')
  // html.classList.add('light')
  if(font_size == 0){
    font.classList.add("A1");
    // font.add("A1");
    font_size = font_size + 1 ;
  }else if(font_size == 1 ){
    html.classList.replace( "A1" , "A2" );
    font_size = font_size + 1 ;
  }else if(font_size == 2){
    html.classList.replace( "A2" , "A3" );
    font_size = font_size + 1 ;
  }else if(font_size == 3){
    html.classList.replace( "A3" , "A4" );
    font_size = font_size + 1 ;
  }
  
})

btn_minus.addEventListener("click", () => {
  // document.main.classList.toggle('light')
  if(font_size == 1){
    html.classList.remove("A1")
    font_size = font_size - 1 ;
  }else if(font_size == 2 ){
    html.classList.replace( "A2" , "A1" );
    font_size = font_size - 1 ;
  }else if(font_size == 3){
    html.classList.replace( "A3" , "A2" );
    font_size = font_size - 1 ;
  }else if(font_size == 4){
    html.classList.replace( "A4" , "A3" );
    font_size = font_size - 1 ;
  }
})