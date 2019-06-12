const express = require("express");
const router = express.Router();
const User = require("../models/User")

router.post("/registration",async (req,res)=>{

    try{
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        })
        const savedUser = await user.save()
        .then(result=>{
            if(result){
                res.send(result)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    } catch(err){
        res.json({"err":err}).status(404)
    }
})

module.exports = router;