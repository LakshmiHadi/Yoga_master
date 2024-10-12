const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json())

// mangodb connection


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = 'mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@yoga-master.bywhm.mongodb.net/?retryWrites=true&w=majority&appName=Yoga-master';

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

    // create a database and collection
    const database = client.db("Yoga_master");
    const userCollection = database.collection("users");
    const classesCollection = database.collection("classes");
    const cartCollection = database.collection("cart");
    const paymentCollection = database.collection("payments");
    const enrolledCollection = database.collection("enrolled");
    const applicationCollection = database.collection("applied");


    // classes routes here
    app.post('/new-class', async (req, res) => {
      const newClass = req.body;
      // newclass.availableSeats = parseInt(newclass.availableSeats); 
      const result = await classesCollection.insertOne(newClass);
      res.send(result);
    })

    app.get('/classes', async(req, res) => {
      const query = { status: 'approved' };
      const result = await classesCollection.find().toArray();
      res.send(result);
    })

    // get classes by instructor email address
    app.get('/classes/:email', async(req, res) => {
      const email = req.params.email;
      const query = {instructorEmail: email};
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/classes-manage',async(req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
    })


    // update classes status and reason
    app.patch('/change-status', async(req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const reason = req.body.reason;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status,
          reason: reason,
        },
      };
      const result = await cartCollection.updateOne(filter, updateDoc, options);
      res.send(result);

    })

    // get approved  classes
    app.get('approved-classes',async(req, res) => {
    const query = { status: "approved"};
    const result = await classesCollection.find(query).toArray();
    res.send(result);
    })

    //get single classes details
    app.get('class/:id',async(req, res) => {
      const id = req.params.id;
      const query ={_id: new ObjectId(id)};
      const result = await classesCollection.findOne(query);
      res.send(result);
    })

    // update class details (all data)
    app.put('/update-class/:id', async (req, res) => {
      const id = req.params.id;
      const updateClass = req.body;
      const filter = {_id: new ObjectId(id)};
      const options ={ upsert: ture };
      const updateDoc = {
        $set: {
          name: updateClass.name,
          decription: updateClass.decription,
          price: updateClass.price,
          availableSeats: parseInt(updateClass.availableSeats),
          vedioLink: updateClass.vedioLink,
          status: 'pending',
        }
      };
      const result = await classesCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // cart routes !----
    app.post('/add-to-cart',async(req, res) => {
      const newCartItem = req.body;
      const result = await cartCollection.insertOne(newCartItem);
      res.send(result);
    });

    // get cart item by id  
    app.get('/cart-item/:id',async (req, res) => {
      const id = req.params.id;
      const email = req.body.email;
      const query ={
        classId: id,
        userMail: email
      };
      const projection = {classId: 1};
      const result = await cartCollection.findOne(query, {projection: projection});
      res.send(result);
    });

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
res.send("Hello Developers 2025!")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
