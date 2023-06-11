const express     = require("express");
const bodyParser  = require("body-parser");
const ejs         = require("ejs");
const path        = require("path");
const fs          = require("fs");
const { pathToRegexp } = require("path-to-regexp");

const app   = express();

const routes = [
  {
    path: "/",
    component: "pages/index",
    data: {
      imageData: [
        { imageSrc: "/images/test-image.jpg", altText: "image 1" },
        { imageSrc: "/images/test-image.jpg", altText: "image 2" },
        { imageSrc: "/images/test-image.jpg", altText: "image 3" },
        { imageSrc: "/images/test-image.jpg", altText: "image 1" },
        { imageSrc: "/images/test-image.jpg", altText: "image 2" },
        { imageSrc: "/images/test-image.jpg", altText: "image 3" },
      ],
    },
  },
  { path: "/categorias", component: "pages/categories" },
  { path: "/busca", component: "pages/search" },
  { path: "/publicar", component: "pages/publish" },
  { path: "/contato"   , component: "contato" },
  { path: "/perfil/:id", component: "pages/profile" },
];

const routeMatchers = routes.map((route) => {
  const keys = [];
  const pattern = pathToRegexp(route.path, keys);
  return { route, pattern, keys };
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("*", (req, res) => {
  let match = null;
  for (const { route, pattern, keys } of routeMatchers) {
    const result = pattern.exec(req.path);
    if (result) {
      match = { route, keys, params: {} };
      for (let i = 1; i < result.length; i++) {
        const key = keys[i - 1];
        const value = result[i];
        match.params[key.name] = value;
      }
      break;
    }
  }

  if (match) {
    const { route, params } = match;
    const componentPath = path.join(
      __dirname,
      "views",
      route.component + ".ejs"
    );
    const queryParams = req.query;
    const data = { ...params, ...queryParams, ...route.data };

    const isFileRequest = req.url.includes(".");
    const newData = isFileRequest ? undefined : data;

    fs.readFile(componentPath, "utf8", (err, content) => {
      if (err) {
        console.error(err);
        res.status(500).send("<h1>Erro interno do servidor</h1>");
      } else {
        const renderedContent = ejs.render(content, data);
        const mainTemplatePath = path.join(__dirname, "views", "main.ejs");

        ejs.renderFile(
          mainTemplatePath,
          {
            content: renderedContent,
            data: newData,
          },
          (err, mainContent) => {
            if (err) {
              console.error(err);
              res.status(500).send("<h1>Erro interno do servidor</h1>");
            } else {
              res.send(mainContent);
            }
          }
        );
      }
    });
  } else {
    res.status(404).send("<h1>Página não encontrada</h1>");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
