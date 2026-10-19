// import asynHandler from "../utils/asynchandler.js"

// const register = asynHandler(async(req,res)=>{
//     res.status(200).json({
//         message:"Succesfully Register"
//     })
// })
// export {register}
import asynHandler from "../utils/asynchandler.js";

const register = asynHandler(async (req, res) => {
    // 🔍 ADD THIS LINE:
    console.log("🔥 CONTROLLER HIT! Request received at /register");

     res.status(200).json({
        message: "Succesfully Register"
    });
});

export { register };