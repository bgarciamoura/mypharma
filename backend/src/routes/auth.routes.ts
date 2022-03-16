import express from 'express';
import CryptoJS from 'crypto-js';
import { dotenvConfig } from '../config/dotenv.config';
import jwt from 'jsonwebtoken';
import { uuid } from 'uuidv4';
import { User } from '../models/Users';
import { verifyToken } from '../middlewares/verifyToken';

dotenvConfig;

const authRoutes = express.Router();

authRoutes.post('/auth/register', async (req, res) => {
    const { name, password, email } = req.body;

    const UUID = uuid();

    const hashedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY || '').toString();

    const newUser = new User({
        UUID,
        name,
        email,
        password: hashedPassword,
    });

    try {
        const savedUser = await newUser.save();

        savedUser.password = undefined;

        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

authRoutes.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY || '').toString(
            CryptoJS.enc.Utf8
        );

        if (password === hashedPassword) {
            user.password = undefined;

            const token = jwt.sign(
                {
                    id: user.UUID,
                },
                process.env.JWT_SECRET_KEY || '',
                { expiresIn: '24h' }
            );

            res.status(200).json({ user, token });
        } else {
            res.status(401).json({ message: 'Email or password is incorrect' });
        }
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

authRoutes.get('/auth/logout', verifyToken, (req, res) => {
    req.user = undefined;
    req.headers.token = undefined;

    res.status(200).json({
        message: 'You have been logged out',
    });
});

export { authRoutes };
