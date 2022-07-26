import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectID;
let movies; // store reference to the db

/**
 * MoviesDao
 * @note Movies Data Access Object
 */
export default class MoviesDAO {
	static async injectDB(conn) {
		if (movies) {
			return; // if reference exists, exit
		}
		try {
			movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection('movies');

			const estimate = await movies.estimatedDocumentCount();
			console.log(
				`Estimated number of documents in the movies collection: ${estimate}`
			);
		} catch (error) {
			console.error(`unable to connect in MoviesDAO: ${error}`);
		}
	}

	static async getMovies({
		//default filter
		filters = null,
		page = 0,
		moviesPerPage = 20, // will only get 20 movies at once
	} = {}) {
		let query;
		if (filters) {
			// filters.hasOwnProperty('title')
			if ('title' in filters) {
				query = { $text: { $search: filters['title'] } }; // title: 'dragon' -> search titles with dragon in it
			}
			// filters.hasOwnProperty('rated')
			else if ('rated' in filters) {
				query = { rated: { $eq: filters['rated'] } }; // rated: 'G' -> search ratings with 'G'
			}
		}

		let cursor; // reduce memory consumption and network bandwidth usage
		try {
			// skip() applied before limit()
			// e.g: specific page = 1, skip 20 results first -> retrieve next 20
			// specific page = 2, skip 40 results first -> retrieve next 20
			cursor = await movies
				.find(query)
				.limit(moviesPerPage)
				.skip(moviesPerPage * page);
			const moviesList = await cursor.toArray();
			const totalNumMovies = await movies.countDocuments(query);

			return { moviesList, totalNumMovies };
		} catch (error) {
			console.error(`Unable to issue find command, ${error}`);
			return { moviesList: [], totalNumMovies: 0 };
		}
	}

	static async getMovieById(id) {
		try {
			return await movies
				.aggregate([
					// sequence of data aggregation operations
					{
						$match: {
							_id: new ObjectId(id),
						},
					},
					{
						$lookup: {
							// find all movies and its reviews
							from: 'reviews', // <collection to join>
							localField: '_id', // <field from the input document>
							foreignField: 'movie_id', // <field from the documents of the "from" collection>
							as: 'reviews', // <output array field>
						},
					},
				])
				.next();
		} catch (e) {
			console.error(`Something went wrong in getMovieById: ${e}`);
			throw e;
		}
	}

	static async getRatings(req, res, next) {
		let ratings = [];
		try {
			ratings = await movies.distinct('rated'); // get all distinct ratings from mongoDB
			return ratings;
		} catch (e) {
			console.error(`Unable to get ratings, ${e}`);
			return ratings;
		}
	}
}
