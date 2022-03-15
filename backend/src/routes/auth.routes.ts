import express from 'express';
import CryptoJS from 'crypto-js';
import { dotenvConfig } from '../config/dotenv.config';
import jwt from 'jsonwebtoken';
import { User } from '../models/Users';
import { verifyToken } from '../middlewares/verifyToken';

dotenvConfig;

const authRoutes = express.Router();

authRoutes.post('/auth/register', async (req, res) => {
    const { name, username, password, email } = req.body;

    const hashedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY || '').toString();

    const newUser = new User({
        name,
        username,
        password: hashedPassword,
        email,
    });

    try {
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

authRoutes.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Username or password is incorrect' });
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY || '').toString(
            CryptoJS.enc.Utf8
        );

        if (password === hashedPassword) {
            user.password = undefined;

            const token = jwt.sign(
                {
                    id: user._id,
                },
                process.env.JWT_SECRET_KEY || '',
                { expiresIn: '24h' }
            );

            res.status(200).json({ user, token });
        } else {
            res.status(401).json({ message: 'Username or password is incorrect' });
        }
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

authRoutes.get('/auth/logout', verifyToken, (req, res) => {
    req.user = undefined;

    res.status(200).json({ message: 'You have been logged out' });
});

authRoutes.put('/auth/update/admin', verifyToken, async (req, res) => {
    const { id, isAdmin } = req.body;

    if (!id || !isAdmin) {
        return res.status(400).json({ message: 'Bad request' });
    } else {
        try {
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            } else {
                user.isAdmin = isAdmin;

                const updatedUser = await user.save();

                updatedUser.password = undefined;

                res.status(200).json(updatedUser);
            }
        } catch (err) {
            res.status(500).json({ message: err });
        }
    }
});

export { authRoutes };
