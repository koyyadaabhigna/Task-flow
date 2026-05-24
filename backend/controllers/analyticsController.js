const Task = require('../models/Task');

const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ user: userId, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ user: userId, status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ user: userId, status: 'in-progress' });
    const overdueCount = await Task.countDocuments({
      user: userId,
      dueDate: { $lte: new Date() },
      status: { $ne: 'completed' },
    });

    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const completedOnTime = await Task.aggregate([
      {
        $match: {
          user: userId,
          status: 'completed',
          completedAt: { $ne: null },
        },
      },
      {
        $project: {
          onTime: {
            $cond: [
              {
                $or: [
                  { $eq: ['$dueDate', null] },
                  { $lte: ['$completedAt', '$dueDate'] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          onTimeCount: { $sum: '$onTime' },
        },
      },
    ]);

    const onTimeCompletionRate = completedTasks === 0
      ? 0
      : Math.round((completedOnTime[0]?.onTimeCount || 0) / completedTasks * 100);

    const avgCompletionResult = await Task.aggregate([
      {
        $match: {
          user: userId,
          status: 'completed',
          completedAt: { $ne: null },
        },
      },
      {
        $project: {
          diffDays: {
            $divide: [
              { $subtract: ['$completedAt', '$createdAt'] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgCompletionDays: { $avg: '$diffDays' },
        },
      },
    ]);

    const avgCompletionDays = avgCompletionResult[0]
      ? Number(avgCompletionResult[0].avgCompletionDays.toFixed(1))
      : 0;

    return res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      completionRate,
      overdueCount,
      avgCompletionDays,
      onTimeCompletionRate,
    });
  } catch (error) {
    next(error);
  }
};

const getWeekly = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 6);

    const createdRaw = await Task.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $project: {
          day: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
              timezone: 'UTC',
            },
          },
        },
      },
      {
        $group: {
          _id: '$day',
          count: { $sum: 1 },
        },
      },
    ]);

    const completedRaw = await Task.aggregate([
      {
        $match: {
          user: userId,
          completedAt: { $gte: startDate },
        },
      },
      {
        $project: {
          day: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$completedAt',
              timezone: 'UTC',
            },
          },
        },
      },
      {
        $group: {
          _id: '$day',
          count: { $sum: 1 },
        },
      },
    ]);

    const createdMap = createdRaw.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    const completedMap = completedRaw.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    const weekly = [];
    for (let i = 0; i < 7; i += 1) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      const dayKey = current.toISOString().slice(0, 10);
      const dayLabel = current.toLocaleDateString('en-US', { weekday: 'short' });
      weekly.push({
        day: dayLabel,
        created: createdMap[dayKey] || 0,
        completed: completedMap[dayKey] || 0,
      });
    }

    return res.json({ weekly });
  } catch (error) {
    next(error);
  }
};

const getPriority = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const priorityData = await Task.aggregate([
      {
        $match: { user: userId },
      },
      {
        $group: {
          _id: '$priority',
          value: { $sum: 1 },
        },
      },
    ]);

    const priorities = [
      { name: 'Urgent', key: 'urgent', color: '#f43f5e', value: 0 },
      { name: 'High', key: 'high', color: '#f59e0b', value: 0 },
      { name: 'Medium', key: 'medium', color: '#06b6d4', value: 0 },
      { name: 'Low', key: 'low', color: '#10b981', value: 0 },
    ];

    const priorityMap = priorityData.reduce((acc, item) => {
      acc[item._id] = item.value;
      return acc;
    }, {});

    const result = priorities.map((item) => ({
      name: item.name,
      value: priorityMap[item.key] || 0,
      color: item.color,
    }));

    return res.json({ priority: result });
  } catch (error) {
    next(error);
  }
};

const getMonthly = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 29);

    const monthlyRaw = await Task.aggregate([
      {
        $match: {
          user: userId,
          completedAt: { $gte: startDate },
        },
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$completedAt',
              timezone: 'UTC',
            },
          },
        },
      },
      {
        $group: {
          _id: '$date',
          completed: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const completedMap = monthlyRaw.reduce((acc, { _id, completed }) => {
      acc[_id] = completed;
      return acc;
    }, {});

    const monthly = [];
    for (let i = 0; i < 30; i += 1) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      const dateKey = current.toISOString().slice(0, 10);
      monthly.push({
        date: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: completedMap[dateKey] || 0,
      });
    }

    return res.json({ monthly });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getWeekly,
  getPriority,
  getMonthly,
};
