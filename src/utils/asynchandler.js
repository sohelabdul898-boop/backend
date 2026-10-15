const asynHandler = (reqHandler)=>{
(req,res,next)=>{
    Promise.resolve(req,res,next).catch((err)=> next(err))
}
}
export {asynHandler}
