const express = require('express')
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
require('dotenv').config()

/* ============= start middleware =============== */
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://manufacturer:50zgGxvdsYPeOnOk@cluster0.fpbxva8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const collectionServices = client.db("Manufacturer").collection("services");//services
        const collectionReview = client.db("Manufacturer").collection("review");//review
        const collectionUser = client.db("Manufacturer").collection("user");//user
        const collectionMyProfile = client.db("Manufacturer").collection("myProfile");//review
        /* ========================********************** start services =====================***********************/
        app.post('/services',async(req,res)=>{
            const data =req.body;
            const result = await collectionServices.insertOne(data);
            res.send(result)
        })
        
        app.get('/service',async(req,res)=>{
            // http://localhost:5000/service
            const data ={};
            const result = await collectionServices.find(data).toArray();
            res.send(result)
        })

        /* ========================********************** end services =====================***********************/
        /* ========================********************** start add Review =====================***********************/
         app.post('/review',async(req,res)=>{
            const data =req.body;
            const result = await collectionReview.insertOne(data);
            res.send(result)
        })
        app.get('/review',async(req,res)=>{
            //http://localhost:5000/review
            const data ={};
            const result = await collectionReview.find(data).limit(6).toArray();
            res.send(result)
        })
        /* ========================********************** end Review  Review =====================***********************/
        /* ========================********************** Start User and Token   =====================***********************/
        app.put('/email/:id',async(req,res)=>{
            const email = req.params.id;
            const filter={email:email}
            const user =req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set:user,
              };
            const result = await collectionUser.updateOne(filter, updateDoc, options);
            res.send(result)

        })








        /* ========================********************** end User and Token =====================***********************/
        /* ========================********************** start MyProfile =====================***********************/
        app.post('/myProfile',async(req,res)=>{
            const data =req.body;
            const result = await collectionReview.insertOne(data);
            res.send(result)
        })
        /* ========================********************** end MyProfile =====================***********************/
  

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})