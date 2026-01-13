import Activity from "../models/Activity.js";

// GET /api/activity?type=invite_sent&page=1&limit=10
export const getTeamActivity = async (req, res) => {
  const { type, page = 1, limit = 10 } = req.query

  const query = {
    organization: req.user.organization,
  }

  if (type && type !== "all") {
    query.type = type
  }

  const skip = (page - 1) * limit

  const [logs, total] = await Promise.all([
    Activity.find(query)
      .populate("actor", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),

    Activity.countDocuments(query),
  ])

  res.json({
    logs,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    total,
  })
}
