import Movie from "../models/movieModel.js";

export function getAll(req, res) {
  Movie.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving skills.",
      });
    else res.send(data);
  });
}

export function getById(req, res) {
  Movie.getById(req.params.id_movie, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving skills.",
      });
    else res.send(data);
  });
}

export function getTopTen(req, res) {
  Movie.getTopTen((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving skills.",
      });
    else res.send(data);
  });
}

export function getGroupedByCategory(req, res) {
  Movie.getGroupedByCategory((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving skills.",
      });
    else res.send(data);
  });
}

export function getByCategory(req, res) {
  Movie.getByCategory(req.params.category, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving skills.",
      });
    else res.send(data);
  });
}

