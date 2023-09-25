import React, { useState } from 'react'
import ROSLIB from 'roslib'
import { ImageViewer } from 'rosreact'
import './App.css'
import Switch from '@mui/material/Switch';

function App() {
  let imagetopic = '/image';

  const [status, setStatus] = useState("Not connected");
  const [checked, setChecked] = React.useState(true);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if(!checked){
      imagetopic = "/image"  // for changing image topic when checked switch
    }
  };
  
  const ros = new ROSLIB.Ros({encoding: 'ascii'})

  function convert(input){
        if (input.charAt(0) === "-") {
            let x = input.slice(0)
            return parseInt(x)
          } else {
                return parseInt(input)
          }
        }

    function connect() {
      ros.connect("ws://localhost:9090")
      // won't let the user connect more than once
      ros.on('error', function (error) {
        console.log(error)
        setStatus(error)
      })

      // Find out exactly when we made a connection.
      ros.on('connection', function () {
        console.log('Connected!')
        setStatus("Connected!")
      })

      ros.on('close', function () {
        console.log('Connection closed')
        setStatus("Connection closed")
      })
  }

  function publish(e) {
    if (status !== 'Connected!') {
      connect()
    }
    const cordData = new ROSLIB.Topic({
      ros: ros,
      name: "pose_topic",
      messageType: "geometry_msgs/PointStamped"
    })

    const data = new ROSLIB.Message({
            header :{
              frame_id : "hello"
            },
            point :{
              x : (e.clientX/1600), //factroring for 1
              y : ((e.clientY/900)-0.035), // -0.03 is div correction
              z : 0
            }
    })

    // publishes to the queue
    console.log('msg', data)
    cordData.publish(data)
    setTimeout(()=>{
      ros.close()
  }, 500)
  }

  return (
  <div className='main'>
    <div className='img'>
    <div  onClick={publish} className='img1' >
      {!checked &&
    <ImageViewer width={1600} height={900} topic={imagetopic}/>
    }
    {checked &&
    <ImageViewer width={1600} height={900} topic={imagetopic}/>
    }
    </div>
    <div className='switch'>
    <Switch
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
    </div>
    </div>
    <br></br>
    <br></br>
    
  
        
  </div>
  )
}

export default App;