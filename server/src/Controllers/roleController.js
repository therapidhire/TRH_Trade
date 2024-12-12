const Role = require('../Models/RoleModel');

// Create Role
const createRole = async (req, res) => {
  try {
    const role = new Role(req.body);
    console.log("role----",role);
    await role.save(res);
    console.log()
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read All Roles
const getAllRole = async (req, res) => {
  try {
    console.log("roles")
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read Role by ID
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Role
const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Role
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    createRole,
    getAllRole,
    getRoleById,
    updateRole,
    deleteRole
}
