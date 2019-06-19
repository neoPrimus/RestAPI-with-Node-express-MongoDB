const jwt = require("jsonwebtoken")

function TokenAuthentication(req,res,next){
    const token = req.header('Authorization')
    if(!token) return res.status(401).send("Access_Denied")
    
    try{
        const VerifyToken = jwt.verify(token,process.env.TOKEN_SECRET)
        req.user = VerifyToken; //find the cause of the line or you can comment this line
        next();
    }catch(err){
        return res.status(400).send('Invalid Token')
    }
}

module.exports.TokenAuthentication = TokenAuthentication;