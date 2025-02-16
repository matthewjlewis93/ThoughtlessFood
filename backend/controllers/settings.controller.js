import userData from "../models/users.model.js";

export const getSettings = async (req, res) => {
  try {
    const settings = await userData.find({ _id: req.body.userID });
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error(`Error fetching user settings: ${error}`);
    res
      .status(200)
      .json({ success: false, message: "Error fetching settings." });
  }
};

export const updateSettings = async (req, res) => {
  const { setting } = req.params;
  const newSetting = req.body;

  try {
    const updatedSettings = await userData.findByIdAndUpdate(
      newSetting.userID,
      newSetting,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedSettings });
  } catch (error) {
    res
      .status(200)
      .json({ success: false, message: "Error updating settings." });
  }
};
