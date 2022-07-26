import mongodb from "mongodb";

// convert an id string to MongoDB Object Id
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
	static async injectDB(conn) {
		if (reviews) return; // if reviews exist, exit, otherwise MongoDb will create reviews
		try {
			reviews = await conn
				.db(process.env.MOVIEREVIEWS_NS)
				.collection("reviews");
		} catch (e) {
			console.log(`unable to establish connection handle in reviewDAO: ${e}`);
		}
	}

	static async addReview(movieId, user, review, date) {
		try {
			const reviewDoc = {
				name: user.name,
				user_id: user._id,
				date,
				review,
				movie_id: ObjectId(movieId), // convert movie_id to MongoDB object id
			};
			return await reviews.insertOne(reviewDoc);
		} catch (e) {
			console.error(`Unable to post review: ${e}`);
			return { error: e };
		}
	}

	static async updateReview(reviewId, userId, review, date) {
		try {
			const updateResponse = await reviews.updateOne(
				// filter for an existing review created by userId and with reviewId
				{ user_id: userId, _id: ObjectId(reviewId) },
				{ $set: { review, date } } // update review
			);

			return updateResponse;
		} catch (e) {
			console.error(`Unable to update review: ${e}`);
			return { error: e };
		}
	}

	static async deleteReview(reviewId, userId) {
		try {
			const deleteResponse = await reviews.deleteOne({
				_id: ObjectId(reviewId), // specify ObjectId reviewId
				user_id: userId,
				// delete review if userId and reviewId exist
			});

			return deleteResponse;
		} catch (e) {
			console.error(`Unable to delete review: ${e}`);
			return { error: e };
		}
	}
}
