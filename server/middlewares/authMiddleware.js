const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    let token = req.cookies?.accessToken;

    if (!token) {
        const authHeader = req.headers.authorization || "";
        const [type, bearerToken] = authHeader.split(" ");

        if (type === "Bearer" && bearerToken) {
            token = bearerToken;
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = authMiddleware;