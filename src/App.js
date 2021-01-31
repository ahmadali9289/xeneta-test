import React, { useState, useEffect } from "react";
import {Container} from 'react-bootstrap'
import './App.css';
import MultiLinePriceChart from './components/MultiLinePriceChart';
import SelectOriginDestinationPorts from './components/SelectOriginDestinationPorts';
import axios from "axios";

function App() {
  const [origin, setOrigin] = useState("");
  const [originPorts, setOriginPorts] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationPorts, setDestinationPorts] = useState("");
  const url =
    "https://685rp9jkj1.execute-api.eu-west-1.amazonaws.com/prod/ports";
  const API_KEY = "zSTAhrBZFU19GlvU9DzFUarK0gfW7Tx85rsyaVxV";

  const getPortsList = async (origin = "CNSGH", destination = "NLRTM") => {
    const ports = await axios.get(url, {
      headers: {
        "Content-type": "application/json",
        "x-api-key": API_KEY,
      }
    });
    console.log("Ports List : ", ports.data);
    // transform it into value/label format
    const transformedPorts = ports.data.map((port) => {
      return {
        value: port.code,
        label: `${port.name} (${port.code})`,
      };
    });

    setOriginPorts(transformedPorts);
    setDestinationPorts(transformedPorts);
  };

  useEffect(() => {
    getPortsList();
  }, []);

  const onPortSelectionHandler = ({value}, originSelected = true) => {
      console.log('Value : ', value);
      if (originSelected) {
          const filteredDestinationPorts = destinationPorts.filter(port => port.value !== value);
          setDestinationPorts(filteredDestinationPorts);
          setOrigin(value);
      } else {
        const filteredOriginPorts = originPorts.filter(port => port.value !== value);
        setOriginPorts(filteredOriginPorts)
        setDestination(value);
      }
  }

  return (
    <Container>
      <SelectOriginDestinationPorts originPorts={originPorts} destinationPorts={destinationPorts} onPortSelectionHandler={onPortSelectionHandler}></SelectOriginDestinationPorts>
      {origin && destination && <MultiLinePriceChart origin={origin} destination={destination} ></MultiLinePriceChart>}
    </Container>
  );
}

export default App;
