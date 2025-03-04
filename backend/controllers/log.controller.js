import FoodLog from "../models/log.model.js";

export const getAllLogs = async (req, res) => {
  // fetch all logs

  try {
    const logs = await FoodLog.find({ userID: req.body.userID });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error(`Error fetching logs: ${error}`);
    res.status(500).json({ success: false, message: "Error fetching logs." });
  }
};

export const getRangedLogs = async (req, res) => {
  // get logs based on date and time range as set in the url query
  const { date, range } = req.query;
  const [year, month, day] = date.split("-").map((e) => Number(e));
  let firstDay = new Date(year, month - 1, day);
  let lastDay = new Date(year, month - 1, day);
  let returnedFoods;

  switch (range) {
    case "day":
      return res.status(200).json({
        success: true,
        data: await FoodLog.find({ userID: req.body.userID, date: date }),
      });
    case "week":
      firstDay.setDate(firstDay.getDate() - (firstDay.getDay() - 1));
      lastDay.setDate(firstDay.getDate() + 6);
      break;
    case "month":
      firstDay.setDate(0);
      lastDay.setDate(new Date(year, month, -1).getDate() + 1);
      returnedFoods = await FoodLog.find({
        userID: req.body.userID,
        date: {
          $gt: firstDay,
          $lte: lastDay,
        },
      });
      break;
  }

  return res.status(200).json({
    success: true,
    data: returnedFoods.length !== 0 ? returnedFoods : [{message: "no foods found for month", date: lastDay}],
  });
};

export const addNewLog = async (req, res) => {
  // add new log
  const newEntry = new FoodLog(req.body);
  try {
    await newEntry.save();
    res.status(200).json({ success: true, data: newEntry });
  } catch (error) {
    console.error(`Error in create log: ${error}`);
    res.status(500).json({ success: false, message: "Error adding log." });
  }
};

export const updateLogItem = async (req, res) => {
  const { id } = req.params;
  const log = req.body;

  try {
    const updatedLog = await FoodLog.findByIdAndUpdate(id, log, { new: true });
    res.status(200).json({ success: true, data: updatedLog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating log." });
  }
};

export const deleteLogItem = async (req, res) => {
  const { id } = req.params;

  try {
    const logToDelete = await FoodLog.findByIdAndDelete(id);
    res.status(200).json({ success: true, data: logToDelete });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error delete log." });
  }
};
