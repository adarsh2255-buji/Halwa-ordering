import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: decoded.id, username: decoded.username };
        req.username = decoded.username;
        next();
    } catch (error) {
        res.status(401).json({ message: "invalid token", error });
    }
}

export default authMiddleware;