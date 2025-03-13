const JWT = require('jsonwebtoken');
const AppError = require('../util/appError');
const User = require('../model/user');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return next(new AppError('Invalid token. Please log in again.', 401));
    }
};

module.exports = protect;
