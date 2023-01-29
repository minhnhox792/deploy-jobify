import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: [true, "Please provide name"],
    trim: true,
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 50,
    unique: true,
    required: [true, "Please provide email"],
    trim: true,
    validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email',
    },
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 50,
    required: [true, "Please provide password"],
    select : false
  },
  lastName: {
    type: String,
    trim: true,

    maxlength: 20,
    default: "lastName",
  },
  location: {
    type: String,
    trim: true,

    maxlength: 20,
    default: "my city",
  },
});
userSchema.pre('save', async function(){
    console.log(this.modifiedPaths())
    if(!this.isModified('password')) {
      console.log("Wil returnnnnnnn")
      return
    }
    var salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
})
userSchema.methods.createJWT = function(){
    
    return jwt.sign({userId : this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}
userSchema.methods.comparePassword = async function(userPassword){
  const isMatch = await bcrypt.compare(userPassword, this.password)
  return isMatch
}

export default mongoose.model("User", userSchema);
