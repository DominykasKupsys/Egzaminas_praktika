const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  CreateRating: async (req, res) => {
    const { celebrationId } = req.body;
    let user_id = null;
    if (req.tokenInfo !== undefined) {
      user_id = req.tokenInfo.user_id;
    } else {
      return res.status(400).json({ error: "User ID not found in token" });
    }

    const creator = parseInt(user_id);
    const celebration = parseInt(celebrationId);
    try {
      const rating = await prisma.rating.create({
        data: {
          userId: creator,
          celebrationId: celebration,
        },
      });

      res.status(200).json({ data: rating });
    } catch (error) {
      console.error("Error creating rating:", error);
      res.status(500).json({ error: "Failed to create rating" });
    }
  },
  async DeleteRating(req, res) {
    const { celebrationId } = req.body;
    let user_id = null;

    if (req.tokenInfo !== undefined) {
      user_id = req.tokenInfo.user_id;
    } else {
      return res.status(400).json({ error: "User ID not found in token" });
    }

    const creator = parseInt(user_id);

    try {
      const rating = await prisma.rating.findUnique({
        where: {
          userId_celebrationId: {
            userId: creator,
            celebrationId: parseInt(celebrationId),
          },
        },
      });

      if (!rating) {
        return res.status(404).json({ error: "Rating not found" });
      }

      await prisma.rating.delete({
        where: {
          userId_celebrationId: {
            userId: creator,
            celebrationId: parseInt(celebrationId),
          },
        },
      });

      res.status(200).json({ message: "Rating deleted successfully" });
    } catch (error) {
      console.error("Error deleting rating:", error);
      res.status(500).json({ error: "Failed to delete rating" });
    }
  },
};
