var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator');
const User =require('../models/User')
const passport=require('passport');
const csrf=require('csurf');
router.use(csrf());
//const flash = require('connect-flash/lib/flash');

/* GET users listing. */
router.get('/signup', isNotSignIn,function(req, res, next) {
  var messErorr=req.flash('signUpError');
  res.render('user/signup',{massages: messErorr,token:req.csrfToken()});
});

router.post('/signup',[
  check('email').not().isEmpty().withMessage('please enter  email'),
  check('email').isEmail().withMessage('please enter your valid email'),
  check('password').not().isEmpty().withMessage('please enter your password'),
  check('password').isLength({min:5}).withMessage('please enter password more than 5 char'),
  check('confirm').custom((value,{req})=>{
    if(value !==req.body.password){
      throw new Error('password and confirm not matched')
    }
    return true;
  })

],(req,res,next)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    var validationErrors=[];
    for(var i=0;i<errors.errors.length;i++){
      validationErrors.push(errors.errors[i].msg);
    }
    req.flash('signUpError',validationErrors);
    res.redirect('signup')
    console.log(validationErrors);

    return ;
  }
    
  next();

},

passport.authenticate('local-signUP',{
  session:false,
  successRedirect:'profile',
  failureRedirect:'signup',
  failureFlash:true,
})

)

router.get('/profile',isSignIn,(req,res,next)=>{
  if (req.user.cart) {
    totalProdcuts=req.user.cart.totalQuantity;
  }
  else{
    totalProdcuts=0;
  }
  res.render('user/profile',{cheackUser:true,cheackProfile:true,totalProdcuts:totalProdcuts});
});

router.get('/signin',isNotSignIn,(req,res,next)=>{
  var messErorr=req.flash('signInError')
  console.log(req.csrfToken());
  res.render('user/signin',{massages:messErorr,token:req.csrfToken()});
});
router.post('/signin',[
  check('email').not().isEmpty().withMessage('please enter  email'),
  check('email').isEmail().withMessage('please enter your valid email'),
  check('password').not().isEmpty().withMessage('please enter your password'),
  check('password').isLength({min:5}).withMessage('please enter password more than 5 char'),

],(req,res,next)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    var validationErrors=[];
    for(var i=0;i<errors.errors.length;i++){
      validationErrors.push(errors.errors[i].msg);
    }
    req.flash('signInError',validationErrors);
    res.redirect('signin')
    console.log(validationErrors);

    return ;
  }
   next();
},
passport.authenticate('local-signin',{
  // use default sesstion :trye
  //sesstion have two function serialize and deserilaize
  //serialize push id_Uesr to sesstion,deserilaize push object from user to session
  // this cause problem security
  successRedirect:'profile',
  failureRedirect:'signin',
  failureFlash:true,
}));

router.get('/logout',isSignIn,function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
function isSignIn(req,res,next) {
  if(!req.isAuthenticated()){
    res.redirect('signin');
    return;
  }
  next();
}

function isNotSignIn(req,res,next) {
  if(req.isAuthenticated()){
    res.redirect('/');
    return;
  }
  next();
}
module.exports = router;
