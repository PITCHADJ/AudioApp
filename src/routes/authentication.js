const express=require('express')
const router=express.Router()

const passport=require('passport')

router.post('/signin', (req,res,next)=>{
    passport.authenticate('local.signin',{
        successRedirect: '/pacientes',
        failureRedirect: '/',
        failureFlash: true
    })(req,res, next)
})

router.get('/logout',(req, res)=> {
    req.logout(function(err) {
        if (err) { return next(err); }
            res.redirect('/');
    });
})
module.exports =  router