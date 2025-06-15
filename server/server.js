const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require("./routes/auth");
const skillRoutes = require("./routes/skills");
const desiredSkillRoutes = require('./routes/desiredSkills.js');
const matchmakingRoutes = require('./routes/matchmaking.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/skills",skillRoutes);
app.use("/api/desired-skills",desiredSkillRoutes);
app.use("/api",matchmakingRoutes);

const db = require('./db');
const bcrypt = require('bcrypt');

app.get("/",(req,res)=>{
    res.send("Backend server working ");
});

app.get('/users', async (req,res)=>{
    try{
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post("/users",async (req,res)=>{
    const { name, email, password} = req.body ; 
    try{
        const saltRounds = 10;
        const hashedPassword =  await bcrypt.hash(password,saltRounds);
        const result = await db.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING * ',[name,email,hashedPassword]);
        const { password: _, ...userWithoutPassword } = result.rows[0];
        res.status(201).json(userWithoutPassword);
    }
    catch(err){
        console.error(err);
        res.status(500).send({ error: 'Failed to add user' });
    }
});



const PORT = process.env.PORT || 5000 ;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));