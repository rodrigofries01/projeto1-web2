//listar / add keywords


const express = require('express');
const router = express.Router();
const { Skill, UserSkill } = require('../models/Skill');

// Get knowledge report
router.get('/report', async (req, res) => {
  try {
    const skills = await Skill.find();
    const report = await Promise.all(
      skills.map(async (skill) => {
        const userSkills = await UserSkill.find({ skill: skill._id });
        const totalUsers = userSkills.length;
        const totalLevel = userSkills.reduce((sum, us) => sum + us.level, 0);
        const averageLevel = totalUsers > 0 ? (totalLevel / totalUsers).toFixed(1) : 0;

        return {
          skill: skill.name,
          totalUsers,
          averageLevel: parseFloat(averageLevel)
        };
      })
    );

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating report' });
  }
});

module.exports = router;
