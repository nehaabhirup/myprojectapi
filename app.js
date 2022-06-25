let express = require('express');
let app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const dotenv = require('dotenv');
dotenv.config()
let port = process.env.PORT || 8230;
const mongoUrl = process.env.mongoLiveUrl;
const bodyParser = require('body-parser');
const cors = require('cors');

//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send("welcome to express")
})
// items
app.get('/item',(req,res)=>{
    db.collection('items').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//category
app.get('/category',(req,res)=>{
    db.collection('category').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//with id
app.get('/category/:id',(req,res) => {
    let categoryId = Number(req.params.id);
    db.collection('category').find({category_id:categoryId}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//list
app.get('/list',(req,res)=>{
    db.collection('list').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//list wrt id
app.get('/list/:id',(req,res)=>{
    let id = Number(req.params.id);
    db.collection('list').find({product_id:id}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
//details of item selected
app.get('/details/:id',(req,res)=>{
    let prodId = Number(req.params.id);
    db.collection('list').find({prod_id:prodId}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
app.get('/viewDetails',(req,res) => {
    let prodId = Number(req.query.prod_id);
    let query = {};
    if(prodId){
        query = {prod_id:prodId}
    }
    db.collection('list').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})
// details of items on basis of id
app.post('/listItem',(req,res) => {
    console.log(req.body);
    if(Array.isArray(req.body)){
        db.collection('list').find({product_id:{$in:req.body}}).toArray((err,result) => {
            if(err) throw err;
            res.send(result)
        })
    }else{
        res.send('Invalid Input')
    }
})
app.post('/productItem',(req,res) => {
    console.log(req.body);
    if(Array.isArray(req.body)){
        db.collection('items').find({list_Id:{$in:req.body}}).toArray((err,result) => {
            if(err) throw err;
            res.send(result)
        })
    }else{
        res.send('Invalid Input')
    }
})
//place order
app.post('/placeOrder',(req,res) => {
    db.collection('orders').insertOne(req.body,(err,result) => {
        if(err) throw err;
        res.send('Order Placed')
    })
})

// View Order
app.get('/viewOrder',(req,res) => {
    let email = req.query.email;
    let query = {};
    if(email){
        query = {"email":email}
    }
    db.collection('orders').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// delete order
app.delete('/deleteOrders',(req,res)=>{
    db.collection('orders').remove({},(err,result) => {
        res.send('order deleted')
    })
})

//Update orders
app.put('/updateOrder/:id',(req,res) => {
    let oId = mongo.ObjectId(req.params.id);
    db.collection('orders').updateOne(
        {_id:oId},
        {$set:{
            "cost":req.body.cost,
            "phone":req.body.phone
        }},(err,result) => {
            if(err) throw err
            res.send(`Cost Updated to ${req.body.cost}`)
        }
    )
})

//Connection with mongodb
MongoClient.connect(mongoUrl, (err,client) =>{
    if(err) console.log(`Error while connecting`);
    db = client.db('second_project');
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
    })
})