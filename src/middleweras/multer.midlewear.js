import multer from "multer";
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/temp")
    },
filename:function(req,file,cb){
    const unqiuSuffix = Date.now()+"-"+Math.round(Math.random()*1E9)
cb(null,file.fieldname +"-"+unqiuSuffix)
}
})
export const upload = multer({
    storage,
})