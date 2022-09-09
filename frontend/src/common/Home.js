
import { useState, useEffect } from "react";

const Home = (props) => {
  //const [username, setUsername] = useState("");

  useEffect(() => {
    //setUsername("User");
  }, []);

  return <div style={{ textAlign: "center" }}>Welcome to ESW Project</div>;
};

export default Home;