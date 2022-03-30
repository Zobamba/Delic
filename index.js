const express = require ('express');

const app = express();

const port = 3000;

// Homepage route
app.get('/', (req, res) => {
    res.send('Welcome to Delic Restaurants');
});


app.listen(port, () => console.log(`index app listening on port ${port}!`));