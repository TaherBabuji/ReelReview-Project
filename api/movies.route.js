import express from "express";
import MoviesController from "./movies.controller.js";
import ReviewsController from "./reviews.controller.js";

const router = express.Router(); //get access to the express router

router.route("/").get(MoviesController.apiGetMovies);

router
  .route("/review")
  .post(ReviewsController.apiPostReview)
  .put(ReviewsController.apiUpdateReview)
  .delete(ReviewsController.apiDeleteReview);

router.route("/id/:id").get(MoviesController.apiGetMoviesById);

router.route("/ratings").get(MoviesController.apiGetRatings);

// (req, res) => {
//   try {
//     res.send("hello world");
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

export default router;
