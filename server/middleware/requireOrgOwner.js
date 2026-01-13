// import Organization from "../models/Organization";

// export const requireOrgOwner = async (req, res, next) => {
//   const org = await Organization.findById(req.user.organization);
//   if (!org || !org.owner.equals(req.user.id)) {
//     return res.status(403).json({ message: "Only owner allowed" });
//   }
//   next();
// };
