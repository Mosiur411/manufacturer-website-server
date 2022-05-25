const express = require('express')
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId, ServerDescriptionChangedEvent } = require('mongodb');
const jwt = require('jsonwebtoken');
const cors = require('cors')
require('dotenv').config();

/* ============= start middleware =============== */
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fpbxva8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
/* ====================== Token Verify =================  */
function Verify(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ massage: 'UnAuthorization Access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).send({ massage: 'UnAuthorization Access' })
        }
        req.decoded = decoded
        next()
    });
}
async function run() {
    try {
        await client.connect();
        const collectionServices = client.db("Manufacturer").collection("services");//services
        const collectionReview = client.db("Manufacturer").collection("review");//review
        const collectionUser = client.db("Manufacturer").collection("user");//user
        const collectionOrder = client.db("Manufacturer").collection("order");//order
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
        app.delete('/service/delete/:id', async (req, res) => {
            const ProductId = req.params.id;
            const id = { _id: ObjectId(ProductId) }
            const result = await collectionServices.deleteOne(id);
            res.send(result)
        })
        /* =============order payment  ===============  */
        app.get('/service/:id', async (req, res) => {
            const data = req.params.id;
            const id = { _id: ObjectId(data) }
            const result = await collectionServices.findOne(id);
            res.send(result)
        })
        app.put('/service/Update/:id', async (req, res) => {
            const data = req.params.id;
            const id = { _id: ObjectId(data) }
            const filter = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: filter,
            };
            const result = await collectionServices.updateOne(id, updateDoc, options);
            res.send(result)
        })
        /* ========================********************** end services =====================***********************/
        /* ========================********************** start add Order =====================***********************/
        app.post('/service/order', async (req, res) => {
            const data = req.body;
            const result = await collectionOrder.insertOne(data);
            res.send(result)
        })
        app.get('/service/order/user/:id', async (req, res) => {
            const data = req.params.id;
            const filter ={email:data}
            const result = await collectionOrder.find(filter).toArray();
            res.send(result)
        })
        app.get('/service/order/payment/:id', async (req, res) => {
            const data = req.params.id;
            const id = { _id: ObjectId(data) }
            const result = await collectionOrder.find(id).toArray();
            console.log(result)
            res.send(result)
        })

        /* ========================********************** start add Order =====================***********************/
        /* ========================********************** start add Review =====================***********************/
        app.post('/review', async (req, res) => {
            const data = req.body;
            const result = await collectionReview.insertOne(data);
            res.send(result)
        })
        app.get('/review', async (req, res) => {
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
            const Token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET);
            res.send({ result, Token })
        })
        app.get('/email', async (req, res) => {
            //http://localhost:5000/email
            const data = {};
            const result = await collectionUser.find(data).toArray();
            res.send(result)
        })
        app.put('/email/admin/:id', async (req, res) => {
            const email = req.params.id;
            const filter = { email: email }
            const options = { upsert: true };
            const updateDoc = {
                $set: { Admin: 'role' },
            };
            const result = await collectionUser.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        app.get('/email/admin/:email', async (req, res) => {
            const email = req.params.email;
            const userEmail = { email: email };
            const result = await collectionUser.findOne(userEmail);
            if (result.Admin) {
                res.send(result)
            } else {
                const userEmail = {};
                const result = await collectionUser.find(userEmail).toArray();
                res.send(result)
            }
        })
        /* ========================********************** end User and Token =====================***********************/
        /* ========================********************** start MyProfile =====================***********************/
        app.put('/email/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email }
            const options = { upsert: true };
            const updateDoc = {
                $set: { user: user },
            };
            const result = await collectionUser.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        app.get('/email/MyProfile/:email', async (req, res) => {
            const email = req.params.email;
            const userEmail = { email: email };
            const result = await collectionUser.findOne(userEmail);
            res.send(result.user)
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