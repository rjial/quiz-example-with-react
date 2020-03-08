import React, { useState, useEffect } from "react";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import he from "he";

export default ({ answers, index, next, prev, selectItem, toggleResult }) => {
  return (
    <>
      <h2 className="my-3 text-center">
        {index + 1}. {he.decode(answers[index].question)}
      </h2>
      <Row className="mb-2">
        <Col md={{ span: 4, offset: 4 }}>
          <ListGroup>
            {answers[index].answers.map((e, i) => (
              <ListGroup.Item
                key={i}
                className={`list-group-item text-center ${answers[index]
                  .selected === i && " selected-item"}`}
                onClick={() => selectItem(i, index)}
              >
                {he.decode(e)}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <div className="mt-3 mb-3 text-center">
        <Button className="mr-2" onClick={() => prev()}>
          Previous
        </Button>
        <Button variant="success" className="mr-2" onClick={toggleResult}>
          Submit
        </Button>
        <Button onClick={() => next()}>Next</Button>
      </div>
    </>
  );
};
