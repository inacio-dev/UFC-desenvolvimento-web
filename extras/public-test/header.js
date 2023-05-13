class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });

    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "/component/header.css");

    fetch("./header.html")
      .then((response) => response.text())
      .then((html) => {
        const template = document.createElement("template");
        template.innerHTML = html.trim();
        shadowRoot.appendChild(template.content.cloneNode(true));
      });

    shadowRoot.prepend(link);
  }
}

customElements.define("my-header", Header);
