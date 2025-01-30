const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { auth } = require("../middleware/auth");

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("keywords", "name")
      .populate("developers", "name");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// Get projects by keyword
router.get("/keyword/:keywordId", async (req, res) => {
  try {
    const projects = await Project.find({ keywords: req.params.keywordId })
      .populate("keywords", "name")
      .populate("developers", "name");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// Get student's projects
router.get("/student", auth, async (req, res) => {
  try {
    const projects = await Project.find({ developers: req.user._id })
      .populate("keywords", "name")
      .populate("developers", "name");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// Create new project
router.post("/", auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      developers: [req.user._id, ...(req.body.collaborators || [])],
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project" });
  }
});

// Update project
router.put("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      developers: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    Object.assign(project, req.body);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error updating project" });
  }
});

// Delete project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      developers: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project" });
  }
});

module.exports = router;
