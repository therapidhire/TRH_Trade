const position = (req, res) => {
  try {
    res.send({
      status: 200,
      message: "This is the position Api",
    });
  } catch (error) {
    console.error("this is the catch error", error);
  }
};

module.exports = position;
