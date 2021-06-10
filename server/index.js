const express = require('express');
const path = require('path');

const constants = require('./utils/constants');
const scheduleRoutes = require('./routes/schedule');

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use('/api/schedule', scheduleRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(constants.PORT,() => {
    console.log(`Server listening on ${constants.PORT}`);
})