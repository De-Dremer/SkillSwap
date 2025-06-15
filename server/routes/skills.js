const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

//NEW SKILL 
router.post('/',authenticateToken,async(req,res)=>{
    const {name,description} = req.body;
    const userEmail = req.user.email;
    try{
        const userResult = await pool.query('SELECT id FROM users WHERE email = $1',[userEmail]);
        const userId = userResult.rows[0].id;

        const result = await pool.query('INSERT INTO skills(user_id , name , description) VALUES($1,$2,$3) RETURNING *',[userId , name , description]);
        res.status(201).json(result.rows[0]);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to add skill"});
    }

});

//GET ALL SKILLS 
router.get('/',async (req,res)=>{
    try{
        const result = await pool.query('SELECT * FROM skills ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to get skills "});
    }
});

//GET SKILLS BY ID 
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM skills WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch skill' });
  }
});

//UPDATE SKILL
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const userEmail = req.user.email;

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userEmail]);
    const userId = userResult.rows[0].id;

    // Check ownership
    const checkSkill = await pool.query('SELECT * FROM skills WHERE id = $1 AND user_id = $2', [id, userId]);
    if (checkSkill.rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const result = await pool.query(
      'UPDATE skills SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

//DELETE SKILL
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userEmail = req.user.email;

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userEmail]);
    const userId = userResult.rows[0].id;

    //Check ownership
    const checkSkill = await pool.query('SELECT * FROM skills WHERE id = $1 AND user_id = $2', [id, userId]);
    if (checkSkill.rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await pool.query('DELETE FROM skills WHERE id = $1', [id]);
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

module.exports = router ; 