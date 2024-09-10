const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

// lakshmi_hadi
// Lucky@2406

// mangodb connection


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://lakshmi_hadi:<db_password>@yoga-master.bywhm.mongodb.net/?retryWrites=true&w=majority&appName=Yoga-master";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
res.send('Hello Developers 2025!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
