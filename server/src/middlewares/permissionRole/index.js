const signToken = (role) => {
  return async (req, res, next) => {
    try {
      const notesData = await Notes.findById(req?.payload?.userId);

      if (role?.includes(notesData?.role)) {
        req.userId = notesData?._id;
        req.role = notesData?.role;
        return next();
      } else {
        throw new Error(
          `You dont't have permission to access this: ${error.message}`
        );
      }
    } catch (error) {
      return next(error);
    }
  };
};

module.exports = { signToken };
