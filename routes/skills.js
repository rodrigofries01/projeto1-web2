const express = require("express");
const router = express.Router();
const { Skill, UserSkill } = require("../models/Skill");
const { auth } = require("../middleware/auth");

// Get all skills
router.get("/", async (req, res) => {
  try {
    const skill = await Skill.find();
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: "Error fetching skills" });
  }
});

// Get student's skills
router.get("/student", auth, async (req, res) => {
  try {
    const userSkill = await UserSkill.find({ user: req.user._id }).populate(
      "skill",
      "name"
    );
    res.json(userSkill);
  } catch (error) {
    res.status(500).json({ message: "Error fetching skills" });
  }
});

// Add skill to student
router.post("/", auth, async (req, res) => {
  try {
    const { skillId, level } = req.body;

    const existingSkill = await UserSkill.findOne({
      user: req.user._id,
      skill: skillId,
    });

    if (existingSkill) {
      existingSkill.level = level;
      await existingSkill.save();
      return res.json(existingSkill);
    }

    const userSkill = new UserSkill({
      user: req.user._id,
      skill: skillId,
      level,
    });

    await userSkill.save();
    res.status(201).json(userSkill);
  } catch (error) {
    res.status(500).json({ message: "Error adding skill" });
  }
});

// Update student's skill level
router.put("/:skillId", auth, async (req, res) => {
  try {
    const userSkill = await UserSkill.findOne({
      user: req.user._id,
      skill: req.params.skillId,
    });

    if (!userSkill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    userSkill.level = req.body.level;
    await userSkill.save();
    res.json(userSkill);
  } catch (error) {
    res.status(500).json({ message: "Error updating skill" });
  }
});

// Delete student's skill
router.delete("/:skillId", auth, async (req, res) => {
  try {
    await UserSkill.findOneAndDelete({
      user: req.user._id,
      skill: req.params.skillId,
    });
    res.json({ message: "Skill removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing skill" });
  }
});

module.exports = router;
