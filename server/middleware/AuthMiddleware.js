import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken; // Assuming access token is stored in cookies

    if (!token) {
        return res.status(401).json({ message: "No access token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded.user; // Attach user info to request object
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(403).json({ message: "Forbidden" });
    }
}

export default authMiddleware;