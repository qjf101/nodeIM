import '../../App.css';
import { useState, useEffect, useRef, forwardRef } from 'react';
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { useSelector, useDispatch } from 'react-redux';
import { getUsers, updateChatLog, setUsername } from '../../actions';

function Chat() {

	const room = useSelector(state => state.room);
	const user = useSelector(state => state.user);
  const users = useSelector(state => state.users);
	const chatlog = useSelector(state => state.chats[room]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);

  const latestMessageRef = useRef(null);

  useEffect(() => {
    dispatch(getUsers())
  }, [user])

  useEffect(() => {
    const newSocket = socketIOClient(process.env.REACT_APP_SERVER_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.on("connect", () => {
      dispatch(setUsername({user, id: socket.id}))
    });

  }, [socket, user]);

  useEffect(() => {
    if (!socket ) return;

    // Message from server
    socket.on("message", (message) => {
      dispatch(updateChatLog())
    });

  }, [socket]);

  
  useEffect(() => {
    if (!socket) return;

    // Message from server
    socket.on("userConnection", (message) => {
      dispatch(updateChatLog())
      dispatch(getUsers())
    });

  }, [socket]);

  useEffect(() => {
    if (chatlog.length) latestMessageRef.current.scrollIntoView();
  }, [chatlog])

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', {user, msg});
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  };

  const exitRoom = () => {
    navigate('/')
  }

  const ChatMessage = forwardRef(({timestamp, user, msg}, ref) => {
    return (
      <div className='message' ref={ref}>
        <p className='meta'>{user}<span>{timestamp}</span></p>
        <p className='text'>{msg}</p>
      </div>
    )
  });

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1><i className="fas fa-smile"></i> NodeIM</h1>
        <a id="leave-btn" className="btn" onClick={() => exitRoom()}>Leave Room</a>
      </header>
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3><i className="fas fa-comments"></i> Room Name:</h3>
          <h2 id="room-name">{room}</h2>
          <h3><i className="fas fa-users"></i> Users</h3>
          <ul id="users">
            {users ?
              users.map((u, i) => {
                return (
                  <li key={i}>{u}</li>
                )
              }) :
              <></>
            }
          </ul>
        </div>
        <div className="chat-messages">
          { chatlog ? 
              chatlog.map((msg, i) => {
                return <ChatMessage key={i} {...msg} ref={i === chatlog.length-1 ? latestMessageRef : null}/>
              })
            :
            <></>
          }
        </div>
      </main>
      <div className="chat-form-container">
        <form id="chat-form" onSubmit={handleSubmit}>
          <input
            id="msg"
            type="text"
            placeholder="Enter Message"
            required
            autoComplete="off"
          />
          <button className="btn" disabled={socket ? false : true}><i className="fas fa-paper-plane"></i> Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
