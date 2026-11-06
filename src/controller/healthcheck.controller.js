import {apierror} from "../utils/ApiError.js"
import {apiResponse} from "../utils/apiresponse.js"
import asyncHandler from "../utils/asynchandler.js"

const healthcheck = asyncHandler(async(req,res)=>{
return res.status(200)
.json(new apiResponse(200,"health is normal"))
})


export {
    healthcheck
}