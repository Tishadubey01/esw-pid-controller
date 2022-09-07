import React from 'react'; 
import  { useState, useEffect} from 'react';
import axios from "axios";


function Home() {
    // const [data, setData] = useState(0);
    //     useEffect(() => {
    //         const userInfo = async () => {
    //             await axios({
    //                 "method": "GET",
    //                 url: "https://api.thingspeak.com/channels/1825173/fields/1.json?api_key=KJE4BMC4N1YSMUFQ"
    //                     // headers: {
    //                     //     "Authorization": data.token,
    //                     // },
    //                 })
    //                 .then((res) => {
    //                     console.log("HIIIIII")
    //                     console.log(res)
    //                     setData(res.data);
    //                 })
    //                 .catch((err) => {
    //                     console.log(err);
    //                 });
            
    //         userInfo()
    //     }
    // }, []);

let [responseData, setResponseData] = React.useState('');
  const fetchData = React.useCallback(() => {
    axios({
      "method": "GET",
      "url": "https://api.thingspeak.com/channels/1825173/fields/1.json?api_key=KJE4BMC4N1YSMUFQ",
      "headers": {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
      }
    })
    .then((response) => {
      setResponseData(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
  }, [])
  React.useEffect(() => {
    fetchData()
  }, [fetchData])

    return (
        <div>
            hello
            <button type='button' onClick={fetchData}>Click for Data</button>
        </div>
    )
}

export default Home;


// import { useState, useEffect } from "react";

// const Home = (props) => {
//   const [username, setUsername] = useState("");

//   useEffect(() => {
//     setUsername("User");
//   }, []);

//   const demos = {
//     graph:
//         '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/935349/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=2880&title=Temperature+%283+days%29&type=line"></iframe>'
//   };

//   function Iframe(props) {
//     return (
//       <div
//         dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }}
//       />
//     );
//   }
  

//   return (  //<div style={{ textAlign: "center" }}>Welcome - {username}</div>;

//   <div className="App">
//     <h1>Graphical analysis</h1>
//     <Iframe iframe={demos["graph"]} allow="autoplay" />,
//   </div>

//   );
// };

// export default Home;