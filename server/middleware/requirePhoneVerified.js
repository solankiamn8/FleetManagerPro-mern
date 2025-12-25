export const requirePhoneVerified = (req, res, next) => {
  if (!req.user.phone?.verified) {
    return res.status(403).json({
      message: "Phone verification required to access this feature",
    });
  }
  next();
};
