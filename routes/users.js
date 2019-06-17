const express = require("express");
const router = express.Router();
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const { registrationValidation } = require("../validation/validation");
// const loginValidation = require("../validation/validation").loginValidation;

router.post("/registration", async (req,res)=>{

    const { err } = registrationValidation(req.body)
    if(err) return res.status(404).send(err.details[0].message)

    const ifEmailExist = await User.findOne({email:req.body.email})
    if(ifEmailExist) return res.status(400).send("Email is already exist.")

    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword
    })

    try{
        const savedUser = await user.save()
        res.send(savedUser)
        // .then(result=>{
        //     if(result){
        //         res.send(result)
        //     }
        // })
        // .catch(err=>{
        //     console.log(err)
        // })
    } catch(err){
        res.json({"err":err}).status(404)
    }
})

//Login
router.post("/login",async (req,res)=>{

    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    })

    let conditions = !!user.name ? {name: user.name} : {email: user.email};

    try{
        const { err } = registrationValidation(req.body)
        if(err) return res.status(404).send(err.details[0].message)

        User.findOne(conditions,async(err, user) => {
            if (err)   return res.status(404).send(err);
            if (!user) return res.status(403).send("username or email doesnot match");
            const validPassword = await bcrypt.compare(req.body.password,user.password)
            if (!validPassword) return res.status(403).send("Password does not match");
            res.send(user)
          })

        // const useremail = await User.findOne({email:req.body.email}) //considering email is unique
        // if(!userwithEmail) return res.status(400).send("Email does not exist")
        
        // const username = await User.findOne({name:req.body.name})
        // if(!ifUserExist) return res.status(400).send("username does not exist")
    }catch(err){
        console.log(err)
    }
})

module.exports = router;