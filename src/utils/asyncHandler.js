const asyncHandler=(requesthandler) =>{
    (req,res,next)=>{
        Promise.resolve(req,res,next)
        .catch((err)=>next(err));
    };
};


//error classin nodejs

export {asyncHandler};




// const asyncHandler=()=>{}
// const asyncHandler=(func)=>asynch () => {}
// const asyncHandler= (fn)=>()=>{}


 //this is  try catch method
// const asyncHandler =(fn) => async (req,res,next) =>{
//     try{
//         await fn(req,res,next)
//     }catch(error){
//         res.status(error.code ||500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
