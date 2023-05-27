import db from "./database.js";

const Movie = function (movie) {
  this.title = movie.title;
  this.synopsis = movie.synopsis;
  this.score = movie.score;
  this.release_year = movie.release_year;
  this.image_path = movie.image_path;
  this.category = movie.category;
};

Movie.getAll = (result) => {
  db.query(`SELECT * FROM movie`, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Movie.getById = (id, result) => {
  db.query(
    `SELECT movie.*, actor.name AS actor_name, actor.id_actor, review.score AS review_score, review.id_user, FLOOR(AVG(coalesce(review.score, 0))) AS average FROM movie LEFT JOIN movie_actor ON movie.id_movie = movie_actor.id_movie LEFT JOIN actor ON movie_actor.id_actor = actor.id_actor LEFT JOIN review ON movie.id_movie = review.id_movie WHERE movie.id_movie = ? GROUP BY movie.id_movie, actor.id_actor`,
    [id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      const movie = {
        id_movie: res[0].id_movie,
        title: res[0].title,
        synopsis: res[0].synopsis,
        release_year: res[0].release_year,
        image_path: res[0].image_path,
        category: res[0].category,
        actors: [],
        average: res[0].average,
      };

      for (let i = 0; i < res.length; i++) {
        const actor = {
          actor_id: res[i].id_actor,
          actor_name: res[i].actor_name,
        };
        movie.actors.push(actor);
      }

      result(null, movie);
    }
  );
};

// get the top 10 movies by average score
Movie.getTopTen = (result) => {
  db.query(
    `SELECT movie.*, FLOOR(AVG(review.score)) AS average FROM movie LEFT JOIN review ON movie.id_movie = review.id_movie GROUP BY movie.id_movie ORDER BY average DESC LIMIT 10`,
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      result(null, res);
    }
  );
};

Movie.getGroupedByCategory = (result) => {
  db.query(
    `SELECT movie.category, movie.id_movie, movie.title, movie.image_path, movie.release_year, movie.synopsis, movie.release_year, movie.image_path, movie.category, movie.category
    FROM movie
    GROUP BY movie.category, movie.id_movie`,
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      const categoryArray = [];

      for (let i = 0; i < res.length; i++) {
        const categoryExists = categoryArray.find(
          (category) => category.category === res[i].category
        );

        if (!categoryExists) {
          const category = {
            category: res[i].category,
            movies: [],
          };
          categoryArray.push(category);
        }

        const movie = {
          id_movie: res[i].id_movie,
          title: res[i].title,
          synopsis: res[i].synopsis,
          release_year: res[i].release_year,
          image_path: res[i].image_path,
          category: res[i].category,
        };

        const categoryIndex = categoryArray.findIndex(
          (category) => category.category === res[i].category
        );

        categoryArray[categoryIndex].movies.push(movie);
      }

      return result(null, categoryArray);
    }
  );
};

Movie.create = (newMovie, result) => {
  db.query(
    `INSERT INTO movie (title, synopsis, release_year, image_path, category) VALUES (?, ?, ?, ?, ?)`,
    [
      newMovie.title,
      newMovie.synopsis,
      newMovie.release_year,
      newMovie.image_path,
      newMovie.category,
    ],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { id_movie: res.insertId, ...newMovie });
    }
  );
};

export default Movie;
