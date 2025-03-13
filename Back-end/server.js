const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const globalErrorHandler = require('./controller/errorController');
const authRoutes = require('./routes/auth-routes');
const AppError = require('./util/appError');
const { registerUser } = require('./controller/authController'); 

const app = express();

app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods : ["GET","POST","DELETE","PUT"],
        allowedHeaders : [
            "Content-Type",
            "Authorization",
        ],
        credentials: true,
    })
);

app.use(express.json({ limit: "10kb" }));

app.use('/api/auth', authRoutes);

// Update this route to use the registerUser controller
app.post('/api/auth/register', registerUser);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

const connectToDB = require('./database/db');

connectToDB();

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
