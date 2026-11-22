import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { MongoClient } from 'mongodb';


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());



const client = new MongoClient(process.env.BETTER_AUTH_DB_URI);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedClient = await connectToMongoDB();
const db = connectedClient.db("pizzahub");
// Collections 
    const usersCollection = db.collection('user');
    const menuCollection = db.collection('menuItems');
    const ordersCollection = db.collection('orders');
    const favoritesCollection = db.collection('favorites');
    const transactionsCollection = db.collection('transactions');


app.get('/', (req, res) => {
  res.send('PizzaHub Server is running!');
});

// users api 

app.get('/users', async (req, res) => {
  try {
    const cursor = usersCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to fetch users' });
  }
});



app.listen(port, () => {
  console.log(`PizzaHub server running on port ${port}`);
});