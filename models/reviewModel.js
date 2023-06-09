import db from "./database.js";

const Review = function (review) {
  this.device_id = review.device_id;
  this.id_movie = review.id_movie;
  this.score = review.score; // 1 a 5
};

Review.createReview = (newReview, result) => {
  // get user id by device id
  db.query(
    `SELECT id_user FROM user WHERE device_id = ?`,
    [newReview.device_id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.length > 0) {
        // User already exists, proceed with review creation
        newReview.id_user = res[0].id_user;
        createOrUpdateReview(newReview, result);
      } else {
        // User does not exist, create a new user and then proceed with review creation
        db.query(
          `INSERT INTO user (device_id) VALUES (?)`,
          [newReview.device_id],
          (err, res) => {
            if (err) {
              result(null, err);
              return;
            }

            newReview.id_user = res.insertId;
            createOrUpdateReview(newReview, result);
          }
        );
      }
    }
  );
};

function createOrUpdateReview(newReview, result) {
  db.query(
    `SELECT * FROM review WHERE id_user = ? AND id_movie = ?`,
    [newReview.id_user, newReview.id_movie],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.length > 0) {
        db.query(
          `UPDATE review SET score = ? WHERE id_user = ? AND id_movie = ?`,
          [newReview.score, newReview.id_user, newReview.id_movie],
          (err, res) => {
            if (err) {
              result(null, err);
              return;
            }
            result(null, newReview);
          }
        );
      } else {
        db.query(
          `INSERT INTO review (id_user, id_movie, score) VALUES (?, ?, ?)`,
          [newReview.id_user, newReview.id_movie, newReview.score],
          (err, res) => {
            if (err) {
              result(null, err);
              return;
            }
            result(null, newReview);
          }
        );
      }
    }
  );
}

// get review score average by movie id
Review.getAverageByMovieId = (id_movie, result) => {
  db.query(
    `SELECT AVG(score) AS average FROM review WHERE id_movie = ?`,
    [id_movie],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      result(null, res[0]);
    }
  );
};

// get review score by movie id and device_id
Review.getByMovieIdAndUserId = (id_movie, device_id, result) => {
  // get user id by device id
  let id_user;
  db.query(
    `SELECT id_user FROM user WHERE device_id = ?`,
    [device_id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.length == 0) {
        result(null, {
          score: 0,
        });
        return;
      }
      id_user = res[0].id_user;
      db.query(
        `SELECT score FROM review WHERE id_movie = ? AND id_user = ?`,
        [id_movie, id_user],
        (err, res) => {
          if (err) {
            result(null, err);
            return;
          }
          result(null, res[0]);
        }
      );
    }
  );
};

export default Review;
