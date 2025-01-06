const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  RoleId: { type: Number, required: true, unique: true },
  RoleName: { type: String, required: true },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
