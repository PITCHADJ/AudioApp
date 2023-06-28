const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy
const pool = require('../database')
const helpers =require ('./helpers')

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},async(req,username, password, done)=>{
    //console.log(req.body)
    //console.log(username)
    //console.log(password)
    const rows=await pool.query('SELECT * FROM usuario WHERE email=?',[username])
    console.log(rows)
    if(rows.length > 0){
        const user= rows[0]
        //let passh=helpers.encryptPassword(password)
        console.log(password, user.pass)
        if(user.active==1){
            const validPassword =await helpers.matchPassword(password,user.pass)
            console.log(validPassword)
            if(validPassword){
                done(null, user, req.flash('success','Hola '+ user.nombre))
            }else{
                done(null, false, req.flash('error','Usuario o contraseña no válidos'))
            }
        }else{
            done(null, false, req.flash('error','Usuario bloqueado o inactivo'))
        }
        
    }else{
        return done(null,false, req.flash('error','Usuario o contraseña no válidos'))
    }


}))

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},async(req,username, password, done)=>{
    console.log(req.body);

}))

passport.serializeUser((user,done)=>{
    done(null, user.id);
})

passport.deserializeUser(async(id, done)=>{
   const rows = await pool.query('SELECT * FROM usuario WHERE id=?', [id])
   //console.log(rows) 
   done(null, rows[0])
})