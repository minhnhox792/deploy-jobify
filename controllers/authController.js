import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
 
class CustomAPIError extends Error{
   constructor(message){
      super(message)
      this.statusCodes = StatusCodes.BAD_REQUEST
   }
}
class BadRequestError extends CustomAPIError{
   constructor(message){
      super(message)
      this.statusCodes = StatusCodes.BAD_REQUEST
   }
}
class NotFoundError extends CustomAPIError{
   constructor(message){
      super(message)
      this.statusCodes = StatusCodes.NOT_FOUND
   }
}
class UnauthenticatedError extends CustomAPIError{
   constructor(message){
      super(message)
      this.statusCodes = StatusCodes.UNAUTHORIZED
   }
}

const courseController = {
  login: async (req, res, next) => {
  

   try{
      const {email ,password} = req.body
      if(!email || !password){
        throw new BadRequestError('Please provide all values...')
      }
      const user = await User.findOne({email}).select('+password')
      if(!user){
         throw new UnauthenticatedError('Invalid Credentials...')
      }
      const result = await bcrypt.compare(password, user.password)

      if(!result){
         throw new UnauthenticatedError('Invalid Credentials...')
      }
      const token = user.createJWT()
      user.password = undefined
      return res.status(StatusCodes.OK).json({
         user,
         token,
         location: user.location
      })
   }
   catch(e){

      next(e)
   }
  },
  register: async (req, res, next) => {
  

   try{
      
      const {name, email ,password} = req.body
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      if(!name || !email || !password){
        throw new BadRequestError('Please provide all values...')
        
      }

      const check_email = await User.findOne({email})
      if(check_email){
         throw new BadRequestError('Email already exists...')
      }

      user.save();
      const token = user.createJWT()
      console.log("Create success", token);
      user[token] = token
      return res.send({user: user,token: token, location: user.location})
   }
   catch(e){
     
      next(e)
   }
  },
  updateUser: async (req, res) => {
   console.log("Go hereeeeeeeeeeeeeeeee")
    const {name, lastName, location} = req.body
    if(!name || !lastName || !location){
      throw new BadRequestError('Please provide all info')
    }
    const user = await User.findOne({_id : req.user.userId})
    if(!user){
      throw new BadRequestError('Not found user...')
    }
   //  user.name = name
   //  user.lastName = lastName
   //  user.location = location
   //  await user.save()
    const updated = await User.updateOne(
      { _id: req.user.userId },
      {
        $set: {
          name: name,
          lastName: lastName,
          location: location,
        },
      }
    )
    const user_new = await User.findOne({_id : req.user.userId})
    const token = user.createJWT()
    return res.send({user: user_new, token: token, location: user.location})
  },
};
export default courseController;
