const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Please fill in the required fields" });
    }

    const user = await prisma.user.findFirst({
        where: {
            username,
        },
    });

    const isPasswordCorrect =
        user && (await bcrypt.compare(password, user?.password));

    const secret = process.env.JWT_SECRET;

    if (user && isPasswordCorrect && secret) {
        res.status(200).json({
            id: user.id,
            username: user.username,
            role: user.role,
            token: jwt.sign({ id: user.id }, secret, { expiresIn: '30d' }),
        });
    } else {
        return res.status(400).json({ message: "Incorrectly entered email or password" });
    }
};

const register = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res
            .status(400)
            .json({ message: "Please fill in the required fields" });
    }

    const registeredUser = await prisma.user.findFirst({
        where: {
            username,
        },
    });

    if (registeredUser) {
        res
            .status(400)
            .json({ message: "User with such e-mail already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            username,
            role,
            password: hashedPassword,
        },
    });

    const secret = process.env.JWT_SECRET;

    if (user && secret) {
        res.status(201).json({
            id: user.id,
            username: user.username,
            role: user.role,
            token: jwt.sign({ id: user.id }, secret, { expiresIn: '30d' }),
        });
    } else {
        return res.status(400).json({ message: "Failed to create user" });
    }
};

module.exports = {
    login,
    register,
};