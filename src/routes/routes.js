const express=require('express')
const router=express.Router()

const {signUp,login,logout}=require('../controllers/userController')

router.post('/singup',signUp)
router.post('/login',login)
router.post('/logout',logout)

module.exports = router;