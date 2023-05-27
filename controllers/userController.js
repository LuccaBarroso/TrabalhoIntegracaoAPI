import User from "../models/userModel.js";

export function createUser(req, res) {
  const newUser = new User({
    device_id: req.body.device_id,
  });

  User.createUser(newUser, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving skills.",
      });
    else res.send(data);
  });
}
