


const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const queries = require("../db/queries");
const pool = require("../db/pool");


const rules = [
  // lastName validation
  body("lastname")
    .trim()
    .notEmpty().withMessage("First name is required"),
    body("firstname")
    .trim()
    .notEmpty().withMessage("Last name is required"),

  // username validation
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required"),

  // password validation
  body("password")
    .notEmpty().withMessage("Password is required"),

    body("confirm_password").notEmpty().withMessage("Please confirm your password")
    .custom((value,{req})=>{
        if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
];

const secret_code = [
    body("secret_code").trim()
    .notEmpty().withMessage("Enter the code")
    .custom((value)=>{

        if(value!==process.env.SECRET_CODE){
            throw new Error("Wrong Code")
        }

        return true

    })
]


exports.index = async(req,res)=>{


    const messages = await queries.GET_MESSAGES();

    

    res.render("Home",{messages : messages})

}

exports.signup = async(req,res)=>{


    res.render("Sign_up", {errors:[]})

}

exports.signup_post = [rules,async(req,res)=>{

    const errors = validationResult(req).array()


    if (errors.length > 0) {
      return res.status(400).render("Sign_up", {
        errors: errors,
      });
    }


    const { firstname, lastname , username , password ,isAdmin } = req.body;

    const Admin = isAdmin === "on"

     try {
      const secured_password = await bcrypt.hash(password, 10);
      await queries.Add_User(firstname, lastname, username, secured_password,Admin);
      res.render("login" , {username : username , errors : []});
    } catch (err) {
      console.error(err);

      if (err.code === "23505") {
        // PostgreSQL unique_violation error code
        errors.push({ msg: "Username already exists" });
      }

      return res.status(400).render("Sign_up", { errors });
    }

}]


exports.premuim = async(req,res)=>{

    

    res.render("premuim",{username : "" , errors : []})

}

exports.premuim_post = [secret_code , async(req,res)=>{

    const error = validationResult(req).array()

    if(error.length >= 1){
        res.status(400).render("premuim",{username : req.user.username , errors : error})
    }
    else{

        await queries.Set_Membership(req.user.username)

        res.redirect("/")

    }

    

}]


exports.login = async(req,res)=>{


    res.render("login", {errors:[]})

}

exports.isAuthentificated = (req,res,next)=>{

    if(req.isAuthenticated()){
        return next()
    }
    else{
        res.redirect("/login"); 
    }
}

exports.message = async(req,res)=>{


    res.render("message" , {errors : []})

}



exports.message_post = async(req,res)=>{


    await queries.ADD_MESSAGE(req.body.title,req.body.text,req.user.id)

    res.redirect("/")
   

}


exports.delete_message = async(req,res)=>{


    console.log(req.body.msg_id)

    await queries.DELETE_MESSAGE(req.body.msg_id)

    res.redirect("/")
   
}
