const express = require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const bodyParser=require('body-parser');
const secrets=require('./secrets');

const app = express();

app.use(cors());

const port = process.env.PORT || 5000;

app.use(bodyParser.json());


const MONGO_URI=`mongodb+srv://${secrets.user}:${secrets.password}@basicdb.4nvfs.mongodb.net/${secrets.dbname}?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI, { 
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true 
}).then(() => console.log('Mongo Database connected')).catch((err) => console.log(err))

const Item=require('./models/Item');

app.post('/',async(req,res) => {
  console.log('Endpoint hit');
  const items=req.body.items;
  console.log('Items are',items);
  try {
    await Item.insertMany(items);
    res.send('Done');
  }
  catch(err) {
    console.log('Error is',err);
    res.send('Error');
  }
})

app.get('/:date',async(req,res) => {
  const date=req.params.date
  try {
    const items=await Item.find({date});
    res.json(items);
  }
  catch(err) {
    console.log('Error',err);
    res.send('Error');
  }
})

app.get('/month/:month',async(req,res) => {
  const month=req.params.month;
  //console.log('Asking for month',month);
  try {
    const items=await Item.find({month});
    res.json(items);
  }
  catch(err) {
    console.log('Error',err);
    res.send('Error');
  }
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})