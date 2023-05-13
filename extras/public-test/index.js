function renderPage() {
  const path = window.location.pathname;

  if (path === "/about") {
    // Renderiza a página "Sobre"
    document.body.innerHTML = "<h1>Sobre</h1><p>...</p>";
  } else if (path === "/contato") {
    // Renderiza a página "Contato"
    document.body.innerHTML = "<h1>Contato</h1><p>...</p>";
  } else {
    // Renderiza a página "Inicial" por padrão
    document.body.innerHTML = "<h1>Inicial</h1><p>...</p>";
  }
}

window.onload = function () {
  // Renderiza a página na carga inicial
  renderPage();

  // Renderiza a página quando houver uma mudança na URL
  window.onpopstate = function () {
    renderPage();
  };
};
