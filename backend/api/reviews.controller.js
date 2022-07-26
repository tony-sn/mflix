import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
	static async apiPostReview(req, res, next) {
		try {
			// retrieve data from body of the request
			// frontend endpoint: axios.post("https://localhost:4000/api/v1/movies/review", data: {
			// review : "great movie", name: "john", user_id: "123", movie_id: "573a1390f..."})

			const movieId = req.body.movie_id;
			const review = req.body.review;
			const userInfo = {
				name: req.body.name,
				_id: req.body.user_id,
			};

			const date = new Date();

			const ReviewResponse = await ReviewsDAO.addReview(
				movieId,
				userInfo,
				review,
				date
			);
			res.json({ status: "success" });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async apiUpdateReview(req, res, next) {
		try {
			// frontend endpoint: axios.put("https://localhost:4000/api/v1/movies/review", data)
			const reviewId = req.body.review_id;
			const review = req.body.review;

			const date = new Date();

			const ReviewResponse = await ReviewsDAO.updateReview(
				reviewId,
				req.body.user_id,
				review,
				date
			);

			let { error } = ReviewResponse;
			if (error) {
				res.status.json({ error });
			}

			// updateReview returns a doc ReviewResponse which contains property modifiedCount
			// which contains the number of modified documents. Ensure modifiedCount !== 0
			if (ReviewResponse.modifiedCount === 0) {
				throw new Error(
					"unable to update review. User may not be original poster."
				);
			}

			res.json({ status: "success" });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	static async apiDeleteReview(req, res, next) {
		try {
			const reviewId = req.body.review_id;
			const userId = req.body.user_id;

			const ReviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);

			res.json({ status: "success" });
		} catch (e) {
			res.status(500).json({ error: e.message });
		}
	}
}
