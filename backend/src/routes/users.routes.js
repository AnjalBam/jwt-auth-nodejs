const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const user = require("../models/user.model");
require("dotenv").config();

// Register
router.post("/register", async (req, res) => {
    try {
        let { email, password, passwordCheck, displayName } = req.body;

        // validate
        if (!email || !password || !passwordCheck) {
            return res
                .status(400)
                .json({ message: "Credentials not fulfilled!" });
        }

        if (password.length < 5)
            return res.status(400).json({
                message: "The password needs to be at least 5 characters long.",
            });

        if (password !== passwordCheck)
            return res.status(400).json({
                message: "Enter the same password twice for verification.",
            });

        const existingUser = await user.findOne({ email: email });

        if (existingUser)
            return res
                .status(400)
                .json({ message: `User with email ${email} already exists!` });

        if (!displayName) displayName = email;
        const salt = bcrypt.genSaltSync();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: passwordHash,
            displayName,
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // validate
        if (!email || !password)
            return res
                .status(400)
                .json({ message: "Please fill all fields properly." });

        const myUser = await user.findOne({ email: email });
        // console.log({ user });
        if (!myUser)
            return res
                .status(400)
                .json({ message: `User with email ${email}, does not exist!` });
        const isMatch = await bcrypt.compare(password, myUser.password);

        if (!isMatch)
            return res.status(400).json({ message: "Invalid Credentials." });

        const token = jwt.sign({ id: myUser._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: myUser._id,
                displayName: myUser.displayName,
            },
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
});

router.delete("/delete", auth, async (req, res) => {
    try {
        const deletedUser = await user.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check if token is valid
router.post("/checkIfValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");

        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (!verified) return res.json(false);

        const user = await user.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", auth, async (req, res) => {
    const user = await user.findById(req.user);
    res.json({
        displayName: user.displayName,
        id: user._id,
    });
});

module.exports = router;
