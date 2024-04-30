const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // If you're using CORS
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.NODE_PORT;


// Example user database
const users = [
  { username: 'admin', password: '1234', id: 1 },
  { username: 'user', password: '1234', id: 2 }
];

app.use(bodyParser.json()); 
// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS if needed
app.use(express.static('public')); // To serve static files from 'public' directory
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  res.status(404).send('File nahi mili yaar!');
});
app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  },
}));

// Setup database connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USERNAME, // Your database username
//   password: process.env.DB_PASSWORD, // Your database password
//   database: process.env.DB_DBNAME
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to database');
// });



const uri =process.env.MONGODB_URI;

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
// insert data into mongodb route 
app.get('/insert', async (req, res) => {
  try {
      // Connect the client to the server
      await client.connect();

      const db = client.db('database'); // the name of your database
      const collection = db.collection('icms');

      // Data to be inserted
      const data = [
          { "temp": 12, "humid": 12.12, "airq": 12.12, "carbdi": 12.12, "status": 1 },
          { "temp": 13, "humid": 12, "airq": 12, "carbdi": 13, "status": 1 },
          { "temp": 14, "humid": 12, "airq": 12, "carbdi": 14, "status": 0 },
          { "temp": 15, "humid": 12, "airq": 15, "carbdi": 14, "status": 0 },
          { "temp": 16, "humid": 12, "airq": 18, "carbdi": 14, "status": 0 },
          { "temp": 17, "humid": 14, "airq": 18, "carbdi": 16, "status": 1 }
      ];

      // Insert multiple documents
      const insertResult = await collection.insertMany(data);
      console.log('Inserted documents =>', insertResult);

      res.send('Data inserted successfully');
  } catch (err) {
      console.error('An error occurred:', err);
      res.status(500).send('Failed to insert data');
  } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
  }
});

// Routes
app.get('/dashboard', (req, res) => {
  res.sendFile('dashboard.html', { root: __dirname + '/public' });
});
app.get('/', (req, res) => {
  res.sendFile('login.html', { root: __dirname + '/public' });
});
app.get('/hi', (req, res) => {
  res.sendFile('investcast.html', { root: __dirname + '/public' });
});
app.get('/labs', async (req, res) => {
  try {
      // Connect the client to the server
      await client.connect();
      console.log("Connected successfully to MongoDB Atlas");

      const db = client.db('database'); // the name of your database
      const collection = db.collection('icms');

      // Fetching all documents from the icms collection
      const documents = await collection.find({}).toArray();
      res.json(documents);
  } catch (err) {
      console.error('An error occurred:', err);
      res.status(500).send('Failed to fetch data');
  } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
  }
});
// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`The username  is ${username} and the password is ${password}`)

  // Check if username/password match any user in the database
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Generate JWT token and send it back to the client
    const token = generateToken(user);
    // res.json({ success: true, token });
    res.redirect("/dashboard");
  } else {
    res.json({ success: false, message: 'Invalid username or password' });
  }
});

// Dummy token generation function (replace with your actual implementation)
function generateToken(user) {
  return `dummy_token_for_${user.id}`;
}

app.listen(port, () => console.log(`Server running on port ${port}`));
