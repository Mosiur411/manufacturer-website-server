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
        const collection = client.db("Manufacturer").collection("services");
        /* ========================********************** start services =====================***********************/
        app.post('/services',async(req,res)=>{
            const data =req.body;
            const result = await collection.insertOne(data);
            res.send(result)
        })
        
        app.get('/service',async(req,res)=>{
            // http://localhost:5000/service
            const data ={};
            const result = await collection.find(data).toArray();
            res.send(result)
        })

        /* ========================********************** end services =====================***********************/
  

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