import jwt from 'jsonwebtoken';


export const GenerateToken=(id)=>{
   try {
     const token= jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1d'});
    return token;
   } catch (error) {
    throw new Error("Error generating token");
   }
} 