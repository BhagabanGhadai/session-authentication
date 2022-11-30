const userModel = require("../models/userModel");
const validator = require('../validation/validator');
const limitModel = require("../models/limitModel");


/******************************************************Sign Up*************************************************** */
const signUp = async function (req, res) {
    try {
        let userData = req.body

        const { name, phone, email, password } = userData;

        if (!validator.isValidRequestBody(userData)) {
            return res.status(400).send({ status: false, message: "Please enter Valid User Details" })
        }
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: "Enter Your Name" })
        }
        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, message: "Enter Your phoneNumber" });
        }

        if (!validator.isValidNumber(phone)) {
            return res.status(400).send({ status: false, message: "please enter a valid phoneNumber" });
        }

        let isPhoneNumberUnique = await userModel.findOne({ phone })

        if (isPhoneNumberUnique) {
            return res.status(400).send({ status: false, message: "phoneNumber is already exist,please try another" });
        }

        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Enter Your email Id" });
        }

        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "emailId is invalid,enter Correct email Address" });
        }

        let isEmailUnique = await userModel.findOne({ email })

        if (isEmailUnique) {
            return res.status(400).send({ status: false, message: "email-Id is already exist,please try another" });
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "Enter Your Password" });
        }

        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "password must be 8-15 characters" });
        }

        let createUser = await userModel.create(userData)
        return res.status(201).send({ status: true, message: "SignUp Successful", data: createUser });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


/**********************************************************LogIn********************************************************/

const login = async function (req, res) {
    try {
        if (req.session.userId) {
            return res.status(200).send({ status: false, message: "you are alreday loggedIn" })
        }
        let loginDetails = req.body

        const { email, password } = loginDetails

        if (!validator.isValidRequestBody(loginDetails)) {
            return res.status(400).send({ status: false, message: "Please enter Valid User Details" })
        }
        
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Enter Your email Id" });
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "Enter Your Password" });
        }

        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "emailId is invalid,enter Correct email Address" });
        }
        const limitDevide=await limitModel.find(loginDetails)

        if(limitDevide.length===1){
            return res.status(400).send({ status: false, message: "exceeded!!you can login for single device" });
        }
        const findUserFromDB = await userModel.findOne({email})

        if (!findUserFromDB) {
            return res.status(404).send({ status: false, message: "No User Found" });
        }
        if(findUserFromDB.loginAttempts==3&&new Date-findUserFromDB.lockedAt>3600000){
            await userModel.findOneAndUpdate({_id:findUserFromDB._id},
                {$set:{lockedAt:Date.now(),loginAttempts:0}},
                {new:true})
        }
        if(findUserFromDB.loginAttempts==3) {
            await userModel.findOneAndUpdate({_id:findUserFromDB._id},
                {$set:{lockedAt:Date.now()}},
                {new:true})
                return res.status(400).send({ msg: 'You have exceeded the maximum number of login attempts!!try after 1 hour' })
            }
 

        if(findUserFromDB.password!==password){
          await userModel.findOneAndUpdate({_id:findUserFromDB._id},
            {$inc:{loginAttempts:1}},
            {new:true})
                return res.status(400).send({ status: false, message: "You have Entered Wrong Password" });
        }
        req.session.userId = findUserFromDB._id.toString()

        loginDetails.userId=req.session.userId

         await limitModel.create(loginDetails)

        return res.status(200).send({ status: true, message: "login sucessfull" })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: "Error", error: error.message })
    }
}

/********************************************************LogOut***************************************************/

const logout = async function (req, res) {
    try {
        if (!req.session.userId) {
            return res.status(200).send({ status: false, message: 'you are already logged out' })
        }
        await limitModel.findOneAndDelete({userId:req.session.userId})
        delete req.session.userId
        return res.status(302).send({ status: true, message: "logout successful" })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: "Error", error: error.message })
    }
}
module.exports = { signUp, login, logout }