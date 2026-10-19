// const asynHandler = (reqHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err))
//     }
// }
// export default asynHandler
// src/utils/asynchandler.js

const asynHandler = (reqHandler) => {
    return (req, res, next) => {
        // Ensures the asynchronous controller function is executed and errors are caught
        Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
    };
};

export default asynHandler;