import MoviesDAO from "../dao/moviesDAO.js";
import axios from "axios";

export default class MoviesController {
  static async apiGetMovies(req, res, next) {
    const moviesPerPage = req.query.moviesPerPage
      ? parseInt(req.query.moviesPerPage)
      : 20;
    const page = req.query.page ? parseInt(req.query.page) : 0;

    let filters = {};

    if (req.query.rated) {
      filters.rated = req.query.rated;
    } else if (req.query.title) {
      filters.title = req.query.title;
    }

    try {
      const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
        filters,
        page,
        moviesPerPage,
      });

      // Function to check if a URL is valid
      const isValidUrl = async (url) => {
        try {
          const response = await axios.head(url);
          return response.status === 200;
        } catch (error) {
          return false;
        }
      };

      // Filter out movies with invalid or missing poster links
      const filteredMovies = await Promise.all(
        moviesList.map(async (movie) => {
          if (movie.poster && movie.poster.startsWith("https://")) {
            const isValid = await isValidUrl(movie.poster);
            if (isValid) {
              return movie;
            }
          }
          return null;
        })
      );

      // Remove any null values from the array
      const cleanedMovies = filteredMovies.filter((movie) => movie !== null);

      let response = {
        movies: cleanedMovies,
        page: page,
        filters: filters,
        entries_per_page: moviesPerPage,
        total_results: totalNumMovies,
      };

      res.json(response);
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  }

  static async apiGetMoviesById(req, res, next) {
    try {
      let id = req.params.id || {};
      let movie = await MoviesDAO.getMovieById(id);

      if (!movie) {
        res.status(404).json({ error: "not found" });
        return;
      }
      res.json(movie);
    } catch (error) {
      console.log(`api, ${error}`);

      res.status(500).json({ error: error });
    }
  }

  static async apiGetRatings(req, res, next) {
    try {
      let propertyTypes = await MoviesDAO.getRatings();
      res.json(propertyTypes);
    } catch (error) {
      console.log(`api, ${error}`);
      res.satus(500).json({ error: error });
    }
  }
}
