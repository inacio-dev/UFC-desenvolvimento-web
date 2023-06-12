const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const { pathToRegexp } = require("path-to-regexp");
const session = require("express-session");
const axios = require("axios");

const app = express();

const routes = [
  { path: "/", component: "pages/index", data: { imageData: {} } },
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
      profileData: {},
    },
  },
  { path: "/login", component: "pages/login", data: {} },
  { path: "/register", component: "pages/register", data: {} },
  { path: "/adm-login", component: "pages/adm-login", data: {} },
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

// --------------------------------------------------------------------------

app.get("/data", (req, res) => {
  const imageData = [
    { imageSrc: "/images/test-image.jpg", altText: "image 1" },
    { imageSrc: "/images/test-image.jpg", altText: "image 2" },
    { imageSrc: "/images/test-image.jpg", altText: "image 3" },
    { imageSrc: "/images/test-image.jpg", altText: "image 1" },
    { imageSrc: "/images/test-image.jpg", altText: "image 2" },
    { imageSrc: "/images/test-image.jpg", altText: "image 3" },
    { imageSrc: "/images/test-image.jpg", altText: "image 2" },
    { imageSrc: "/images/test-image.jpg", altText: "image 3" },
    { imageSrc: "/images/test-image.jpg", altText: "image 1" },
    { imageSrc: "/images/test-image.jpg", altText: "image 2" },
    { imageSrc: "/images/test-image.jpg", altText: "image 3" },
    { imageSrc: "/images/test-image.jpg", altText: "image 2" },
    { imageSrc: "/images/test-image.jpg", altText: "image 3" },
  ];

  res.setHeader("Cache-Control", "no-cache");

  res.json(imageData);
});

app.get("/data/categories", (req, res) => {
  const data = [
    {
      imageSrc: "/images/test-image.jpg",
      altText: "image 1",
      name: "Wallpaper",
    },
    {
      imageSrc: "/images/test-image.jpg",
      altText: "image 1",
      name: "Titles",
    },
    {
      imageSrc: "/images/test-image.jpg",
      altText: "image 1",
      name: "Designs",
    },
  ];

  res.setHeader("Cache-Control", "no-cache");

  res.json(data);
});

app.get("/data/profile", (req, res) => {
  const type = req.headers["type"];

  let data = {};

  if (type === "0") {
    data = {
      username: "Usuário Padrão",
      description:
        "Description lorem ipsum dolor sit amet, consectetur adipiscing elit.Sed vitae viverra felis. Vestibulum vitae felis urna. Mauris id sollicitudin nisi. Nulla varius arcu nisi.",
      images: [
        {
          imageSrc: "/images/test-image.jpg",
          altText: "image 1",
        },
        {
          imageSrc: "/images/test-image.jpg",
          altText: "image 1",
        },
        {
          imageSrc: "/images/test-image.jpg",
          altText: "image 1",
        },
      ],
    };
  } else if (type === "1") {
    data = {
      username: "Empresa",
      description:
        "Description lorem ipsum dolor sit amet, consectetur adipiscing elit.Sed vitae viverra felis. Vestibulum vitae felis urna. Mauris id sollicitudin nisi. Nulla varius arcu nisi.",
      images: [
        {
          imageSrc: "/images/test-image.jpg",
          altText: "image 1",
        },
      ],
    };
  }

  res.setHeader("Cache-Control", "no-cache");

  res.json(data);
});

// --------------------------------------------------------------------------

app.post("/ejs/updateImageData", (req, res) => {
  const { imageData } = req.body;

  routes.forEach((route) => {
    if (route.data && route.data.hasOwnProperty("imageData")) {
      route.data.imageData = imageData;
    }
  });

  res.sendStatus(200);
});

app.post("/ejs/updateCategoriesData", (req, res) => {
  const { categoriesData } = req.body;

  routes.forEach((route) => {
    if (route.data && route.data.hasOwnProperty("categoriesData")) {
      route.data.categoriesData = categoriesData;
    }
  });

  res.sendStatus(200);
});

app.post("/ejs/updateProfileData", (req, res) => {
  const { profileData } = req.body;

  routes.forEach((route) => {
    if (route.data && route.data.hasOwnProperty("profileData")) {
      route.data.profileData = profileData;
    }
  });

  res.sendStatus(200);
});

app.get("*", (req, res) => {
  const user = {
    isLoggedIn: 
    // false, 
    true,
    id: 1,
    type: 0,
  };

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

        if (route.path === "/publish") {
          if (!user.isLoggedIn || user.type !== 0) {
            return res.redirect("/");
          }
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
