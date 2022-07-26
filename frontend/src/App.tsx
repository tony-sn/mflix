import { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Nav, Navbar, Container } from 'react-bootstrap';

import { AddReview, MoviesList, Movie, Login } from './components';

function App() {
	const [user, setUser] = useState(null);

	async function login(user = null) {
		setUser(user);
	}

	async function logout() {
		setUser(null);
	}

	return (
		<div className="App">
			<Container>
				<Navbar bg="light" expand="lg">
					<Navbar.Brand>Mflix Movie Reviews</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="mr-auto">
							<Nav.Link href="/movies">Movies</Nav.Link>
							{user ? (
								<Nav.Link onClick={logout} href="">
									Logout User
								</Nav.Link>
							) : (
								<Nav.Link href="/login">Login</Nav.Link>
							)}
						</Nav>
					</Navbar.Collapse>
				</Navbar>

				<Switch>
					<Route exact path={['/', '/movies']} component={MoviesList}></Route>
					<Route
						path="/movies/:id/review"
						render={(props: any) => <AddReview {...props} user={user} />}
					></Route>
					<Route
						path="/movies/:id/"
						render={(props: any) => <Movie {...props} user={user} />}
					></Route>
					<Route
						path="/login"
						render={(props: any) => <Login {...props} login={login} />}
					></Route>
				</Switch>
			</Container>
		</div>
	);
}

export default App;
