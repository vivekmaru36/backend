const AdminModel = require("./../models/Admin_model");
const asyncHandler = require("express-async-handler");


const getAdmin = asyncHandler(async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ message: "ID Missing" });
  
    const student = await AdminModel.findById(req.params.id)
      .select("-password")
      .exec();
    if (!student) {
      return res.status(400).json({ message: "Admin Not Found." });
    }
    res.json(student);
  });

module.exports = {
  getAdmin
};
  