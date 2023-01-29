import jwt from 'jsonwebtoken'
import { token } from 'morgan'
import {StatusCodes} from'http-status-codes'
class CustomAPIError extends Error{
    constructor(message){
       super(message)
       this.statusCodes = StatusCodes.BAD_REQUEST
    }
 }

 class UnauthenticatedError extends CustomAPIError{
    constructor(message){
       super(message)
       this.statusCodes = StatusCodes.UNAUTHORIZED
    }
 }
  
export default async function(req,res, next){
    const token_bearer = req.headers.authorization
    
    if(!token_bearer || !token_bearer.startsWith('Bearer')){
        throw new UnauthenticatedError('Not authenication...')
    }
    const userToken = token_bearer.split(' ')[1]
    try{
        console.log(jwt.verify(userToken, process.env.JWT_SECRET))
        const payload = jwt.verify(userToken, process.env.JWT_SECRET)
        
        req.user = {
            userId: payload.userId
        }
        next()
    }
    catch(e){
        throw new UnauthenticatedError('Not authenication...')
    }
} 