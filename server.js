const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const { pathToRegexp } = require("path-to-regexp");
const axios = require("axios");

const app = express();

const routes = [
  {
    path: "/",
    component: "pages/index",
    data: { imageData: {}, currentPage: 0, totalPages: 0 },
  },
  {
    path: "/categories",
    component: "pages/categories",
    data: { categoriesData: {} },
  },
  { path: "/search", component: "pages/search", data: {} },
  { path: "/publish", component: "pages/publish", data: {} },
  {
    path: "/profile/:id",
    component: "pages/profile",
    data: {
      profileData: {
        profileImage: "",
        username: "",
        images: [],
        follows: 0,
        likes: 0,
        price: "",
        description: "",
        socialMedia: [],
      },
    },
  },
  { path: "/login", component: "pages/login", data: {} },
  { path: "/register", component: "pages/register", data: {} },
  { path: "/adm-login", component: "pages/adm-login", data: {} },
  { path: "/my-image", component: "pages/my-image", data: {} },
  { path: "/buy", component: "pages/buy", data: {} },
];

const routeMatchers = routes.map((route) => {
  const keys = [];
  const pattern = pathToRegexp(route.path, keys);
  return { route, pattern, keys };
});

function renderComponent(componentPath, data, callback) {
  ejs.renderFile(componentPath, data, (err, content) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      callback(null, content);
    }
  });
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("*", (req, res) => {
  const user = {};

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
    const data = {
      ...params,
      ...queryParams,
      ...route.data,
      user,
    };

    const isFileRequest = req.url.includes(".");
    const newData = isFileRequest ? undefined : data;

    renderComponent(componentPath, data, (err, renderedContent) => {
      if (err) {
        res.status(500).send("<h1>Erro interno do servidor</h1>");
      } else {
        let mainTemplatePath = path.join(__dirname, "views", "main.ejs");

        if (route.path === "/login") {
          mainTemplatePath = path.join(__dirname, "views", "pages/login.ejs");
        }
        if (route.path === "/register") {
          mainTemplatePath = path.join(
            __dirname,
            "views",
            "pages/register.ejs"
          );
        }
        if (route.path === "/adm-login") {
          mainTemplatePath = path.join(
            __dirname,
            "views",
            "pages/adm-login.ejs"
          );
        }

        renderComponent(
          mainTemplatePath,
          {
            content: renderedContent,
            data: newData,
            user,
          },
          (err, mainContent) => {
            if (err) {
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

axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
