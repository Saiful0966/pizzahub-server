import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';


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
    throw err;
  }
}

const connectedClient = await connectToMongoDB();
const db = connectedClient.db("pizzahub");
// Collections 
    const usersCollection = db.collection('user');
    const menuCollection = db.collection('menuitems');
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



// GET Menu Items API
app.get('/menuitems', async (req, res) => {
  try {
    const cursor = menuCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to fetch menu items'
    });
  }
});

// POST Menu Item API
app.post('/menuitems', async (req, res) => {
  try {
    const menuItem = req.body;

    const result = await menuCollection.insertOne({
      ...menuItem,
      price: Number(menuItem.price),
      createdAt: new Date()
    });

    res.status(201).send({
      success: true,
      message: 'Menu item added successfully',
      insertedId: result.insertedId
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to add menu item'
    });
  }
}); 

//  Details page api 

app.get('/menuitems/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await menuCollection.findOne(query);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to fetch menu item'
    });
  }
});


// order api 

// GET Orders API (Admin, Vendor, Customer)
app.get('/orders', async (req, res) => {
  try {
    const { role, email } = req.query;
    const query = {};

    const normalizedRole = role ? String(role).trim().toLowerCase() : '';
    const normalizedEmail = email ? String(email).trim().toLowerCase() : '';

    if (normalizedRole === 'customer' && normalizedEmail) {
      // Customer 
      query.customerEmail = normalizedEmail;
    } else if (normalizedRole === 'vendor' && normalizedEmail) {
      // Vendor 
      query['items.vendorEmail'] = normalizedEmail;
    }
    // normalizedRole === 'admin' হলে query ফাঁকা ({}) থাকবে, ফলে সব অর্ডার দেখাবে

    const cursor = ordersCollection.find(query).sort({ createdAt: -1 });
    const result = await cursor.toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to fetch orders'
    });
  }
});


// POST Order API
app.post('/orders', async (req, res) => {
  try {
    const order = req.body;
    const role = String(order.customerRole || order.role || 'customer')
      .trim()
      .toLowerCase();

    // Admin and Vendor Are Not Allowed to Place Orders
    if (role === 'admin' || role === 'vendor') {
      return res.status(403).send({
        success: false,
        message: 'Admins and vendors are not allowed to place orders'
      });
    }

    const result = await ordersCollection.insertOne({
      ...order,
      customerRole: role,
      customerEmail: order.customerEmail
        ? String(order.customerEmail).trim().toLowerCase()
        : null,
      totalAmount: Number(order.totalAmount || 0),
      status: order.status || 'pending',
      createdAt: new Date()
    });

    res.status(201).send({
      success: true,
      message: 'Order placed successfully',
      insertedId: result.insertedId
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to place order'
    });
  }
});







app.listen(port, () => {
  console.log(`PizzaHub server running on port ${port}`);
});