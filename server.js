const express = require("express");
const bodyParser = require("body-parser");
const Datastore = require("nedb");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

const app = express();
const db = new Datastore({ filename: "data.db", autoload: true });

const routes = [
  { path: "/", component: "search" },
  { path: "/sobre", component: "sobre" },
  { path: "/contato", component: "contato" },
];

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("*", (req, res) => {
  const route = routes.find((r) => r.path === req.url);
  if (route) {
    const componentPath = path.join(
      __dirname,
      "views",
      route.component + ".ejs"
    );
    fs.readFile(componentPath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("<h1>Erro interno do servidor</h1>");
      } else {
        res.render("index", {
          content: data,
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
