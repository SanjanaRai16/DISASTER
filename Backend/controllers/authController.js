


const jwt = require('jsonwebtoken');
const Admin = require('../models/admin'); // Admin model
const Volunteer = require('../models/volunteer'); // Volunteer model
const User = require('../models/user'); // User model

// Admin Signup
const signupAdmin = async (req, res) => {
    const { username, email, password, userType } = req.body;

    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

        // Create new admin
        const newAdmin = new Admin({
            username,
            email,
            password, // Store plaintext password (NOT RECOMMENDED)
            userType,
        });

        await newAdmin.save();

        // Generate JWT token
        const token = jwt.sign({ id: newAdmin._id, userType: newAdmin.userType }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({ message: "Admin created successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Volunteer Signup
const signupVolunteer = async (req, res) => {
    const { username, email, password, userType } = req.body;

    try {
        // Check if volunteer already exists
        const existingVolunteer = await Volunteer.findOne({ email });
        if (existingVolunteer) return res.status(400).json({ message: "Volunteer already exists" });

        // Create new volunteer
        const newVolunteer = new Volunteer({
            username,
            email,
            password, // Store plaintext password (NOT RECOMMENDED)
            userType,
        });

        await newVolunteer.save();

        // Generate JWT token
        const token = jwt.sign({ id: newVolunteer._id, userType: newVolunteer.userType }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({ message: "Volunteer created successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// User Signup
const signupUser = async (req, res) => {
    const { username, email, password, userType } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Create new user
        const newUser = new User({
            username,
            email,
            password, // Store plaintext password (NOT RECOMMENDED)
            userType,
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, userType: newUser.userType }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Check if user exists in any of the models
        let user = await User.findOne({ email });
        if (!user) user = await Admin.findOne({ email });
        if (!user) user = await Volunteer.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if password matches
        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, userType: user.userType }, // Use userType for role-based routing
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response with token and user type
        res.status(200).json({
            message: "Login successful",
            token,
            userType: user.userType, // Send userType to frontend
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { signupAdmin, signupVolunteer, signupUser, login };
