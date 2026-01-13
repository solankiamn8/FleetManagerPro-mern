import Activity from "../models/Activity.js"

export const logActivity = async ({
  organization,
  actor,
  type,
  targetEmail,
  targetUser,
  meta,
}) => {
  await Activity.create({
    organization,
    actor,
    type,
    targetEmail,
    targetUser,
    meta,
  })
}
