const express = require("express");
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

router.post('/',authenticateToken,async(req,res)=>{
    const {skill_name} = req.body;
    const userEmail = req.user.email ; 
    try{
        const userResult = await pool.query('SELECT id FROM users WHERE email =$1',[userEmail]);
        const userId = userResult.rows[0].id;

        const result = await pool.query('INSERT INTO desired_skills (user_id,skill_name) VALUES ($1,$2) RETURNING *',[userId, skill_name]);
        res.status(201).json(result.rows[0]);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'Failed to add desired skill '});
    }

});

router.get('/', authenticateToken, async (req, res) => {
  const userEmail = req.user.email;

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userEmail]);
    const userId = userResult.rows[0].id;

    const result = await pool.query('SELECT * FROM desired_skills WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch desired skills' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userEmail = req.user.email;

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userEmail]);
    const userId = userResult.rows[0].id;

    const skillResult = await pool.query('SELECT * FROM desired_skills WHERE id = $1 AND user_id = $2', [id, userId]);
    if (skillResult.rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized or skill not found' });
    }

    await pool.query('DELETE FROM desired_skills WHERE id = $1', [id]);
    res.json({ message: 'Desired skill deleted successfully' });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: 'Failed to delete desired skill' });
  }
});

module.exports = router;