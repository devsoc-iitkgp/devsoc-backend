const jwt = require("jsonwebtoken");
const { User } = require("../Schema/userSchema");

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: "Login error" });
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, error: "Login error" })
        } else {
            User.findById(decoded.userId).exec().then(data => {
                if (data) {
                    req.user = decoded;
                    next();
                } else {
                    return res.status(401).json({ success: false, error: "User not found" })
                }
            })
        }
    })
}

module.exports = authenticateToken;