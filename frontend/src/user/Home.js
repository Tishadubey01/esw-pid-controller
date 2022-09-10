
import { useState, useEffect } from "react";

const Home = (props) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername("User");
  }, []);

  const demos = {
    graph:
      '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/1853807/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>',
  };

  function Iframe(props) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }}
      />
    );
  }
  

  return (  //<div style={{ textAlign: "center" }}>Welcome - {username}</div>;

  <div className="App">
    <h1>Motor Angle</h1>
    <Iframe iframe={demos["graph"]} allow="autoplay" />,
  </div>

  );
};

export default Home;