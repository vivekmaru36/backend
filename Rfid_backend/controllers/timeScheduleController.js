const TimeSchedule = require("./../models/TimeSchedule");
const asyncHandler = require("express-async-handler");


// @desc Get TimeSchedule for everyone
// @route GET /TimeSchedulefor everyone
// @access Everyone
// Fy bsc cs
const getTimeScheduleE = async (req, res) => {
  const timeSchedule = await TimeSchedule.findOne({
    admin: '65f0248b6ad21562b5726b00',
  }).exec();
  if (!timeSchedule) {
    return res.status(404).json({
      message: `Time Schedule not found`,
    });
  }
  res.json(timeSchedule);
};

// @desc Get TimeSchedule for each Teacher
// @route GET /TimeSchedule
// @access Everyone
const getTimeSchedule = async (req, res) => {
  if (!req?.params?.teacher_id) {
    return res.status(400).json({ message: "ID Required" });
  }
  const timeSchedule = await TimeSchedule.findOne({
    admin: req.params.teacher_id,
  }).exec();
  if (!timeSchedule) {
    return res.status(404).json({
      message: `Time Schedule not found`,
    });
  }
  res.json(timeSchedule);
};

// @desc Add TimeSchedule
// @route POST /time_Schedule
// @access Private
// const addTimeSchedule = asyncHandler(async (req, res) => {
//   const { admin, data, Week, Year } = req.body;

//   // Confirm Data
//   if (!admin || !data || !Week || !Year) {
//     return res.status(400).json({ message: "Incomplete Request: Fields Missing" });
//   }

//   try {
//     // Check for Duplicates
//     const existingSchedule = await TimeSchedule.findOne({ admin });
//     if (existingSchedule) {
//       return res.status(409).json({ message: "Time Schedule already exists" });
//     }

//     console.log(data.schedule.monday[0].venue);

//     // Construct the time schedule object
//     const timeScheduleObj = {
//       admin,
//       schedule: {
//         monday: {
//           0: {
//             venue: data.schedule.monday[0] ? data.schedule.monday[0].venue : null,
//             teacher: data.schedule.monday[0] ? data.schedule.monday[0].teacher : null,
//             subject: data.schedule.monday[0] ? data.schedule.monday[0].subject : null
//           },
//           1: {
//             venue: data.schedule.monday[1] ? data.schedule.monday[1].venue : null,
//             teacher: data.schedule.monday[1] ? data.schedule.monday[1].teacher : null,
//             subject: data.schedule.monday[1] ? data.schedule.monday[1].subject : null
//           },
//           2: {
//             venue: data.schedule.monday[2] ? data.schedule.monday[2].venue : null,
//             teacher: data.schedule.monday[2] ? data.schedule.monday[2].teacher : null,
//             subject: data.schedule.monday[2] ? data.schedule.monday[2].subject : null
//           },
//           3: {
//             venue: data.schedule.monday[3] ? data.schedule.monday[3].venue : null,
//             teacher: data.schedule.monday[3] ? data.schedule.monday[3].teacher : null,
//             subject: data.schedule.monday[3] ? data.schedule.monday[3].subject : null
//           },
//           4: {
//             venue: data.schedule.monday[4] ? data.schedule.monday[4].venue : null,
//             teacher: data.schedule.monday[4] ? data.schedule.monday[4].teacher : null,
//             subject: data.schedule.monday[4] ? data.schedule.monday[4].subject : null
//           }
//         },
//         tuesday: {
//           // Repeat similar structure for tuesday
//           0: {
//             venue: data.schedule.tuesday[0] ? data.schedule.tuesday[0].venue : null,
//             teacher: data.schedule.tuesday[0] ? data.schedule.tuesday[0].teacher : null,
//             subject: data.schedule.tuesday[0] ? data.schedule.tuesday[0].subject : null
//           },
//           1: {
//             venue: data.schedule.tuesday[1] ? data.schedule.tuesday[1].venue : null,
//             teacher: data.schedule.tuesday[1] ? data.schedule.tuesday[1].teacher : null,
//             subject: data.schedule.tuesday[1] ? data.schedule.tuesday[1].subject : null
//           },
//           2: {
//             venue: data.schedule.tuesday[2] ? data.schedule.tuesday[2].venue : null,
//             teacher: data.schedule.tuesday[2] ? data.schedule.tuesday[2].teacher : null,
//             subject: data.schedule.tuesday[2] ? data.schedule.tuesday[2].subject : null
//           },
//           3: {
//             venue: data.schedule.tuesday[3] ? data.schedule.tuesday[3].venue : null,
//             teacher: data.schedule.tuesday[3] ? data.schedule.tuesday[3].teacher : null,
//             subject: data.schedule.tuesday[3] ? data.schedule.tuesday[3].subject : null
//           },
//           4: {
//             venue: data.schedule.tuesday[4] ? data.schedule.tuesday[4].venue : null,
//             teacher: data.schedule.tuesday[4] ? data.schedule.tuesday[4].teacher : null,
//             subject: data.schedule.tuesday[4] ? data.schedule.tuesday[4].subject : null
//           }
//         },
//         wednesday: {
//           // Repeat similar structure for wednesday
//         },
//         thursday: {
//           // Repeat similar structure for thursday
//         },
//         friday: {
//           // Repeat similar structure for friday
//         }
//       },
//       Week,
//       Year
//     };

//     // Create and Store New Time Schedule
//     const record = await TimeSchedule.create(timeScheduleObj);

//     if (record) {
//       return res.status(201).json({ message: `Time Schedule added successfully` });
//     } else {
//       return res.status(400).json({ message: "Failed to add time schedule" });
//     }
//   } catch (error) {
//     console.error("Error adding time schedule:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

const addTimeSchedule = asyncHandler(async (req, res) => {
  const { admin, data, Week, Year } = req.body;

  // Confirm Data
  if (!admin || !data || !Week || !Year) {
    return res.status(400).json({ message: "Incomplete Request: Fields Missing" });
  }

  try {
    // Check for Duplicates
    const existingSchedule = await TimeSchedule.findOne({ admin });
    if (existingSchedule) {
      return res.status(409).json({ message: "Time Schedule already exists" });
    }

    // Convert the schedule object to an array for each day
    // const convertedSchedule = {
    //   monday: Object.values(data.schedule.monday),
    //   tuesday: Object.values(data.schedule.tuesday),
    //   wednesday: Object.values(data.schedule.wednesday),
    //   thursday: Object.values(data.schedule.thursday),
    //   friday: Object.values(data.schedule.friday)
    // };

    const convertedSchedule = {
      monday: data.schedule.monday,
      tuesday: data.schedule.tuesday,
      wednesday: data.schedule.wednesday,
      thursday: data.schedule.thursday,
      friday: data.schedule.friday
    };

    // Construct the time schedule object
    const timeScheduleObj = {
      admin,
      // schedule: convertedSchedule,
      schedule: data.schedule,
      Week,
      Year
    };

    // Create and Store New Time Schedule
    const record = await TimeSchedule.create(timeScheduleObj);

    if (record) {
      return res.status(201).json({ message: `Time Schedule added successfully` });
    } else {
      return res.status(400).json({ message: "Failed to add time schedule" });
    }
  } catch (error) {
    console.error("Error adding time schedule:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});






// @desc Update TimeSchedule
// @route PATCH /TimeSchedule
// @access Private
const updateTimeSchedule = asyncHandler(async (req, res) => {
  const { teacher, schedule } = req.body;

  // Confirm Data
  if (!teacher || !schedule) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await TimeSchedule.findOne({ teacher: teacher }).exec();

  if (!record) {
    return res.status(404).json({ message: "Time Schedule doesn't exist" });
  }

  // // Check for duplicate
  // const duplicate = await TimeSchedule.findOne({
  //   teacher_id: req.params.teacher_id,
  // })
  //   .lean()
  //   .exec();

  // // Allow Updates to original
  // if (duplicate && duplicate?._id.toString() !== id) {
  //   return res.status(409).json({ message: "Duplicate Time Schedule" });
  // }

  record.schedule = schedule;

  const save = await record.save();
  if (save) {
    res.json({ message: `Time Schedule Updated` });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// @desc Delete TimeSchedule
// @route DELETE /time_schedule
// @access Private
const deleteTimeSchedule = asyncHandler(async (req, res) => {
  if (!req?.params?.teacher_id) {
    return res.status(400).json({ message: "ID Required" });
  }

  const record = await TimeSchedule.findById(req.params.teacher_id).exec();
  if (!record) {
    return res.status(404).json({ message: "Time Schedule not found" });
  }
  await record.deleteOne();
  res.json({ message: `Time Schedule deleted` });
});

module.exports = {
  getTimeSchedule,
  addTimeSchedule,
  updateTimeSchedule,
  deleteTimeSchedule,
  getTimeScheduleE
};
