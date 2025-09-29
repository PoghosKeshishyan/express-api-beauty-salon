const { prisma } = require("../prisma/prisma-client");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
        });

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized" });
    }
};

const isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        next();
    } catch (e) {
        res.status(500).json({ message: "Server error in isAdmin" });
    }
};

const isSuperAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Access denied. Superadmin only." });
        }
        next();
    } catch (e) {
        res.status(500).json({ message: "Server error in isSuperAdmin" });
    }
};

module.exports = {
    auth,
    isAdmin,
    isSuperAdmin,
};