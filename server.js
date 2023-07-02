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
      profileData: [
        {
          imageSrc:
            "https://img.freepik.com/free-photo/smiling-beautiful-woman-her-handsome-boyfriend-happy-cheerful-multiracial-family-having-tender-moments-grey_158538-18957.jpg?w=1380&t=st=1688154457~exp=1688155057~hmac=44e2bd4cab9e64a53a706592d049c4200894de63d31f3142a9096d0ded579a81",
          altText: "image 1",
        },
        {
          imageSrc:
            "https://img.freepik.com/free-photo/couple-love-looking-each-other-with-love-smiling-pink-wall_197531-23575.jpg?w=1380&t=st=1688154488~exp=1688155088~hmac=8811bc1382c293f29a0ada257d8a4a383888ebc5b61fc1febf5cd03a40a5b1b3",
          altText: "image 2",
        },
        {
          imageSrc:
            "https://img.freepik.com/premium-photo/abstract-dark-colorful-defocused-gradient-background_162008-66.jpg?w=1380",
          altText: "image 3",
        },
        {
          imageSrc:
            "https://img.freepik.com/free-photo/close-up-film-texture-details_23-2149368379.jpg?w=996&t=st=1688154513~exp=1688155113~hmac=cffae52f1e888be13a3bf52d5b3acd53d1333db78a20bea02d1a740927631c04",
          altText: "image 1",
        },
        {
          imageSrc:
            "https://img.freepik.com/free-photo/medium-shot-couple-posing-together_52683-91948.jpg?w=1380&t=st=1688154521~exp=1688155121~hmac=e3e0c23e1316eec652b3f57b9c87120af56aff35493567e70c1e2da61d68dd1c",
          altText: "image 2",
        },
      ],
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

// --------------------------------------------------------------------------

app.get("/data", (req, res) => {
  const imageData = [
    {
      imageSrc:
        "https://img.freepik.com/free-photo/smiling-beautiful-woman-her-handsome-boyfriend-happy-cheerful-multiracial-family-having-tender-moments-grey_158538-18957.jpg?w=1380&t=st=1688154457~exp=1688155057~hmac=44e2bd4cab9e64a53a706592d049c4200894de63d31f3142a9096d0ded579a81",
      altText: "image 1",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/couple-love-looking-each-other-with-love-smiling-pink-wall_197531-23575.jpg?w=1380&t=st=1688154488~exp=1688155088~hmac=8811bc1382c293f29a0ada257d8a4a383888ebc5b61fc1febf5cd03a40a5b1b3",
      altText: "image 2",
    },
    {
      imageSrc:
        "https://img.freepik.com/premium-photo/abstract-dark-colorful-defocused-gradient-background_162008-66.jpg?w=1380",
      altText: "image 3",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/close-up-film-texture-details_23-2149368379.jpg?w=996&t=st=1688154513~exp=1688155113~hmac=cffae52f1e888be13a3bf52d5b3acd53d1333db78a20bea02d1a740927631c04",
      altText: "image 1",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/medium-shot-couple-posing-together_52683-91948.jpg?w=1380&t=st=1688154521~exp=1688155121~hmac=e3e0c23e1316eec652b3f57b9c87120af56aff35493567e70c1e2da61d68dd1c",
      altText: "image 2",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/authentic-anamorphic-lens-flare-with-ring-ghost-effect_53876-105282.jpg?w=1380&t=st=1688154530~exp=1688155130~hmac=6570b0e3583e8814e4116eb3f51b0935bed0980b035d822626a0efd10c93dbfb",
      altText: "image 3",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/couple-enjoying-valentines-day-celebration_23-2149202991.jpg?t=st=1688154453~exp=1688155053~hmac=df84336d1ec9de205d653735f49775889ed389908e79220fb3c5386d18d8b101",
      altText: "image 2",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/valentines-day-celebration_23-2149202969.jpg?w=1380&t=st=1688154543~exp=1688155143~hmac=977f03362bce7a5b98731511cc6711cccfc38f8475bdcdcb90842dacb0ac43c2",
      altText: "image 3",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/luxury-pool-villa-spectacular-contemporary-design-digital-art-real-estate-home-house-property-ge_1258-150749.jpg?w=1380&t=st=1688154551~exp=1688155151~hmac=199bead03c937254d8e1b5343c004b50f15057767339cddbd1a28f98579e317a",
      altText: "image 1",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/dentist-doing-check-up-patient_23-2149206225.jpg?w=1380&t=st=1688154556~exp=1688155156~hmac=832697f31d328e465624c98bf24e954ba16240e83da3106d32e30784396f41a0",
      altText: "image 2",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/smiley-woman-showing-sticker-arm-after-getting-vaccine_23-2149014463.jpg?w=740&t=st=1688154562~exp=1688155162~hmac=5c67a3ed1250837dcb60c735968f8133197c9663f1edebef7bea41f1fbba17e6",
      altText: "image 3",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner_1258-54587.jpg?w=826&t=st=1688154569~exp=1688155169~hmac=266e7f4706b3b40a04f90d378c7d6ac6e97a85ab03ef960599e970859e2fe63c",
      altText: "image 2",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/foamy-beer-gold-pint-glass-generative-ai_188544-12316.jpg?w=826&t=st=1688154574~exp=1688155174~hmac=69ac088325ca99aeb96d887bcb0605709c2f2cda727a1fbf889757c04d249737",
      altText: "image 3",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/luxury-pool-villa-spectacular-contemporary-design-digital-art-real-estate-home-house-property-ge_1258-150749.jpg?w=1380&t=st=1688154551~exp=1688155151~hmac=199bead03c937254d8e1b5343c004b50f15057767339cddbd1a28f98579e317a",
      altText: "image 1",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/dentist-doing-check-up-patient_23-2149206225.jpg?w=1380&t=st=1688154556~exp=1688155156~hmac=832697f31d328e465624c98bf24e954ba16240e83da3106d32e30784396f41a0",
      altText: "image 2",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/smiley-woman-showing-sticker-arm-after-getting-vaccine_23-2149014463.jpg?w=740&t=st=1688154562~exp=1688155162~hmac=5c67a3ed1250837dcb60c735968f8133197c9663f1edebef7bea41f1fbba17e6",
      altText: "image 3",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner_1258-54587.jpg?w=826&t=st=1688154569~exp=1688155169~hmac=266e7f4706b3b40a04f90d378c7d6ac6e97a85ab03ef960599e970859e2fe63c",
      altText: "image 2",
    },
    {
      imageSrc:
        "https://img.freepik.com/free-photo/foamy-beer-gold-pint-glass-generative-ai_188544-12316.jpg?w=826&t=st=1688154574~exp=1688155174~hmac=69ac088325ca99aeb96d887bcb0605709c2f2cda727a1fbf889757c04d249737",
      altText: "image 3",
    },
  ];

  const imagesPerPage = 8; // Number of images per page
  const totalImages = imageData.length;
  const totalPages = Math.ceil(totalImages / imagesPerPage);
  const currentPage = req.query.pag || 1; // Current page (default: 1)
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;

  const images = imageData.slice(startIndex, endIndex);

  res.setHeader("Cache-Control", "no-cache");
  res.json({ images, totalPages, currentPage });
});

app.post("/request/user", (req, res) => {
  const user = {
    isLoggedIn: true,
    id: 1,
    type: 0,
    token: "asdfasfjkbbchasd",
  };

  res.setHeader("Cache-Control", "no-cache");

  res.json(user);
});

app.post("/request/logout", (req, res) => {
  const user = {
    isLoggedIn: false,
    id: 0,
    type: 0,
    token: "",
  };

  res.setHeader("Cache-Control", "no-cache");

  res.json(user);
});

/* app.get("/data/categories", (req, res) => {
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
}); */

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
