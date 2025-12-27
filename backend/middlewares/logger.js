export const logger = (req, res, next) => {
  // console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log("next exists?", typeof next);
  next(); // Let the request move forward
};
