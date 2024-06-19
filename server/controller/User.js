const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

module.exports = {
  async Register(req, res) {
    const { name, email, password, confirmPassword } = req.body;
    const userExists = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const HashedPassword = await bcrypt.hash(password, 5);
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: HashedPassword,
        role: 0,
        isBlocked: 0,
      },
    });
    const token = jwt.sign({ user_id: user.id, email }, "secret", {
      expiresIn: "2h",
    });
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { token: token },
    });
    res.status(200).json({ data: user });
  },
  async Login(req, res) {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user.id, email }, "secret", {
        expiresIn: "2h",
      });

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { token: token },
      });
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ id: user.id, token: token, role: user.role });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  },
  async getUserData(req, res) {
    let user_id = null;
    if (req.tokenInfo !== undefined) {
      user_id = req.tokenInfo.user_id;
    } else {
      return res.status(400).json({ error: "User ID not found in token" });
    }

    const creator = parseInt(user_id);

    const user = await prisma.user.findUnique({
      where: {
        id: creator,
      },
      include: {
        rating: true,
      },
    });

    res.status(200).json({ data: user });
  },
  async getUsers(req, res) {
    const users = await prisma.user.findMany({
      where: {
        isBlocked: 0,
        role: 0,
      },
    });
    res.status(200).json({ data: users });
  },
  async updateUser(req, res) {
    if (req.tokenInfo.role === 0) {
      return res
        .status(403)
        .json({ error: "You are not authorized to block this user" });
    }
    const id = parseInt(req.params.id);
    try {
      const users = await prisma.user.update({
        where: { id: id },
        data: {
          isBlocked: 1,
        },
      });
      res.status(200).json({ data: users });
    } catch (error) {
      console.error("Error blocking user:", error);
      res.status(500).json({ error: "Failed to block user" });
    }
  },
};
