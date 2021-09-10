const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hooq3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db(process.env.DB_NAME).collection("our-service");
    const bookingCollection = client.db(process.env.DB_NAME).collection("booking-service");

    app.post('/addService', (req, res) => {
      serviceCollection.insertOne(req.body)
      .then(result => {
        res.send(result.acknowledged)
      })
    });

    app.get('/getService', (req, res) => {
      serviceCollection.find()
      .toArray((err, docs) => {
        res.send(docs)
      })
    });

    app.get('/bookService/:id', (req, res) => {
      serviceCollection.find({_id: ObjectId(req.params.id)})
      .toArray((err, docs) => {
        res.send(docs[0])
      })
    })

    app.post('/booking-service', (req, res) => {
      bookingCollection.insertOne(req.body)
      .then(result => {
        res.send(result);
      })
    });
    app.get('/all-booking', (req, res) => {
      bookingCollection.find()
      .toArray((err, docs)=>{
          res.send(docs);
      })
    })

});

app.get('/', function (req, res) {
    res.send('bd-service is working')
  })
  
app.listen(process.env.PORT || 5000)
