import express from "express";
import MoviesController from "./movies.controller.js";
import ReviewController from "./reviews.controller.js";

const router = express.Router(); // get access to express router

router.route("/").get(MoviesController.apiGetMovies);
router.route("/id/:id").get(MoviesController.apiGetMovieById);
router.route("/ratings").get(MoviesController.apiGetRatings);

router
	.route("/review")
	.post(ReviewController.apiPostReview)
	.put(ReviewController.apiUpdateReview)
	.delete(ReviewController.apiDeleteReview);

export default router;
