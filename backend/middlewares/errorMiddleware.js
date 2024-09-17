const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  //3 params-req,res,next->when this logic is complete we go to the nxt logic\


  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };
  //if it is not notFound errorhandler is called ->returns the statuscode and the msg
  
  module.exports = { notFound, errorHandler };
  