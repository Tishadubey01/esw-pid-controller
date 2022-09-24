
import { useState, useEffect } from "react";

const Home = (props) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername("User");
  }, []);

  const currangle = {
    graph:
      '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/1857294/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>'
  };

  const targetangle = {
    graph:
      '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/1853807/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>'
  };


  const kp = {
    graph:
      '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/1853807/charts/2?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>'
  };
  
  const kd = {
    graph:
      '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/1853807/charts/4?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>'
  };

  const ki = {
    graph:
      '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/1853807/charts/3?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>'
  };

  function Iframe(props) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }}
      />
    );
  }
  

  return (  //<div style={{ textAlign: "center" }}>Welcome - {username}</div>;

  <div className="App" style={{align:"center"}}>
    <h1>kp Graph</h1>
    <Iframe iframe={kp["graph"]} allow="autoplay" />

    <h1>kd Graph</h1>
    <Iframe iframe={kd["graph"]} allow="autoplay" />

    <h1>ki Graph</h1>
    <Iframe iframe={ki["graph"]} allow="autoplay" />

    <h1>Target Angle Graph</h1>
    <Iframe iframe={targetangle["graph"]} allow="autoplay" />

    <h1>Current Angle Graph</h1>
    <Iframe iframe={currangle["graph"]} allow="autoplay" />
  </div>

  );
};

export default Home;