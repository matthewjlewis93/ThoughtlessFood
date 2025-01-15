import FoodLog from "../models/log.model.js";

export const getAllLogs = async (req, res) => { // fetch all logs
    try {
        const logs = await FoodLog.find({});
        res.status(200).json({ success: true,  data: logs });
    } catch (error) {
        console.error(`Error fetching logs: ${error}`);
        res.status(500).json({ success: false, message: "Error fetchins logs." });
    }
};

export const getRangedLogs = async (req, res) => { // get logs based on date and time range as set in the url query
    const {date, range} = req.query;
    const dateObj = new Date(date);
    let firstDay = new Date(date);
    let lastDay = new Date(date);

    switch (range) {
        case "day":
            return res.status(200).json({ success: true, data: await FoodLog.find({ date: date }) });
        case "week":
            firstDay.setDate(firstDay.getDate() - (firstDay.getDay()-1));
            lastDay.setDate(firstDay.getDate() + 6 )
            break;
        case "month":
            firstDay.setDate(1);
            lastDay.setDate(
                new Date(firstDay.getFullYear(), firstDay.getMonth()+1, 0).getDate()
            )
            break;
        }    
    return res.status(200).json({ 
        success: true, 
        data: await FoodLog.find({ 
            date: { 
                $gte: `${firstDay.getFullYear()}-${firstDay.getMonth()+1}-${firstDay.getDate()}`, 
                $lte: `${lastDay.getFullYear()}-${lastDay.getMonth()+1}-${lastDay.getDate()}` }}) });
};

export const addNewLog = async (req, res) => { // add new log
    console.log(req.isAuthenticated())
    const newEntry = new FoodLog(req.body);
    try {
        await newEntry.save();
        res.status(200).json({ success: true, data: newEntry });
    } catch (error) {
        console.error(`Error in create log: ${error}`);
        res.status(500).json({ success: false, message: "Error adding log." })
    };
};

export const updateLogItem = async (req, res) => {
    const {id} = req.params;
    const log = req.body;

    try {
        const updatedLog = await FoodLog.findByIdAndUpdate(id, log, {new: true});
        res.status(200).json({ success: true, data: updatedLog });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating log." });
    };
};

export const deleteLogItem = async (req, res) => {
    const {id} = req.params;

    try {
        const logToDelete = await FoodLog.findByIdAndDelete(id);
        res.status(200).json({ success: true, data: logToDelete });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error delete log." });
    };
};