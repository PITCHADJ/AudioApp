
const bcrypt= require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async(password) => {
    const salt=await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password,salt)
    return passHash;
}

helpers.matchPassword = async (password, dbpassword) =>{
    try{
       return await bcrypt.compare(password, dbpassword) 
    }catch(e){
        console.log(e)
    }
}

module.exports = helpers