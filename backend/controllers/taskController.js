const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            user: req.user._id
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const match = { user: req.user._id };
        const sort = {};

        // Search functionality
        if (req.query.search) {
            match.$text = { $search: req.query.search };
        }

        // Filter by priority
        if (req.query.priority) {
            match.priority = req.query.priority;
        }

        // Filter by date
        if (req.query.date) {
            match.deadline = {
                $gte: new Date(req.query.date),
                $lt: new Date(new Date(req.query.date).setDate(new Date(req.query.date).getDate() + 1))
            };
        }

        const tasks = await Task.find(match)
            .sort(sort)
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip));

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
