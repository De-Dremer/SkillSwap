const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

router.get('/matches',authenticateToken,async (req,res)=>{
    const userEmail = req.user.email ; 
    try{
        const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userEmail]);
        const userId = userResult.rows[0].id;
        const offered = await pool.query('SELECT name FROM skills WHERE user_id = $1', [userId]);
        const desired = await pool.query('SELECT skill_name FROM desired_skills WHERE user_id = $1', [userId]);
        const offeredSkills = offered.rows.map(s => s.name.toLowerCase());
        const desiredSkills = desired.rows.map(s => s.skill_name.toLowerCase());
        
        const matches = await pool.query(`
        SELECT 
            u.name AS user_name,
            s.name AS their_offered_skill,
            ds.skill_name AS their_desired_skill
        FROM users u
        JOIN skills s ON u.id = s.user_id
        JOIN desired_skills ds ON u.id = ds.user_id
        WHERE
            u.id != $1 AND
            s.name ILIKE ANY($2) AND
            ds.skill_name ILIKE ANY($3)
        `, [userId, desiredSkills, offeredSkills]);
        console.log('matches.rows:', matches.rows);
        res.json(matches.rows);
    }    
    catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error matching users' });
  }
});

module.exports = router ;
