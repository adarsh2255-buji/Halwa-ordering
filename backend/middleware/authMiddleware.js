import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({ message: "Not authorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = { _id: decoded.id, username: decoded.username };
        // req.username = decoded.username;
        req.user = await User.findById(decoded.userId);
        next();
    } catch (error) {
        res.status(401).json({ message: "invalid token", error });
    }
}

export default authMiddleware;