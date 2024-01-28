const { User } = require("../Schema/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const fetchUserDetails = async (req, res) => {
    User.findById(req.user.userId).then((user) => {
        res.status(200).json({ success: true, data: user })
    }).catch((err) => {
        res.status(400).json({ success: false, error: err })
    })
}

const createUser = async (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return res.status(400).json({ success: false, error: err });
        bcrypt.hash(req.body.password, salt, async (err, hash) => {
            if (err) return res.status(400).json({ success: false, error: err });
            req.body.password = hash
            const user = new User(req.body)
            await user.save().then(() => {
                return res.status(201).json({ user, success: true, message: "User created" })
            }).catch((err) => {
                if (err.name === "MongoServerError" && err.code === 11000) {
                    res.status(400).json({ success: false, error: "This email already exists" })
                } else {
                    console.log(err)
                    res.status(400).json({ success: false, error: err })
                }
            })
        })
    })
}   

const login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email.toLowerCase() } ).select("email +password").exec()
    if (!user) return res.status(400).json({ success: false, error: "User not found" })
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err || !result) {
            console.log("hey")
            return res.status(401).json({ success: false, error: "Incorrect password" })
        }
        const token = jwt.sign({
            email: user.email,
            userId: user.id
        }, process.env.SECRET_KEY)
        return user ? res.status(200).json({ token, user, success: true, error: "Logged in Succcessfully" }) : res.status(400).json({ user: null, success: false, error: "Invalid Email or Password" })
    })
}

const updateUserDetails = async (req, res) => {
    User.findByIdAndUpdate(req.user.userId, req.body, { new: true }).then((user) => {
        res.status(200).json({ success: true, data: user })
    }).catch((err) => {
        res.status(400).json({ success: false, error: err })
    })
}

const addBookmark = async (req, res) => {
    User.findByIdAndUpdate(req.user.userId, { $push: { bookmarks: req.body.projectId } }, { new: true }).then((user) => {
        res.status(200).json({ success: true, data: user })
    }).catch((err) => {
        res.status(400).json({ success: false, error: err })
    })
}

const removeBookmark = async (req, res) => {
    User.findByIdAndUpdate(req.user.userId, { $pull: { bookmarks: req.body.projectId } }, { new: true }).then((user) => {
        res.status(200).json({ success: true, data: user })
    }).catch((err) => {
        res.status(400).json({ success: false, error: err })
    })
}

module.exports = { fetchUserDetails, createUser, login, updateUserDetails, addBookmark, removeBookmark }