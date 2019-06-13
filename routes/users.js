const express = require("express");
const router = express.Router();
const User = require("../models/User")
const {registrationValidation} = require("../validation/validation")


router.post("/registration", async (req,res)=>{

    const { err } = registrationValidation(req.body)
    if(err) return res.status(404).send(err.details[0].message)

    try{
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        })
        const savedUser = await user.save()
        .then(result=>{
            if(result){
                res.send(savedUser)
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