import MoviesDAO from "../dao/moviesDAO.js";

/**
 * @note Movies controller that the router will use to access the 'dao' file
 */
export default class MoviesController {
	static async apiGetMovies(req, res, next) {
		// e.g: http://localhost:4000/api/v1/movies?title=dragon&moviesPerPage=15&page=0
		// req.query = {title: 'dragon', moviesPerPage: '15', page: '0'}
		const moviesPerPage = req.query.moviesPerPage
			? parseInt(req.query.moviesPerPage)
			: 20;
		const page = req.query.page ? parseInt(req.query.page) : 0;

		let filters = {}; // init no filter applied
		if (req.query.rated) {
			filters.rated = req.query.rated;
		} else if (req.query.title) {
			filters.title = req.query.title;
		}

		const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
			filters,
			page,
			moviesPerPage,
		});

		let response = {
			movies: moviesList,
			page,
			filters,
			entries_per_page: moviesPerPage,
			total_results: totalNumMovies,
		};
		res.json(response);
	}

	static async apiGetMovieById(req, res, next) {
		try {
			let id = req.params.id || {}; //parameter: id
			let movie = await MoviesDAO.getMovieById(id);
			if (!movie) {
				res
					.status(404)
					.json({ error: `Movie ID ${id} not found! Please try again` });
				return;
			}
			res.json(movie);
		} catch (e) {
			console.log(`api, ${e}`);
			res.status(500).json({ error: e });
		}
	}

	static async apiGetRatings(req, res, next) {
		try {
			let propertyTypes = await MoviesDAO.getRatings();
			res.json(propertyTypes);
		} catch (e) {
			console.log(`api ${e}`);
			res.status(500).json({ error: e });
		}
	}
}
