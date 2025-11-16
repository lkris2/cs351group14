const User = require('../models/User'); // Assume the model is correctly located here
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // You must have 'jsonwebtoken' installed

// Ensure you have a JWT_SECRET defined in your .env file!

// Function to handle new user sign-up
exports.signupUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // 1. Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 2. Create a new user instance
        user = new User({
            name,
            email,
            password,
            role: role || 'rider', // Default role is 'rider'
        });

        // 3. Hash the password (CRITICAL SECURITY STEP)
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        // 4. Save the user to MongoDB
        await user.save();

        // 5. Registration successful (no token needed yet)
        res.status(201).json({ 
            msg: 'User registered successfully!',
            userId: user._id,
            role: user.role
        });

    } catch (err) {
        console.error(err.message);
        console.error("SIGNUP ERROR:", err);
        res.status(500).send('Server error during sign-up');
    }
};

// Function to handle user login (returns a JWT token)
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 2. Compare submitted password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. Create the JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // 4. Sign the token and send it back
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Make sure JWT_SECRET is in your .env
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    userId: user.id,
                    role: user.role,
                    msg: 'Login successful' 
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during login');
    }
};