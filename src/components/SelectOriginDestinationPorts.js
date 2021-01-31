import React from "react";
import { Row, Col } from "react-bootstrap";
import Select from "react-select";
const SelectOriginDestinationPorts = (props) => {
  return (
    <Row>
      {props.originPorts && props.destinationPorts && (
        <>
          <Col>
            <label>Select Origin</label>
            <Select
              options={props.originPorts}
              onChange={(e) => props.onPortSelectionHandler(e)}
            />
          </Col>
          <Col>
            <label>Select Origin</label>
            <Select
              options={props.destinationPorts}
              onChange={(e) => props.onPortSelectionHandler(e, false)}
            />
          </Col>
        </>
      )}
    </Row>
  );
};

export default SelectOriginDestinationPorts;
