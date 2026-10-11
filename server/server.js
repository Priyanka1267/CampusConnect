const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Post = require("./models/Post");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.json({ message: "CampusConnect backend is running!" });
});
app.get("/api/test", (req, res) => {
  res.json({ message: "Updated server is working" });
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    project: "College Social Interaction Platform",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    const { author, content, category } = req.body;

    if (!author || !content || !author.trim() || !content.trim()) {
      return res.status(400).json({ message: "Author and content are required" });
    }

    const post = await Post.create({
      author,
      content,
      category: category || "General"
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to create post" });
  }
});

app.patch("/api/posts/:id/like", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(400).json({ message: "Invalid post ID or request" });
  }
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
