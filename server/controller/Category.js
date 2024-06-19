const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  async GetCategories(req, res) {
    const categories = await prisma.category.findMany();
    res.status(200).json({ data: categories });
  },
  async CreateCategory(req, res) {
    const { name } = req.body;
    if (req.tokenInfo.role == 0) {
      return res
        .status(403)
        .json({ error: "You are not authorized to create category" });
    }
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    res.status(200).json({ data: category });
  },
};
