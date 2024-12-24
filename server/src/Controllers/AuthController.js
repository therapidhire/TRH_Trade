const User = require('../Models/UserModel');
const Role = require('../Models/RoleModel');

const login = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Basic Validation
      if (!email) {
        return res.status(400).send({
          status: 400,
          message: "Email are required for login.",
        });
      }
  
      // Check if user exists
      const user = await User.findOne({UserEmail:email});
      console.log("user", user);
      if (!user) {
        return res.status(404).send({
          status: 404,
          message: "User not found.",
        });
      }
      const roleId= user.RoleId.toString();
      console.log("roleId", roleId);
      const userRole = await Role.findOneAndUpdate({roleId});
      console.log("userRole", userRole);
      if(!userRole){
        return res.status(404).send({
            status: 404,
            message: "Role not found.",
            });
      }

  
     
      return res.status(200).send({
        status: 200,
        message: "Login successful.",
        data: {
          userId: user._id,
          firstName: user.Firstname,
          lastName: user.Lastname,
          userRole: userRole.RoleName,
        },
      });
    } catch (error) {
      console.error("Error in login API:", error);
  
      return res.status(500).send({
        status: 500,
        message: "Internal Server Error.",
      });
    }
  };

  module.exports = login;