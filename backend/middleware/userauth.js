const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
require('dotenv').config();

async function auth(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ errorMessage: "Unauthorized" });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user's information from the database
        const user = await User.findById(verified.user);

        if (!user) {
            throw new Error();
        }

        req.user = { id: verified.user, username: user.name }; // Include user's ID and username

        next();
    } catch (error) {
        res.status(401).send("Unauthorized");
    }
}

module.exports = auth;
