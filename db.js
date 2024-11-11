const mongoose = require("mongoose");
const bodyParser = require('body-parser');
// const mongoURL = "mongodb+srv://eramishamotwani:ecmz5qsnxc4JNTvT@cluster0.7zwofoh.mongodb.net/?retryWrites=true&w=majority";

// const mongoURL = "mongodb+srv://amisha_motwani:/sAmisha@1343@cluster0.7zwofoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
 
const mongoURL = "mongodb+srv://amisha_motwani:Amisha%401343@cluster0.7zwofoh.mongodb.net/SoniyaAdmin?retryWrites=true&w=majority&appName=Cluster0";

const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;

// Load environment variables from .env file
require('dotenv').config();

// Increase the maximum payload size limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//app.use is a middlewere , this line is for if you want to recieve any data from req.body
app.use(express.json());
app.use(cors());

// Apply CORS middleware
// app.use(cors({
//   origin: 'https://mktextiles.in', // Replace with your frontend domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'SEARCH'], // Define allowed methods
//   credentials: true, // Enable if you need to include cookies or authentication headers
// }));
// app.use(cors({ origin: '*' }));


// const connectToMongodb = async () => {
//   try {
//     // await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
//     await mongoose.connect(mongoURL, { connectTimeoutMS: 10000000 });
//     // await mongoose.connect(mongoURL);
//     console.log("Connected to MongoDB successfully");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error.message);
//     console.error("Error==>", error);
    
//   }
// };

const connectToMongodb = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      connectTimeoutMS: 30000 // 30 seconds
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);  // Exit if connection fails
  }
};

//Availale routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/Product'));

app.get('/image', (req, res) => {
  res.send('<h1>Hello</h1>');
});


app.get('/', (req, res) => {
  res.send('Hello Amisha')
})

// New GET API to respond with "Server is running"
app.get('/server', (req, res) => {
  console.log("GET request received at /server endpoint");
  res.send("Server is running");
});

const path = require('path');

// const path = require('path');

// Assuming your uploads folder is in the root directory of your project
const uploadsDirectory = path.join(__dirname, 'uploads');

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDirectory));

// Route to display the image
app.get('/OponImage', (req, res) => {
  res.send('<h1>Hello</h1><img src="/uploads/1709628404195Screenshot (157).png" alt="Image" />');
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = connectToMongodb;
  
