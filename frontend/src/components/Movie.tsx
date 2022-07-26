import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	Card,
	Container,
	Image,
	Col,
	Row,
	Button,
	Media,
} from 'react-bootstrap';
import moment from 'moment';
import MovieDataService from '../services/movies';

function Movie(props: any) {
	const [movie, setMovie] = useState({
		id: null,
		title: '',
		rated: '',
		reviews: [],
	});

	const getMovie = (id: string) => {
		MovieDataService.get(id)
			.then((response) => {
				setMovie(response.data);
				console.log(response.data);
			})
			.catch((e) => console.error(e));
	};

	const deleteReview = (reviewId: string, index: any) => {
		// need index of the review from the reviews array
		MovieDataService.deleteReview(reviewId, props.user.id)
			.then((response) => {
				setMovie((prevState) => {
					prevState.reviews.splice(index, 1);
					return {
						...prevState,
					};
				});
			})
			.catch((e) => {
				console.log(e);
			});
	};

	useEffect(() => {
		getMovie(props.match.params.id);
	}, [props.match.params.id]);

	return (
		<div className="App">
			<Container>
				<Row>
					<Col>
						<Image
							src={
								//@ts-ignore
								movie?.poster + '/100px250'
							}
							fluid
						/>
					</Col>
					<Col>
						<Card>
							<Card.Header as="h5">{movie.title}</Card.Header>
							<Card.Body>
								<Card.Text>
									{
										//@ts-ignore
										movie?.plot
									}
								</Card.Text>
								{props.user && (
									<Link to={'/movies/' + props.match.params.id + '/review'}>
										Add Review
									</Link>
								)}
							</Card.Body>
						</Card>
						<br></br>
						<h2>Reviews</h2>
						<br></br>
						{movie.reviews.map((review: any, index) => {
							console.log(review);
							return (
								<Media key={index}>
									<Media.Body>
										<h5>
											{review.name + ' reviewed on '}
											{moment(review.date).format('Do MMMM YYYY')}
										</h5>
										<p>{review.review}</p>
										{props.user && props.user.id === review.user_id && (
											<Row>
												<Col>
													<Link
														to={{
															pathname:
																'/movies/' + props.match.params.id + '/review',
															state: {
																currentReview: review,
															},
														}}
													>
														Edit
													</Link>
												</Col>
												<Col>
													<Button
														variant="link"
														onClick={() => deleteReview(review._id, index)}
													>
														Delete
													</Button>
												</Col>
											</Row>
										)}
									</Media.Body>
								</Media>
							);
						})}
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default Movie;
