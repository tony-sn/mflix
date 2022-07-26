import { ChangeEvent, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function Login(props: any) {
	const [name, setName] = useState('');
	const [id, setId] = useState('');

	const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setName(name);
	};

	const oneChangeId = (e: ChangeEvent<HTMLInputElement>) => {
		const id = e.target.value;
		setId(id);
	};

	const login = () => {
		props.login({ name: name, id: id });
		props.history.push('/');
	};

	return (
		<div className="App">
			<Form>
				<Form.Group>
					<Form.Label>Username</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter username"
						value={name}
						onChange={onChangeName}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>ID</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter ID"
						value={id}
						onChange={oneChangeId}
					/>
				</Form.Group>
				<Button variant="primary" onClick={login}>
					Submit
				</Button>
			</Form>
		</div>
	);
}

export default Login;
