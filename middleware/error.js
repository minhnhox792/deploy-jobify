import { StatusCodes } from "http-status-codes";


export default function error(err, req, res , next){
    const defaultErr = {
        statusCode: err.statusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, try again later'
    }
    if(err.name === 'ValidationError'){
        defaultErr.statusCode = StatusCodes.BAD_REQUEST
        defaultErr.msg = Object.values(err.errors)
        .map(item => item.message)
        .join(',')
    }
    if(err.code && err.code === 11000){
        defaultErr.statusCode= StatusCodes.BAD_REQUEST
        defaultErr.msg = `${Object.keys(err.keyValue)} field has to be unique }`
    }
    res.status(defaultErr.statusCode).json({msg : defaultErr})
}
