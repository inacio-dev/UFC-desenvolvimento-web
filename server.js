const express = require("express");
const bodyParser = require("body-parser");
const Datastore = require("nedb");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

const app = express();
const db = new Datastore({ filename: "data.db", autoload: true });

const routes = [
  { path: "/", component: "pages/index" },
  { path: "/sobre", component: "pages/about" },
  { path: "/contato", component: "contato" },
  { path: "/perfil/:id", component: "pages/profile" },
];

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("*", (req, res) => {
  const route = routes.find((r) => {
    const pattern = new RegExp(`^${r.path.replace(/:[^\s/]+/g, "([\\w-]+)")}$`);
    return pattern.test(req.url);
  });

  if (route) {
    const componentPath = path.join(
      __dirname,
      "views",
      route.component + ".ejs"
    );
    const params = { ...req.params };
    const queryParams = { ...req.query };
    const data = { ...params, ...queryParams };
    fs.readFile(componentPath, "utf8", (err, content) => {
      if (err) {
        console.error(err);
        res.status(500).send("<h1>Erro interno do servidor</h1>");
      } else {
        res.render("main", {
          content,
          data,
        });
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
