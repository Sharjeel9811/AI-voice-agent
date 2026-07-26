import mongoose from 'mongoose';


const UserSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:
{
type:String,
required:true,
unique:true
},
assistantName:
{
    type:String,
    default:"Shifra"
},
businessName:{
    type:String,
    default:""

},
businnesstype:{
    type:String,
    default:''
},
businessdescription:{
    type:String,
    default:''
},
tone:{
    type:String,
    enum:['professional','friendly','Sales'],
    default:"friendly"
},
theme:{
    type:String,
    enum:['dark','light','glass','neon'],
    default:"dark"
},
enablevoice:{
    type:Boolean,
    default:true
}
,
plan:{
    type:String,
    enum:['free','premium','enterprise'],
    default:"free"

}
,


},{timestamps:true});


const UserModel=mongoose.model('users',UserSchema);

export default UserModel;

