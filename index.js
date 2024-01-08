import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/routes';

const dotenv = require('dotenv');

dotenv.config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.json());

const port = 3001;

// Homepage route
app.get('/', (req, res) => {
  res.send('Welcome to Delic Restaurants');
});

routes(app);

app.listen(port, () => console.log(`index app listening on port ${port}!`));
