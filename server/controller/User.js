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
};
