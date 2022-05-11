import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/auth-routes.js';

require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());

const port = 3000;

// Homepage route
app.get('/', (req, res) => {
    res.send('Welcome to Delic Restaurants');
});

routes(app);

app.listen(port, () => console.log(`index app listening on port ${port}!`));