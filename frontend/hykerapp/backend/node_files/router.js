import express from 'express';
import mongoose from 'mongoose';
import Users from './models/user.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const existing = await Users.findOne({ email: email });
        if (!existing) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (existing.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        return res.status(200).json({ message: 'Login successful', user: existing });
    } catch (err) {
        console.error('Error in /login:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/signup', async (req, res) => {
    const { email, name, password } = req.body || {};

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const existing = await Users.findOne({ email: email });
        if (existing) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const newUser = new Users({
            _id: new mongoose.Types.ObjectId(),
            name: name || '',
            email,
            password: password || '',
        });

        await newUser.save();
        return res.status(201).json({ message: 'User created', user: newUser });
    } catch (err) {
        console.error('Error in /signup:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/oauth/google', async (req, res) => {
    const { email, name } = req.body || {};

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const existing = await Users.findOne({ email });
        if (existing) {
            return res.status(200).json({ message: 'User exists', user: existing });
        }

        const newUser = new Users({
            _id: new mongoose.Types.ObjectId(),
            name: name || '',
            email,
            password: '',
        });

        await newUser.save();
        return res.status(201).json({ message: 'User created', user: newUser });
    } catch (err) {
        console.error('Error in /oauth/google:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
