require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const dashboardRouter = require('./routes/dashboard')
const messageRouter = require('./routes/message')

const fileUpload = require('express-fileupload');
const cors = require('cors');

app.use(bodyParser.json())
app.use(fileUpload());
app.use(express.static('uploads'));
app.use(cors());


// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Set static file path
app.use(express.static('public'));

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', dashboardRouter)
app.use('/message', messageRouter);


const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`)
})