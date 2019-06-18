const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.json({status:"rohanAPI",result:"ok"})
})

router.use(function timeLog (req, res, next) {
    console.log('Time: ',new Date(Date.now()))
    console.log(req.method+" via "+req.originalUrl)
    next()
  })

const postRoutes = require("./posts");
router.use("/post",postRoutes)

const authRoutes = require("./users")
router.use("/user",authRoutes);


module.exports = router;