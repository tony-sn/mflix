import axios from 'axios';

const BASE_LINK = import.meta.env.VITE_API;

class MovieDataService {
	getAll(page = 0) {
		return axios.get(`${BASE_LINK}?page=${page}`);
	}

	get(id: string) {
		return axios.get(`${BASE_LINK}/id/${id}`);
	}

	find(query: string, by = 'title', page = 0) {
		return axios.get(`${BASE_LINK}?${by}=${query}&page=${page}`);
	}

	createReview(data: any) {
		return axios.post(`${BASE_LINK}/review`, data);
	}

	updateReview(data: any) {
		return axios.put(`${BASE_LINK}/review`, data);
	}

	deleteReview(id: string, userId: string) {
		return axios.delete(`${BASE_LINK}/review`, {
			data: { review_id: id, user_id: userId },
		});
	}

	getRatings() {
		return axios.get(`${BASE_LINK}/ratings`);
	}
}

export default new MovieDataService();
