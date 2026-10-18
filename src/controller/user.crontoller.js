import asynHandler from "../utils/asynchandler.js"

const register = asynHandler(async(req,res)=>{
   return res.status(200).json({
        message:"Succesfully Register"
    })
})
export {register}