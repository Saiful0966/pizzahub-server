// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config'
// import { MongoClient } from 'mongodb';
// import { ObjectId } from 'mongodb';


// const app = express();
// const port = process.env.PORT || 5000;

// // middleware
// app.use(express.json());
// app.use(cors());



// const client = new MongoClient(process.env.BETTER_AUTH_DB_URI);
// export async function connectToMongoDB() {
//   try {
//     await client.connect();
//     console.log("You successfully connected to MongoDB!");
//     return client;
//   } catch (err) {
//     console.dir(err);
//     throw err;
//   }
// }

// const connectedClient = await connectToMongoDB();
// const db = connectedClient.db("pizzahub");
// // Collections 
//     const usersCollection = db.collection('user');
//     const menuCollection = db.collection('menuitems');
//     const ordersCollection = db.collection('orders');
//     const favoritesCollection = db.collection('favorites');
//     const transactionsCollection = db.collection('transactions');


// app.get('/', (req, res) => {
//   res.send('PizzaHub Server is running!');
// });

// // users api 

// app.get('/users', async (req, res) => {
//   try {
//     const cursor = usersCollection.find({});
//     const result = await cursor.toArray();
//     res.send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: 'Failed to fetch users' });
//   }
// });


// // PATCH User Profile API (Update by email or id)
// app.patch('/users', async (req, res) => {
//   try {
//     const { email, name, phone, address, image } = req.body || {};
//     const normalizedEmail = email ? String(email).trim().toLowerCase() : '';

//     if (!normalizedEmail) {
//       return res.status(400).send({
//         success: false,
//         message: 'Email is required to update profile',
//       });
//     }

//     const updateFields = {
//       updatedAt: new Date(),
//     };

//     if (typeof name === 'string') updateFields.name = name.trim();
//     if (typeof phone === 'string') updateFields.phone = phone.trim();
//     if (typeof address === 'string') updateFields.address = address.trim();
//     if (typeof image === 'string') updateFields.image = image;

//     const result = await usersCollection.updateOne(
//       { email: normalizedEmail },
//       { $set: updateFields },
//       { upsert: true }
//     );

//     res.send({
//       success: true,
//       message: 'Profile updated in database',
//       matchedCount: result.matchedCount,
//       modifiedCount: result.modifiedCount,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       success: false,
//       message: 'Failed to update user profile',
//     });
//   }
// });

// app.patch('/users/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).send({ message: 'Invalid user ID' });
//     }

//     const { name, phone, address, image } = req.body || {};
//     const updateFields = {
//       updatedAt: new Date(),
//     };

//     if (typeof name === 'string') updateFields.name = name.trim();
//     if (typeof phone === 'string') updateFields.phone = phone.trim();
//     if (typeof address === 'string') updateFields.address = address.trim();
//     if (typeof image === 'string') updateFields.image = image;

//     const result = await usersCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: updateFields }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).send({ message: 'User not found' });
//     }

//     res.send({
//       success: true,
//       message: 'Profile updated successfully',
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: 'Failed to update profile' });
//   }
// });






// // GET Menu Items API
// app.get('/menuitems', async (req, res) => {
//   try {
//     const cursor = menuCollection.find({});
//     const result = await cursor.toArray();
//     res.send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       message: 'Failed to fetch menu items'
//     });
//   }
// });

// // POST Menu Item API
// app.post('/menuitems', async (req, res) => {
//   try {
//     const menuItem = req.body;

//     const result = await menuCollection.insertOne({
//       ...menuItem,
//       price: Number(menuItem.price),
//       createdAt: new Date()
//     });

//     res.status(201).send({
//       success: true,
//       message: 'Menu item added successfully',
//       insertedId: result.insertedId
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       message: 'Failed to add menu item'
//     });
//   }
// }); 

// //  Details page api 

// app.get('/menuitems/:id', async (req, res) => {
//   try {
//     const query = { _id: new ObjectId(req.params.id) };
//     const result = await menuCollection.findOne(query);
//     res.send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       message: 'Failed to fetch menu item'
//     });
//   }
// });


// // order api 

// // GET Orders API
// app.get('/orders', async (req, res) => {
//   try {
//     const { role, email } = req.query;
//     const query = {};

//     const normalizedRole = role ? String(role).trim().toLowerCase() : '';
//     const normalizedEmail = email ? String(email).trim().toLowerCase() : '';

//     if (normalizedRole === 'customer' && normalizedEmail) {
//       // Customers Can Only View Their Own Orders
//       query.customerEmail = normalizedEmail;
//     }
//     // Show All Customer Orders for Vendors and Admins

//     const cursor = ordersCollection.find(query).sort({ createdAt: -1 });
//     const result = await cursor.toArray();
//     res.send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       message: 'Failed to fetch orders'
//     });
//   }
// });


// // POST Order API
// app.post('/orders', async (req, res) => {
//   try {
//     const order = req.body;
//     const role = String(order.customerRole || order.role || 'customer')
//       .trim()
//       .toLowerCase();

//     // Admin and Vendor Are Not Allowed to Place Orders
//     if (role === 'admin' || role === 'vendor') {
//       return res.status(403).send({
//         success: false,
//         message: 'Admins and vendors are not allowed to place orders'
//       });
//     }

//     const result = await ordersCollection.insertOne({
//       ...order,
//       customerRole: role,
//       customerEmail: order.customerEmail
//         ? String(order.customerEmail).trim().toLowerCase()
//         : null,
//       totalAmount: Number(order.totalAmount || 0),
//       status: order.status || 'pending',
//       createdAt: new Date()
//     });

//     res.status(201).send({
//       success: true,
//       message: 'Order placed successfully',
//       insertedId: result.insertedId
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       message: 'Failed to place order'
//     });
//   }
// });

//   //  patch order api 

// // API to Update Order Status (Pending, Accepted, Delivered) by Vendor/Admin
// app.patch("/orders/:id/status", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!ObjectId.isValid(id)) {
//       return res.status(400).send({ message: "Invalid order ID" });
//     }

//     const allowedStatuses = ["Pending", "Accepted", "Delivered"];
//     const matchedStatus = allowedStatuses.find(
//       (s) => s.toLowerCase() === String(status || "").trim().toLowerCase()
//     );

//     if (!matchedStatus) {
//       return res.status(400).send({
//         message: "Status must be Pending, Accepted, or Delivered",
//       });
//     }

//     const result = await ordersCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { status: matchedStatus, updatedAt: new Date() } }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).send({ message: "Order not found" });
//     }

//     res.send({
//       success: true,
//       message: "Order status updated",
//       status: matchedStatus,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: "Failed to update order status" });
//   }
// });



// // ================= FAVORITES API =================

// // GET Favorites API
// app.get('/favorites', async (req, res) => {
//   try {
//     const email = req.query.email
//       ? String(req.query.email).trim().toLowerCase()
//       : '';

//     const query = email ? { userEmail: email } : {};
//     const result = await favoritesCollection
//       .find(query)
//       .sort({ createdAt: -1 })
//       .toArray();

//     res.send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       message: 'Failed to fetch favorites',
//     });
//   }
// });

// // POST Favorite API (Add to Favorites)
// app.post('/favorites', async (req, res) => {
//   try {
//     const body = req.body || {};
//     const userEmail = body.userEmail || body.email
//       ? String(body.userEmail || body.email).trim().toLowerCase()
//       : '';

//     const itemId = String(
//       body.itemId || body.menuItemId || body._id || body.id || ''
//     ).trim();

//     if (!itemId) {
//       return res.status(400).send({
//         success: false,
//         message: 'itemId is required',
//       });
//     }

//     const duplicateQuery = userEmail
//       ? { userEmail, itemId }
//       : { itemId };

//     const existing = await favoritesCollection.findOne(duplicateQuery);
//     if (existing) {
//       return res.status(200).send({
//         success: true,
//         alreadyExists: true,
//         message: 'Already in favorites',
//         favorite: existing,
//       });
//     }

//     const newFavorite = {
//       userEmail: userEmail || null,
//       itemId,
//       name: body.name || body.title || 'Pizza',
//       title: body.title || body.name || 'Pizza',
//       category: body.category || 'Pizza',
//       price: Number(body.price || 0),
//       oldPrice:
//         typeof body.oldPrice === 'number' ? Number(body.oldPrice) : undefined,
//       rating: typeof body.rating === 'number' ? Number(body.rating) : 4.6,
//       reviewsCount:
//         typeof body.reviewsCount === 'number'
//           ? Number(body.reviewsCount)
//           : 95,
//       deliveryTime: body.deliveryTime || '30-40 min',
//       deliveryText: body.deliveryText || 'Free Delivery',
//       image: body.image || '',
//       createdAt: new Date(),
//     };

//     const result = await favoritesCollection.insertOne(newFavorite);

//     res.status(201).send({
//       success: true,
//       message: 'Added to favorites',
//       insertedId: result.insertedId,
//       favorite: { ...newFavorite, _id: result.insertedId },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       message: 'Failed to add favorite',
//     });
//   }
// });

// // DELETE Single Favorite API
// app.delete('/favorites/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const email = req.query.email
//       ? String(req.query.email).trim().toLowerCase()
//       : '';

//     const idConditions = [{ itemId: id }, { id }];
//     if (ObjectId.isValid(id)) {
//       idConditions.unshift({ _id: new ObjectId(id) });
//     }

//     const query = email
//       ? { $and: [{ userEmail: email }, { $or: idConditions }] }
//       : { $or: idConditions };

//     const result = await favoritesCollection.deleteOne(query);

//     if (result.deletedCount === 0) {
//       return res.status(404).send({
//         success: false,
//         message: 'Favorite item not found',
//       });
//     }

//     res.send({
//       success: true,
//       message: 'Removed from favorites',
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       message: 'Failed to remove favorite',
//     });
//   }
// });

// // DELETE All Favorites API (Clear All Favorites)
// app.delete('/favorites', async (req, res) => {
//   try {
//     const email = req.query.email
//       ? String(req.query.email).trim().toLowerCase()
//       : '';

//     const query = email ? { userEmail: email } : {};
//     const result = await favoritesCollection.deleteMany(query);

//     res.send({
//       success: true,
//       message: 'Cleared all favorites',
//       deletedCount: result.deletedCount,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       message: 'Failed to clear favorites',
//     });
//   }
// });

//           //  admin api 

//           // PATCH User API (Update Role or Profile by ID)
// app.patch('/users/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).send({ message: 'Invalid user ID' });
//     }

//     const { role, name, phone, address, image } = req.body || {};
//     const updateFields = {
//       updatedAt: new Date(),
//     };

//     if (typeof role === 'string' && role.trim()) {
//       const normalizedRole = role.trim().toLowerCase();
//       if (!['customer', 'vendor', 'admin'].includes(normalizedRole)) {
//         return res.status(400).send({ message: 'Invalid role' });
//       }
//       updateFields.role = normalizedRole;
//     }

//     if (typeof name === 'string') updateFields.name = name.trim();
//     if (typeof phone === 'string') updateFields.phone = phone.trim();
//     if (typeof address === 'string') updateFields.address = address.trim();
//     if (typeof image === 'string') updateFields.image = image;

//     const result = await usersCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: updateFields }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).send({ message: 'User not found' });
//     }

//     res.send({
//       success: true,
//       message: 'User updated successfully',
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: 'Failed to update user' });
//   }
// });

// // DELETE User API
// app.delete('/users/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).send({ message: 'Invalid user ID' });
//     }

//     const result = await usersCollection.deleteOne({
//       _id: new ObjectId(id),
//     });

//     if (result.deletedCount === 0) {
//       return res.status(404).send({ message: 'User not found' });
//     }

//     res.send({
//       success: true,
//       message: 'User deleted successfully',
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: 'Failed to delete user' });
//   }
// });





// app.listen(port, () => {
//   console.log(`PizzaHub server running on port ${port}`);
// });














import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('You successfully connected to MongoDB!');
    return client;
  } catch (err) {
    console.dir(err);
    throw err;
  }
}

const connectedClient = await connectToMongoDB();
const db = connectedClient.db('pizzahub');

// Database collections
const usersCollection = db.collection('user');
const menuCollection = db.collection('menuitems');
const ordersCollection = db.collection('orders');
const favoritesCollection = db.collection('favorites');
const transactionsCollection = db.collection('transactions');

// Health check route
app.get('/', (req, res) => {
  res.send('PizzaHub Server is running!');
});

// ================= USERS API =================

// GET all users
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

// PATCH user profile by email (upsert)
app.patch('/users', async (req, res) => {
  try {
    const { email, name, phone, address, image } = req.body || {};
    const normalizedEmail = email ? String(email).trim().toLowerCase() : '';

    if (!normalizedEmail) {
      return res.status(400).send({
        success: false,
        message: 'Email is required to update profile',
      });
    }

    const updateFields = {
      updatedAt: new Date(),
    };

    if (typeof name === 'string') updateFields.name = name.trim();
    if (typeof phone === 'string') updateFields.phone = phone.trim();
    if (typeof address === 'string') updateFields.address = address.trim();
    if (typeof image === 'string') updateFields.image = image;

    const result = await usersCollection.updateOne(
      { email: normalizedEmail },
      { $set: updateFields },
      { upsert: true }
    );

    res.send({
      success: true,
      message: 'Profile updated in database',
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: 'Failed to update user profile',
    });
  }
});

// PATCH user role or profile fields by user ID
app.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid user ID' });
    }

    const { role, name, phone, address, image } = req.body || {};
    const updateFields = {
      updatedAt: new Date(),
    };

    if (typeof role === 'string' && role.trim()) {
      const normalizedRole = role.trim().toLowerCase();
      if (!['customer', 'vendor', 'admin'].includes(normalizedRole)) {
        return res.status(400).send({ message: 'Invalid role' });
      }
      updateFields.role = normalizedRole;
    }

    if (typeof name === 'string') updateFields.name = name.trim();
    if (typeof phone === 'string') updateFields.phone = phone.trim();
    if (typeof address === 'string') updateFields.address = address.trim();
    if (typeof image === 'string') updateFields.image = image;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({
      success: true,
      message: 'User updated successfully',
      role: updateFields.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to update user' });
  }
});

// DELETE user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid user ID' });
    }

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to delete user' });
  }
});

// ================= MENU ITEMS API =================

// GET all menu items
app.get('/menuitems', async (req, res) => {
  try {
    const cursor = menuCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to fetch menu items',
    });
  }
});

// POST a new menu item
app.post('/menuitems', async (req, res) => {
  try {
    const menuItem = req.body;

    const result = await menuCollection.insertOne({
      ...menuItem,
      price: Number(menuItem.price),
      createdAt: new Date(),
    });

    res.status(201).send({
      success: true,
      message: 'Menu item added successfully',
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to add menu item',
    });
  }
});

// GET a single menu item by ID
app.get('/menuitems/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ message: 'Invalid menu item ID' });
    }

    const query = { _id: new ObjectId(req.params.id) };
    const result = await menuCollection.findOne(query);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to fetch menu item',
    });
  }
});




// PATCH menu item approval status by ID
app.patch('/menuitems/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid menu item ID' });
    }

    const { status } = req.body || {};
    const allowedStatuses = ['Pending', 'Approved', 'Rejected'];
    const matchedStatus = allowedStatuses.find(
      (s) => s.toLowerCase() === String(status || '').trim().toLowerCase()
    );

    if (!matchedStatus) {
      return res.status(400).send({
        message: 'Status must be Pending, Approved, or Rejected',
      });
    }

    const result = await menuCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: matchedStatus, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Menu item not found' });
    }

    res.send({
      success: true,
      message: `Menu item ${matchedStatus.toLowerCase()}`,
      status: matchedStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to update menu item status' });
  }
});

// DELETE menu item by ID
app.delete('/menuitems/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid menu item ID' });
    }

    const result = await menuCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Menu item not found' });
    }

    res.send({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to delete menu item' });
  }
});




// GET upcoming/latest approved menu items top 6  items
app.get('/upcoming-menuitems', async (req, res) => {
  try {
    const limitParam = Number(req.query.limit);
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, 20)
        : 6;

    const cursor = menuCollection
      .find({ status: { $regex: /^approved$/i } })
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit);

    const result = await cursor.toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to fetch upcoming menu items',
    });
  }
});






// ================= ORDERS API =================

// GET orders (filtered by customer email if role is customer)
app.get('/orders', async (req, res) => {
  try {
    const { role, email } = req.query;
    const query = {};

    const normalizedRole = role ? String(role).trim().toLowerCase() : '';
    const normalizedEmail = email ? String(email).trim().toLowerCase() : '';

    if (normalizedRole === 'customer' && normalizedEmail) {
      query.customerEmail = normalizedEmail;
    }

    const cursor = ordersCollection.find(query).sort({ createdAt: -1 });
    const result = await cursor.toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to fetch orders',
    });
  }
});

// POST a new customer order
app.post('/orders', async (req, res) => {
  try {
    const order = req.body;
    const role = String(order.customerRole || order.role || 'customer')
      .trim()
      .toLowerCase();

    if (role === 'admin' || role === 'vendor') {
      return res.status(403).send({
        success: false,
        message: 'Admins and vendors are not allowed to place orders',
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
      createdAt: new Date(),
    });

    res.status(201).send({
      success: true,
      message: 'Order placed successfully',
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to place order',
    });
  }
});

// PATCH order status by ID
app.patch('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid order ID' });
    }

    const allowedStatuses = ['Pending', 'Accepted', 'Delivered'];
    const matchedStatus = allowedStatuses.find(
      (s) => s.toLowerCase() === String(status || '').trim().toLowerCase()
    );

    if (!matchedStatus) {
      return res.status(400).send({
        message: 'Status must be Pending, Accepted, or Delivered',
      });
    }

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: matchedStatus, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Order not found' });
    }

    res.send({
      success: true,
      message: 'Order status updated',
      status: matchedStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to update order status' });
  }
});

// ================= FAVORITES API =================

// GET favorites by user email (or all if no email provided)
app.get('/favorites', async (req, res) => {
  try {
    const email = req.query.email
      ? String(req.query.email).trim().toLowerCase()
      : '';

    const query = email ? { userEmail: email } : {};
    const result = await favoritesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to fetch favorites',
    });
  }
});

// POST item to favorites
app.post('/favorites', async (req, res) => {
  try {
    const body = req.body || {};
    const userEmail =
      body.userEmail || body.email
        ? String(body.userEmail || body.email).trim().toLowerCase()
        : '';

    const itemId = String(
      body.itemId || body.menuItemId || body._id || body.id || ''
    ).trim();

    if (!itemId) {
      return res.status(400).send({
        success: false,
        message: 'itemId is required',
      });
    }

    const duplicateQuery = userEmail ? { userEmail, itemId } : { itemId };
    const existing = await favoritesCollection.findOne(duplicateQuery);

    if (existing) {
      return res.status(200).send({
        success: true,
        alreadyExists: true,
        message: 'Already in favorites',
        favorite: existing,
      });
    }

    const newFavorite = {
      userEmail: userEmail || null,
      itemId,
      name: body.name || body.title || 'Pizza',
      title: body.title || body.name || 'Pizza',
      category: body.category || 'Pizza',
      price: Number(body.price || 0),
      oldPrice:
        typeof body.oldPrice === 'number' ? Number(body.oldPrice) : undefined,
      rating: typeof body.rating === 'number' ? Number(body.rating) : 4.6,
      reviewsCount:
        typeof body.reviewsCount === 'number' ? Number(body.reviewsCount) : 95,
      deliveryTime: body.deliveryTime || '30-40 min',
      deliveryText: body.deliveryText || 'Free Delivery',
      image: body.image || '',
      createdAt: new Date(),
    };

    const result = await favoritesCollection.insertOne(newFavorite);

    res.status(201).send({
      success: true,
      message: 'Added to favorites',
      insertedId: result.insertedId,
      favorite: { ...newFavorite, _id: result.insertedId },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to add favorite',
    });
  }
});

// DELETE a single favorite item
app.delete('/favorites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.query.email
      ? String(req.query.email).trim().toLowerCase()
      : '';

    const idConditions = [{ itemId: id }, { id }];
    if (ObjectId.isValid(id)) {
      idConditions.unshift({ _id: new ObjectId(id) });
    }

    const query = email
      ? { $and: [{ userEmail: email }, { $or: idConditions }] }
      : { $or: idConditions };

    const result = await favoritesCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: 'Favorite item not found',
      });
    }

    res.send({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to remove favorite',
    });
  }
});

// DELETE all favorites (for a user or all)
app.delete('/favorites', async (req, res) => {
  try {
    const email = req.query.email
      ? String(req.query.email).trim().toLowerCase()
      : '';

    const query = email ? { userEmail: email } : {};
    const result = await favoritesCollection.deleteMany(query);

    res.send({
      success: true,
      message: 'Cleared all favorites',
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to clear favorites',
    });
  }
});

// Start Express server
app.listen(port, () => {
  console.log(`PizzaHub server running on port ${port}`);
});