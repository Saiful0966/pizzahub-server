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



app.get('/', (req, res) => {
  res.send('PizzaHub Server is running!');
});

app.listen(port, () => {
  console.log(`PizzaHub server running on port ${port}`);
});