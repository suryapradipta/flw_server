const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({email, password: hashedPassword, username});
        await user.save();

        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        console.error('Error during register:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        /*if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({error: 'Invalid credentials'});
        }*/
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        /*const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );*/

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        res.status(200).json({ userId: user._id, access_token: accessToken, refresh_token: refreshToken });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refresh_token } = req.body;

        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: 'Invalid refresh token' });

            // Generate a new access token
            const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });

            res.json({ access_token: accessToken });
        });
    } catch (error) {
        res.status(500).json({ error: 'Unable to refresh access token' });
    }
};

module.exports = {register, login, refreshToken};
