const passport=require('passport');
const localStrategy=require('passport-local').Strategy;
const User =require('../models/User');
const Cart=require('../models/Cart');
passport.serializeUser((user,done)=>{
    return done(null,user.id);
});
passport.deserializeUser((id,done)=>{
    User.findById(id,('email'),(err,user)=>{
        Cart.findById(id,(error,cart)=>{
        if(!cart){
            return done(error,user)
        }
        user.cart=cart;
        return done(error,user);
        })
    })
})

passport.use('local-signin',new localStrategy({
 usernameField  : 'email',
 passwordField : 'password',
passReqToCallback:'true',
},
(req,email,password,done)=>{
User.findOne({email: email},(err,user)=>{
if(err){
    return done (err)
}
if(!user){
    return done(null,false,req.flash('signInError','this user not found'))
}
console.log(user);
if(!user.comparePassword(password)){
    return done(null,false,req.flash('signInError','wrong password'))

}
return done(null,user)
}
)
}))




passport.use('local-signUP',new localStrategy({
    usernameField  : 'email',
    passwordField : 'password',
   passReqToCallback:'true',
   },
   (req,email,password,done)=>{
   User.findOne({email: email},(err,user)=>{
   if(err){
       return done (err)
   }
   if(user){
       return done(null,false,req.flash('signUpError','this user already exist'))
   }
   console.log(user);
   const userSinUp=new User({
    email:email,
    password:new User().hashPassword(password)
   })
   userSinUp.save((err,user)=>{
     if(err)
     {
        return done(err);
     }
     return done(null,user)
   })
   
   })
   }))