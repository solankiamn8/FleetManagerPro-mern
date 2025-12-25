import Alert from "../models/Alert.js";

export const getAlerts = async (req, res) => {
  const alerts = await Alert.find()
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(alerts);
};

export const markAlertResolved = async (req, res) => {
  const { id } = req.params;

  const alert = await Alert.findById(id);
  if (!alert) {
    return res.status(404).json({ message: "Alert not found" });
  }

  alert.resolved = true;
  await alert.save();

  res.json({ message: "Alert resolved" });
};
