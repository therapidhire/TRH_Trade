const express = require('express');
const {
    createRole,
    getAllRole,
    getRoleById,
    updateRole,
    deleteRole
} = require('../Controllers/roleController'); 
const router = express.Router();

router.post('/', createRole);
router.get('/', getAllRole);
router.get('/:id', getRoleById);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
