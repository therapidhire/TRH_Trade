const mongoose = require("mongoose");

const companyMasterSchema = new mongoose.Schema({
  roleId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  roleDescription: {
    type: String,
    required: true,
    maxlength: 255,
  },
  seqNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

companyMasterSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const CompanyMasterTable = mongoose.model(
  "CompanyMasterTable",
  companyMasterSchema
);

module.exports = CompanyMasterTable;
