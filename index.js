const express = require('express')
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const cors = require('cors')
require('dotenv').config();

/* ============= start middleware =============== */
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://manufacturer:50zgGxvdsYPeOnOk@cluster0.fpbxva8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
/* ====================== Token Verify =================  */
function Verify(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ massage: 'UnAuthorization Access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, "c01029fc9d3b347a82c7f2db0024aa57fca487cac10a61f3d6499045f3243cab585ead26022ae2b503987480cb0e1173931a9f1e96260fa33f0914e60fda76da", function (err, decoded) {
        if(err){
            return res.status(401).send({ massage: 'UnAuthorization Access' })
        }
        req.decoded=decoded
        next()
    });
}
async function run() {
    try {
        await client.connect();
        const collectionServices = client.db("Manufacturer").collection("services");//services
        const collectionReview = client.db("Manufacturer").collection("review");//review
        const collectionUser = client.db("Manufacturer").collection("user");//user
        const collectionMyProfile = client.db("Manufacturer").collection("myProfile");//review
        /* ========================********************** start services =====================***********************/
        app.post('/services', async (req, res) => {
            const data = req.body;
            const result = await collectionServices.insertOne(data);
            res.send(result)
        })

        app.get('/service', async (req, res) => {
            // http://localhost:5000/service
            const data = {};
            const result = await collectionServices.find(data).toArray();
            res.send(result)
        })

        /* ========================********************** end services =====================***********************/
        /* ========================********************** start add Review =====================***********************/
        app.post('/review', async (req, res) => {
            const data = req.body;
            const result = await collectionReview.insertOne(data);
            res.send(result)
        })
        app.get('/review',Verify,async (req, res) => {
            //http://localhost:5000/review
            const data = {};
            const result = await collectionReview.find(data).limit(6).toArray();
            res.send(result)
        })
        /* ========================********************** end Review  Review =====================***********************/
        /* ========================********************** Start User and Token   =====================***********************/
        app.put('/email/:id', async (req, res) => {
            const email = req.params.id;
            const filter = { email: email }
            const user = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await collectionUser.updateOne(filter, updateDoc, options);
            const Token = jwt.sign({ email: email }, "c01029fc9d3b347a82c7f2db0024aa57fca487cac10a61f3d6499045f3243cab585ead26022ae2b503987480cb0e1173931a9f1e96260fa33f0914e60fda76da");
            res.send({ result, Token })
        })
        app.get('/email',async (req, res) => {
            //http://localhost:5000/email
            const data = {};
            const result = await collectionUser.find(data).toArray();
            res.send(result)
        })
        app.put('/email/admin/:id',async (req, res) => {
            const email = req.params.id;
            const filter={email:email}
            // const result = await collectionUser.findOne(query);
            const options = { upsert: true };
            const updateDoc = {
                $set: {Admin:'role'},
            };
            const result = await collectionUser.updateOne(filter, updateDoc, options);
            console.log(result)
            // res.send(result)
        })
        /* ========================********************** end User and Token =====================***********************/
        /* ========================********************** start MyProfile =====================***********************/
        app.post('/myProfile', async (req, res) => {
            const data = req.body;
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