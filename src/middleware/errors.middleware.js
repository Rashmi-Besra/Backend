import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  console.log("🔥 GLOBAL ERROR MIDDLEWARE HIT 🔥");
  console.log("ERROR TYPE:", typeof err);
  console.log("ERROR INSTANCEOF Error:", err instanceof Error);
  console.log("ERROR CONTENT:", err);

  res.status(500).json({
    success: false,
    message: err?.message || "Unknown error",
  });
};

export { errorHandler };


// const errorHandler = (err, req, res, next) => {
//   let statusCode = err.statusCode || 500;
//   let message = err.message || "Internal Server Error";

//   if (err instanceof ApiError) {
//     return res.status(statusCode).json({
//       success: false,
//       message,
//       errors: err.errors || [],
//     });
//   }

//   return res.status(statusCode).json({
//     success: false,
//     message,
//   });
// };

