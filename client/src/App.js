import Home from "./pages/home/Home";
import Chat from "./pages/chat/Chat";
// import Login from "./pages/login/Login";
// import Profile from "./pages/profile/Profile";
// import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "./context/AuthContext";
// import Messenger from "./pages/messenger/Messenger";
import { useSelector, useDispatch } from 'react-redux';

function App() {
  // const { user } = useContext(AuthContext);
  const user = useSelector(state => state.user);
  return (
    <Router>
        <Routes>
          {/* <Route exact path="/" element={user ? <Home /> : <Register />}/> */}
          <Route exact path="/" element={<Home/>}/>
        {/* <Route path="/login">{user ? <Navigate to="/" /> : <Login />}</Route> */}
        {/* <Route path="/register">
          {user ? <Navigate to="/" /> : <Register />}
        </Route> */}
          {/* {!user ? <Navigate to="/" /> : <Chat />} */}
          <Route path="/chat" element={!user ? <Home/> : <Chat/>}/>
        </Routes>
        {/* <Route path="/messenger">
          {!user ? <Navigate to="/" /> : <Messenger />}
        </Route> */}
        {/* <Route path="/profile/:username">
          <Profile />
        </Route> */}
    </Router>
  );
}

export default App;