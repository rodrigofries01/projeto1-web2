//admin adiciona alunos, palavras chave e conhecimentos

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { Skill } = require("../models/Skill");
const Keyword = require("../models/Keyword");
const { adminAuth } = require("../middleware/auth");

// Student Management
router.get("/", adminAuth, async (req, res) => {
  try {
    const students = await User.findAll({
      where: { is_admin: false },
      attributes: { exclude: ["senha"] },
    });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Error fetching students" });
  }
});

router.post("/", adminAuth, async (req, res) => {
  try {
    const user = new User({
      ...req.body,
      role: "student",
    });
    await user.save();
    res.status(201).json({ ...user.toJSON(), password: undefined });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Error creating student" });
  }
});

router.put("/students/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    Object.assign(user, req.body);
    await user.save();
    res.json({ ...user.toJSON(), password: undefined });
  } catch (error) {
    res.status(500).json({ message: "Error updating student" });
  }
});

router.delete("/students/:id", adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student" });
  }
});

// Skill Management
router.get("/skills", adminAuth, async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Error fetching skills" });
  }
});

router.post("/skills", adminAuth, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Skill already exists" });
    }
    res.status(500).json({ message: "Error creating skill" });
  }
});

router.put("/skills/:id", adminAuth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: "Error updating skill" });
  }
});

router.delete("/skills/:id", adminAuth, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting skill" });
  }
});

// Keyword Management
router.get("/keywords", adminAuth, async (req, res) => {
  try {
    const keywords = await Keyword.find();
    res.json(keywords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching keywords" });
  }
});

router.post("/keywords", adminAuth, async (req, res) => {
  try {
    const keyword = new Keyword(req.body);
    await keyword.save();
    res.status(201).json(keyword);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Keyword already exists" });
    }
    res.status(500).json({ message: "Error creating keyword" });
  }
});

router.put("/keywords/:id", adminAuth, async (req, res) => {
  try {
    const keyword = await Keyword.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(keyword);
  } catch (error) {
    res.status(500).json({ message: "Error updating keyword" });
  }
});

router.delete("/keywords/:id", adminAuth, async (req, res) => {
  try {
    await Keyword.findByIdAndDelete(req.params.id);
    res.json({ message: "Keyword deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting keyword" });
  }
});

module.exports = router;
