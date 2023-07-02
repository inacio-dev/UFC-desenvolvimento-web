var express = require('express');
var router  = express.Router();
const fs = require("fs")
// const bodyParser = require("body-parser");
const { MongoClient } = require('mongodb');


server = express()
// server.use(bodyParser.json());
server.use(express.json({limit: '5mb'}));

// server.use(bodyParser.urlencoded({ extended: true }));
server.listen(3002)

const database_name = 'Cadeira-Web'
const db_collection_name = 'teste'
// const uri = "mongodb://localhost:27017";
const uri = "mongodb://0.0.0.0:27017";

const client = new MongoClient(uri);
// var item = {}
async function post_publication(body ,   pub_by_id  ){
    try {
        await client.connect();
        const db = client.db(database);
        var collection = db.collection("publication");

        //Inserir Publicação no Banco de Dados :
        collection.insertOne(body , (err, result) => {
            if (err) {
              console.error('Erro ao salvar documento:', err);
              return;
            }
            console.log('Documento salvo com sucesso:', result);
        });

        //Atualiza a lista de Publicações do usuário :
        var collection = db.collection('publications_of_account');

        // Define o filtro para encontrar o documento a ser atualizado
        var filtro = { "pub_by_id": body["pub_by_id"] };
        const concatenatedArray = await collection.findOne(filtro).concat([body["publication_id"]]);

        // Define as atualizações a serem aplicadas no documento
        // const atualizacoes = { $set: { nome: 'Novo Nome', idade: 25 } };

        // Atualiza o documento na coleção
        collection.updateOne(filtro, concatenatedArray , (err, result) => {
          if (err) {
            console.error('Erro ao atualizar documento:', err);
            return;
          }

          console.log('Documento atualizado com sucesso:', result);
        });
        // var item = await collection.findOne({item_key_name : item_id });
        
        console.log("Item achado na db : "   );
        console.log(item)
        return item
    } finally {
        // Close the database connection when finished or an error occurs
        await client.close();
    }
}
async function find_item(item_id ,item_key_name , database , db_collection){
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection(db_collection);

    // Find the first document in the collection
    // var item = await collection.findOne({"_id": item_id });
    var item = await collection.findOne({item_key_name : item_id });
    
    console.log("Item achado na db : "   );
    console.log(item)
    return item
  } finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }

}
async function run() {
  try {
    await client.connect();
    const db = client.db('Cadeira-Web');
    const collection = db.collection('teste');

    // Find the first document in the collection
    const first = await collection.findOne({"_id": 55});
    console.log(first);
  } finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }
}
run().catch(console.error);


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
server.get('/',(req , res)=>{
  console.log("Teste do get tela inicial");
  return res.json({message:"Eu consigo renornar coisas do Back-End !!"})
})
// server.get('/teste',(req , res)=>{
//   console.log("Teste do get rodou");
//   return res.json({message:"Essa é a mensagem de teste do Back-End !!"})
// })
server.get('/image',async (req , res)=>{
  const body = req.body
  const item = await find_item(body["_id"] , "publication_id" , database_name , "publication")
  console.log("se eu consigo devolver o conteúdo de id : " + body["_id"] )
  console.log(item)
  return res.json( item )
  
})
server.get('/account',async (req , res)=>{
  const body = req.body
  const item = await find_item(body["_id"] , "nick_name" , database_name , "account" )
  console.log("se eu consigo devolver o conteúdo de id : " + body["_id"] )
  console.log(item)
  return res.json( item )
  
})
server.get('/account_publications',async (req , res)=>{
  const body = req.body
  const item = await find_item(body["_id"] , "account_id" , database_name , "publications_of_account" )
  console.log("se eu consigo devolver o conteúdo de id : " + body["_id"] )
  console.log(item)
  return res.json( item )
  
})
server.get('/img_by_category',async (req , res)=>{
  const body = req.body
  const item = await find_item(body["_id"] , "tag" , database_name , "Categories" )
  console.log("se eu consigo devolver o conteúdo de id : " + body["_id"] )
  console.log(item)
  return res.json( item )
  
})
server.post('/publish_img',(req , res)=>{
  const body = req.body["content"]
  const nick_name_value = req.body["nick_name"]
  const acc_pub_id = await find_item(nick_name_value ,"nick_name" , database_name , "account")["pub_by_id"]
  await post_publication( body , acc_pub_id)
  console.log("tentativa de upload do elemento de id : " + body["_id"] );
  try
  return res.json({message:"Essa é a mensagem de teste do Back-End do return image !!" + body["_id"] })
})
server.post('/cadastro',(req , res)=>{
  console.log("Teste do cadastro rodou");
  return res.json({message:"cadastrado com sucesso Back-End !!"})
})
server.get('/login',(req , res)=>{
  console.log("Teste do get rodou");
  return res.json({message:"Essa é a mensagem de teste do Back-End !!"})
})
server.get('/logout',(req , res)=>{
  console.log("Teste do get rodou");
  return res.json({message:"Essa é a mensagem de teste do Back-End !!"})
})
// connectToMongoDB();

module.exports = router;

console.log("Hello world")

// const routes = [
//   { path: "/", component: "pages/index", data: { imageData: {} } },
//   {
//     path: "/categories",
//     component: "pages/categories",
//     data: { categoriesData: {} },
//   },
//   { path: "/search", component: "pages/search", data: {} },
//   { path: "/publish", component: "pages/publish", data: {} },
//   {
//     path: "/profile/:id",
//     component: "pages/profile",
//     data: {
//       profileData: {},
//     },
//   },
//   { path: "/login", component: "pages/login", data: {} },
//   { path: "/register", component: "pages/register", data: {} },
//   { path: "/adm-login", component: "pages/adm-login", data: {} },
// ];


// const routeMatchers = routes.map((route) => {
//   const keys = [];
//   const pattern = pathToRegexp(route.path, keys);
//   return { route, pattern, keys };
// });

