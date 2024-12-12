const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    Firstname: { type: String, required: true },
    Lastname: { type: String, required: true },
    UserEmail: { type: String, required: true, unique: true },
    RoleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    Age: { type: Number, required: true },
    ContactNo: { type: String, required: true },
    CreatedBy: { type: String, required: true },
    UpdatedBy: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically adds `CreatedAt` and `UpdatedAt`
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
