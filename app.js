const express = require("express")
const flash = require("connect-flash");
const app = express()
const bcrypt = require("bcryptjs"); //
const path = require("node:path");

const global = require("./Controllers/global")


const session = require("express-session");
const passport = require("passport");
const pool = require("./db/pool");
const LocalStrategy = require('passport-local').Strategy;

app.set("views", path.join(__dirname, "views")); //look in the /views folder when facing ESJ files (view)
app.set("view engine", "ejs"); //use ESJ
app.use(express.urlencoded({ extended: true }));
app.use(flash());

app.use(session({ secret: "cats", resave: false, saveUninitialized: false })); 
app.use(passport.session()); 

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user; // Passport sets req.user if authenticated
  
  next();
});

passport.use(
    new LocalStrategy(async(username,password,done)=>{
        
        const {rows} = await pool.query('SELECT * from "User" Where username = $1',[username]);

        const user  = rows[0]

        

        if (!user){
                    return done(null, false, { message: "Incorrect username" });
        }

        const match = await bcrypt.compare(password,user.password)
        if(!match){
            return done(null, false, { message: "Incorrect password" });
        }

        return done(null,user)


    })
)


passport.serializeUser((user,done)=>{

    done(null,user.id)

})

passport.deserializeUser(async(id,done)=>{

    const {rows} = await pool.query('Select * from "User" where id = $1 ',[id])

    const user = rows[0]

    return done(null,user)

})

app.get("/",global.index)


app.get("/signup",global.signup)


app.post("/signup",global.signup_post)

//app.get("/premuim",global.premuim)

app.post("/premuim",global.premuim_post)

app.get("/premuim",global.isAuthentificated,global.premuim)



app.get("/login",global.login)


app.post("/login",

    passport.authenticate("local",{
        successRedirect : "/premuim",
        failureRedirect : "login",
        failureFlash: true
    })

)



app.get("/new_msg",global.isAuthentificated,global.message)

app.post("/new_msg",global.message_post)

app.post("/delete_message",global.delete_message)





app.listen(3000,()=>{
    console.log("listening")
})