import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import JoinGame from "./assets/JoinGame";
import process from 'process';
import './assets/index.css';
import SlideNavbar from './assets/login';

function App() {
  const api_key = "aghsrehyanvm";  // add you own api key
  console.log(api_key);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);
  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    cookies.remove("username");
    client.disconnectUser();
    setIsAuth(false);
  };

if (token) {
  const userIdFromCookies = cookies.get("userId");

  console.log("User ID from cookies:", userIdFromCookies);
  console.log("Token:", token);

  client
    .connectUser(
      {
        id: userIdFromCookies,
        name: cookies.get("username"),
        firstName: cookies.get("firstName"),
        lastName: cookies.get("lastName"),
        hashedPassword: cookies.get("hashedPassword"),
      },
      token
    )
    .then((user) => {
      console.log("Connected user:", user.me.id);
      setIsAuth(true);
    })
    .catch((error) => {
      console.error("Error connecting user:", error);
      logOut();
    });
}


  return (
    <div className="App">
      {isAuth ? (
        <Chat client={client}>
          <JoinGame />
          <button className='logout' onClick={logOut}> Log Out</button>
        </Chat>
      ) : (
        <>
          <SlideNavbar setIsAuth={setIsAuth} />
        </>
      )}
    </div>
  );
}

export default App;
