const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
    },
    displayName: { type: String },
});

module.exports = User = mongoose.model("user", userSchema);
