const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/user.route');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1/users', userRoutes);

app.use(cors());
app.use(bodyParser.json());

mongoose
    .connect(process.env.MONGODB_URI, )
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is listening at http://localhost:${port}`);
        });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));

