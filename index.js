const express = require('express');

const constants = require('./utils/constants');
const scheduleRoutes = require('./routes/schedule');

const app = express();
app.use(express.json());

app.use('/api/schedule', scheduleRoutes);

app.listen(constants.PORT,() => {
    console.log(`Server started on http://127.0.0.1:${constants.PORT}/api/schedule/`);
})