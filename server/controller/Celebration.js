const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const PostController = {
  async CreatePost(req, res) {
    const { name, date, category, location } = req.body;
    let photoUrl = null;
    if (req.file) {
      photoUrl = req.file.filename;
    }
    console.log(req.file);
    let user_id = "";
    console.log(req.tokenInfo);
    if (req.tokenInfo !== undefined) {
      user_id = req.tokenInfo.user_id;
    } else {
      return res.status(400).json({ error: "User ID not found in token" });
    }

    const creator = parseInt(user_id);
    const categoryId = parseInt(category);
    const formattedDate = new Date(date);
    try {
      const post = await prisma.celebration.create({
        data: {
          userId: creator,
          categoryId: categoryId,
          date: formattedDate.toISOString(),
          name: name,
          location: location,
          image: photoUrl,
          isVerified: 0,
        },
      });
      res
        .status(200)
        .json({ data: post, message: "Post created successfully" });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  },
  async GetPosts(req, res) {
    try {
      const posts = await prisma.celebration.findMany({
        include: { category: true, rating: true },
      });
      res.status(200).json({ data: posts });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  },
  async GetPostById(req, res) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Post ID not found" });
    }
    try {
      const post = await prisma.celebration.findUnique({
        where: { id: parseInt(id) },
        include: { category: true },
      });
      console.log(post);
      res.status(200).json({ data: post });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  },
  async UpdatePost(req, res) {
    const { name, date, category, location } = req.body;
    const id = req.params.id;

    try {
      const post = await prisma.celebration.findUnique({
        where: { id: parseInt(id) },
      });
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (post.userId !== req.tokenInfo.user_id || req.tokenInfo.role == 0) {
        return res
          .status(403)
          .json({ error: "You are not authorized to update this post" });
      }

      let formattedDate = post.date; // Initialize with existing date
      if (date) {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          formattedDate = parsedDate.toISOString();
        } else {
          return res.status(400).json({ error: "Invalid date format" });
        }
      }

      let photoUrl = null;
      if (req.file) {
        photoUrl = req.file.filename;
      }

      let categoryId = null;
      if (category !== undefined) {
        categoryId = parseInt(category);
      }

      const updatedPost = await prisma.celebration.update({
        where: { id: parseInt(id) },
        data: {
          name: name ?? post.name,
          date: formattedDate,
          categoryId: categoryId ?? post.categoryId,
          location: location ?? post.location,
          image: photoUrl ?? post.image,
        },
      });

      res
        .status(200)
        .json({ data: updatedPost, message: "Post updated successfully" });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  },
  async DeletePost(req, res) {
    const id = req.params.id;
    try {
      const post = await prisma.celebration.findUnique({
        where: { id: parseInt(id) },
      });
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (post.userId !== req.tokenInfo.user_id && req.tokenInfo.role == 0) {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this post" });
      }
      await prisma.celebration.delete({ where: { id: parseInt(id) } });

      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  },
  async GetUserPosts(req, res) {
    const id = parseInt(req.params.id);

    if (req.tokenInfo.role == 0) {
      return res
        .status(403)
        .json({ error: "You are not authorized to verify this posts" });
    }
    try {
      const posts = await prisma.celebration.findMany({
        where: { userId: id },
      });
      res.status(200).json({ data: posts });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  },
  async GetNotVerifiedPosts(req, res) {
    try {
      const posts = await prisma.celebration.findMany({
        where: { isVerified: 0 },
        include: { category: true, rating: true },
      });
      res.status(200).json({ data: posts });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  },
  async VerifyPosts(req, res) {
    const id = parseInt(req.params.id);
    try {
      const post = await prisma.celebration.update({
        where: { id: id },
        data: { isVerified: 1 },
      });
      res.status(200).json({ data: post });
    } catch (error) {
      console.error("Error verifying post:", error);
      res.status(500).json({ error: "Failed to verify post" });
    }
  },
};

module.exports = PostController;
