// utils/serializeUser.js
export const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  emailVerified: user.emailVerified,
  phoneVerified: user.phone?.verified ?? false,

  organization: user.organization
    ? {
        id: user.organization._id,
        name: user.organization.name,
        owner: user.organization.owner,
        status: user.organization.status,
      }
    : null,
});
