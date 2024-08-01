const express = require('express');

const router = express.Router();
const {
    doesUserExist,
    login,
    signUp
} = require('../../controllers/user');

router.post("/signout", (req, res) => {
    req.session.destroy()
    res.status(200).json({})
})

router.post("/signup", async (req, res) => {
    if(!req.body.id){
        return res.status(400).json({error: "Must supply id", code: 1})
    }
    if(!req.body.name){
        return res.status(400).json({error: "Must supply name", code: 2})
    }
    if(!req.body.password){
        return res.status(400).json({error: "Must supply password", code: 3})
    }
    const user = await signUp(req.body.id, req.body.name,  req.body.password)
    if(user){
        req.session.user = user
        return res.status(201).json(user)
    }else  {
        return res.status(400).json({error: "failed to signup", code: 4})
    }
})

router.post("/login", async (req, res) => {
    if(!req.body.id){
        return res.status(400).json({error: "Must supply id", code: 1})
    }
    if(!req.body.password){
        return res.status(400).json({error: "Must supply password", code: 2})
    }
    const user = await login(req.body.id, req.body.password)
    if(user){
        req.session.user = user
        console.log('req',req.session.cookie)
        return res.status(201).json(user)
    }else  {
        return res.status(400).json({error: "failed to login", code: 3})
    }
})

module.exports = router;