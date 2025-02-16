import userData from "../models/users.model";

export const getSettings = async (req, res) => {
  try {
    const settings = await userData.find({ userID: req.body.userID });
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error(`Error fetching user settings: ${error}`);
    res
      .status(200)
      .json({ success: false, message: "Error fetching settings." });
  }
};

export const updateSettings = async (req, res) => {
  const { id } = req.params;
  const newSetting = req.body;

  try {
    const updatedSettings = await userData.findByIdAndUpdate(id, newSetting, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedSettings });
  } catch (error) {
    res
      .status(200)
      .json({ success: false, message: "Error updating settings." });
  }
};
