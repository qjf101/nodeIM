import '../../App.css';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getUsers, joinRoom } from '../../actions';

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const users = useSelector(state => state.users);

  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  const handleSubmit = (e) => {
    const room = e.target.elements.room.value;
    const user = e.target.elements.username.value;
    if (users.includes(user)) return alert('Username is taken, please choose another.');

    e.preventDefault();
    dispatch(joinRoom({
        room,
        userData: {user}
    }))
    navigate('/chat')
  };

  return (
    <div className="join-container">
			<header className="join-header">
				<h1><i className="fas fa-smile"></i> NodeIM</h1>
			</header>
			<main className="join-main">
				<form onSubmit={handleSubmit}>
					<div className="form-control">
						<label htmlFor="username">Username</label>
						<input
							type="text"
							name="username"
							id="username"
							placeholder="Enter username..."
							required
						/>
					</div>
					<div className="form-control">
						<label htmlFor="room">Room</label>
						<select name="room" id="room">
							<option value="general">General</option>
							{/* <option value="Python">Python</option>
							<option value="PHP">PHP</option>
							<option value="C#">C#</option>
							<option value="Ruby">Ruby</option>
							<option value="Java">Java</option> */}
						</select>
					</div>
					<button type="submit" className="btn">Join Chat</button>
				</form>
			</main>
		</div>
  );
}

export default Home;
