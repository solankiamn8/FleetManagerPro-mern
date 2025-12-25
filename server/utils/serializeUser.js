// server/utils/serializeUser.js

export const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  role: user.role,
  emailVerified: user.emailVerified,
  phoneVerified: user.phone?.verified ?? false,
});
