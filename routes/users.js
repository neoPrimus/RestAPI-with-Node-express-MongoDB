const express = require("express");
const router = express.Router();
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { registrationValidation,loginValidation } = require("../validation/validation");

router.post("/registration", async (req,res)=>{

    const { error } = registrationValidation(req.body)
    if(error) return res.status(404).send(error.details[0].message)

    // const ifEmailExist = await User.findOne({email:req.body.email})
    // if(ifEmailExist) return res.status(400).send("Email is already exist.")

    // var salt = bcrypt.genSaltSync(10);
    // var hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // const user = new User({
    //     name : req.body.name,
    //     email : req.body.email,
    //     password : hashedPassword
    // })
    if(!error)try{
        const ifEmailExist = await User.findOne({email:req.body.email})
        if(ifEmailExist) return res.status(400).send("Email is already exist.")
    
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(req.body.password, salt);
    
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword
        })
        
        const savedUser = await user.save()
        res.send(savedUser)
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
    
    const { error } = loginValidation(req.body)
    if(error) {
        let LoginInputerr = ({
            status: 'false',
            message: error.details[0].message,
        })
        return res.status(404).send(LoginInputerr)  
    } 

    if(!error)try{

        User.findOne(conditions,async(err, user) => {
            if (err) {
                let LoginErr = ({
                    status: 'false',
                    message: err,
                })
                return res.status(404).send(LoginErr);
            }
            if (!user){
                let CredentialErr = ({
                    status: 'false',
                    message: "username or email doesnot match",
                })
                return res.status(403).send(CredentialErr);
            }
            const validPassword = await bcrypt.compare(req.body.password,user.password)
            if (!validPassword){
                let PasswordErr = ({
                    status: 'false',
                    message: "Password does not match",
                })
                return res.status(403).send(PasswordErr);
            } 
            // const id = Math.ceil(Math.random() * 9999999);
            const login_token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET/*,{ expiresIn: '60s' }*/)
            let Logindata = ({
                status: 'true',
                message: 'User sucessfully logged in',
                token:login_token,
                // id: id, 
                data: user
            })
            return res.status(200).send(Logindata)
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