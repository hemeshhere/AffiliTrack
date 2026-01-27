const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');
const { OAuth2Client } = require('google-auth-library');

const authController = {
    login: async (request, response) => {
        try {
            // The body contains username and password because of the express.json()
            // middleware configured in the server.js
            const { username, password } = request.body;

            // Call Database to fetch user by the email
            const data = await Users.findOne({ email: username });
            if (!data) {
                return response.status(401).json({ message: 'Invalid credentials ' });
            }

            const isMatch = await bcrypt.compare(password, data.password);
            if (!isMatch) {
                return response.status(401).json({ message: 'Invalid credentials ' });
            }

            const user = {
                id: data._id,
                name: data.name,
                email: data.email
            };

            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });
            response.json({ user: user, message: 'User authenticated' });
        } catch (error) {
            console.log(error);
            response.status(500).json({ error: 'Internal server error' });
        }
    },

    logout: (request, response) => {
        response.clearCookie('jwtToken');
        response.json({ message: 'Logout successfull' });
    },

    isUserLoggedIn: (request, response) => {
        const token = request.cookies.jwtToken;

        if (!token) {
            return response.status(401).json({ message: 'Unauthorized access' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
            if (error) {
                return response.status(401).json({ message: 'Unauthorized access' });
            } else {
                response.json({ message: 'User is logged in', user: user });
            }
        });
    },

    register: async (request, response)=>{
        try {
            // Extract attributes from the request body
            const { username, password, name } = request.body;
            // Firstly check if user already exist with the given email
            const data = await Users.findOne({ email: username });
            if (data) {
                return response.status(401).json({ message: 'Account already exist with given email' });
            }
            // Encrypt the password before saving the record to the database
            const encryptedPassword = await bcrypt.hash(password, 10);
            // Create mongoose model object and set the record values
            const user = new Users({
                email: username,
                password: encryptedPassword,
                name: name
            });
            await user.save();
            response.status(200).json({ message: 'User registered' });
        } catch (error) {
            console.log(error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    },
    
    googleAuth: async (req, res) => {
        try {
            const { idToken } = req.body;
            if (!idToken) {
                return res.status(400).json({ message: 'ID token is required' });
            }

            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) {
                return res.status(401).json({ message: 'Invalid Google token' });
            }

            const { sub: googleId, name, email } = payload;

            let userDoc = await Users.findOne({ email });

            if (!userDoc) {
                userDoc = await Users.create({
                    email,
                    name,
                    googleId,
                    isGoogleUser: true,
                });
            }

            const userPayload = {
                id: userDoc._id.toString(),
                email: userDoc.email,
                name: userDoc.name,
            };

            const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            res.cookie('jwtToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });

            return res.status(200).json({
                message: 'User authenticated successfully',
                user: userPayload,
            });
        } catch (error) {
            console.error('Google Auth Error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

};

module.exports = authController;