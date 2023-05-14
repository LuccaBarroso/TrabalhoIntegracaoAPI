import db from "./database.js";

const Review = function (review) {
  this.id_user = review.id_user;
  this.id_movie = review.id_movie;
  this.score = review.score; // 1 a 5
};

// create new review by user id, movie id and score
Review.createReview = (newReview, result) => {
  // check if user already reviewed this movie
  db.query(
    `SELECT * FROM review WHERE id_user = ? AND id_movie = ?`,
    [newReview.id_user, newReview.id_movie],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.length > 0) {
        // if yes, update review
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
};

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

// get review score by movie id and user id
Review.getByMovieIdAndUserId = (id_movie, id_user, result) => {
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
};

export default Review;
