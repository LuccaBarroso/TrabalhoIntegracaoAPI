import db from "./database.js";

const User = function (user) {
  this.device_id = user.device_id;
};

// retorna o usuario se ele existir, se nao, cria um novo usuario e retorna ele
User.createUser = (newUser, result) => {
  User.getByDeviceId(newUser.device_id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res) {
      result(null, res);
      return;
    }
    db.query(
      `INSERT INTO user (device_id) VALUES (?)`,
      [newUser.device_id],
      (err, res) => {
        if (err) {
          result(null, err);
          return;
        }
        User.getByDeviceId(newUser.device_id, (err, res) => {
          if (err) {
            result(null, err);
            return;
          }
          result(null, res);
        });
      }
    );
  });
};

// retorna o usuario se ele existir, se nao, retorna null
User.getByDeviceId = (device_id, result) => {
  db.query(
    `SELECT * FROM user WHERE device_id = ?`,
    [device_id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.length > 0) {
        result(null, res[0]);
        return;
      }
      result(null, null);
    }
  );
};

export default User;
