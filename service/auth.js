// const sessionIdToUserMap=new Map();
const jwt=require("jsonwebtoken");
const secret="Piyush123@$";
function setUser(user){
    // sessionIdToUserMap.set(id,user);
    // const payload={
    //     ...user,
    // };
    return jwt.sign({
        _id:user._id,
        email:user.email,
        role:user.role,
    },secret);
}
function getUser(token){
    // return sessionIdToUserMap.get(id);
    if(!token) return null;
    try{
       return jwt.verify(token,secret); 
    }catch(error){
        return null;
    }
    
}
module.exports={
    setUser,
    getUser,
}