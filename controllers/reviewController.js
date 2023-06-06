import Review from "../models/reviewModel.js";

export function createReview(req, res) {
  const newReview = new Review({
    device_id: req.body.device_id,
    id_movie: req.body.id_movie,
    score: req.body.score,
  });

  Review.createReview(newReview, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving skills.",
      });
    else res.send(data);
  });
}

export function getAverageByMovieId(req, res) {
  Review.getAverageByMovieId(req.params.id_movie, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving skills.",
      });
    else res.send(data);
  });
}

export function getByMovieIdAndUserId(req, res) {
  Review.getByMovieIdAndUserId(
    req.params.id_movie,
    req.params.device_id,
    (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving skills.",
        });
      else {
        res.send(data);
      }
    }
  );
}
