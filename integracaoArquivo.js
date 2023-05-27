import fs from "fs";
import Movie from "./models/movieModel.js";

const path = "/uniflix/arquivos";

export default function () {
  console.log("---------------------start---------------------");
  console.log("Running cron job:");
  // check if there are files in the ${path}/input folder
  fs.readdir(`${path}/input`, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      if (files && files.length > 0) {
        fs.readFile(`${path}/input/${files[0]}`, "utf8", (err, data) => {
          if (err) {
            console.log("Falha ao ler arquivo");
            moveToErro(files[0]);
          } else {
            // check if file is a valid json
            let json;
            try {
              json = JSON.parse(data);
            } catch (err) {
              console.log(
                "Invalid file, make sure the file contains a valid json (" +
                  files[0] +
                  ")"
              );
              moveToErro(files[0]);
            }

            if (!json.movies || json.movies.length === 0) {
              console.log(
                "Invalid file, make sure the file contains an array of movies (" +
                  files[0] +
                  ")"
              );
              moveToErro(files[0]);
            }

            // log each item of array movies to console
            json.movies.forEach((movie) => {
              addMovie(movie);
            });

            moveToOutput(files[0]);
          }
        });
      } else {
        console.log("No files to process.");
      }
    }
  });
}

function moveToErro(file) {
  // move file to ${path}/output folder
  fs.rename(`${path}/input/${file}`, `${path}/erro/${file}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("File moved successfully.");
    }
  });
}
function moveToOutput(file) {
  // move file to ${path}/output folder
  fs.rename(`${path}/input/${file}`, `${path}/output/${file}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("File moved successfully.");
    }
  });
}

function addMovie(movie) {
  let tituloTemp = movie.title ? movie.title : "undefined";

  console.log("adding movie: " + tituloTemp);
  if (
    !movie.title ||
    !movie.synopsis ||
    !movie.release_year ||
    !movie.image_path ||
    !movie.category
  ) {
    console.log(
      "Invalid movie, make sure the movie contains all the required fields (title, synopsis, release_year, image_path, category)"
    );
    return;
  }

  // add movie to database
  const newMovie = {
    title: movie.title,
    synopsis: movie.synopsis,
    release_year: movie.release_year,
    image_path: movie.image_path,
    category: movie.category,
  };

  Movie.create(newMovie, (err, data) => {});
}
