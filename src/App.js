import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import "./App.css";
import MultiLinePriceChart from "./components/MultiLinePriceChart";
import SelectOriginDestinationPorts from "./components/SelectOriginDestinationPorts";
import { getPortsListAPI } from "./api/api";

function App() {
  const [origin, setOrigin] = useState("");
  const [ports, setPorts] = useState("");
  const [originPorts, setOriginPorts] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationPorts, setDestinationPorts] = useState("");

  const getPortsList = async () => {
    try {
      const ports = await getPortsListAPI();
      // transform it into value/label format
      const transformedPorts = ports.map((port) => {
        return {
          value: port.code,
          label: `${port.name} (${port.code})`,
        };
      });
      setPorts(transformedPorts)
      setOriginPorts(transformedPorts);
      setDestinationPorts(transformedPorts);      
    } catch (err) {
      console.log(err)
      alert(err);
    }
  };

  useEffect(() => {
    getPortsList();
  }, []);

  const onPortSelectionHandler = ({ value }, originSelected = true) => {
    console.log("Value : ", value);
    if (originSelected) {
      const filteredDestinationPorts = ports.filter(
        (port) => port.value !== value
      );
      setDestinationPorts(filteredDestinationPorts);
      setOrigin(value);
    } else {
      const filteredOriginPorts = ports.filter(
        (port) => port.value !== value
      );
      setOriginPorts(filteredOriginPorts);
      setDestination(value);
    }
  };

  return (
    <Container>
      <Row className="my-3">
        <h3 className="text-center">Xeneta Coding Challenge - port search task</h3>
      </Row>
      <hr />
      <SelectOriginDestinationPorts
        originPorts={originPorts}
        destinationPorts={destinationPorts}
        onPortSelectionHandler={onPortSelectionHandler}
      ></SelectOriginDestinationPorts>
      {origin && destination && (
        <MultiLinePriceChart
          origin={origin}
          destination={destination}
        ></MultiLinePriceChart>
      )}
    </Container>
  );
}

export default App;
