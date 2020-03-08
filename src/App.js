import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import _ from "lodash";
import QuestionBox from "./QuestionBox";
import he from "he";
import decode from "unescape";
import Button from "react-bootstrap/Button";

export default function App() {
  const [answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(0);
  const [finalValue, setFinal] = useState(0);
  const [openResult, setToggle] = useState(false);
  const judul = "Test Your Anime IQ"
  const calculateFinal = () => {
    answers.forEach(e => {
      if (e.selected !== null) {
        if (e.selected === e.answers.indexOf(e.correct_answer)) {
          setFinal(nilai => nilai + 1);
        } else {
          setFinal(nilai => nilai - 1);
        }
      }
    });
  };
  const fetchAnswers = () => {
    axios
      .get(
        "https://opentdb.com/api.php?amount=30&category=31&difficulty=medium&type=multiple"
      )
      .then(res => {
        let array = [];
        res.data.results.map((e, i) => {
          let answer = [e.correct_answer, ...e.incorrect_answers];
          answer = _.shuffle(answer);
          array.push({
            question: e.question,
            correct_answer: e.correct_answer,
            incorrect_answers: e.incorrect_answers,
            selected: null,
            answers: answer
          });
        });
        setToggle(false);
        setFinal(0);
        setIndex(0);
        setAnswers(array);
      });
  };
  const selectItem = (item, indexx) => {
    setAnswers(
      answers.map((answer, i) =>
        indexx === i
          ? {
              ...answer,
              selected: item
            }
          : answer
      )
    );
  };
  const next = () => {
    if (index < answers.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  };
  const prev = () => {
    if (index === 0) {
      setIndex(answers.length - 1);
    } else {
      setIndex(index - 1);
    }
  };
  useEffect(() => {
    document.title = judul
    fetchAnswers();
  }, []);
  return (
    <div className="App">
      <Navbar bg="light" className="mb-5">
        <Navbar.Brand>{judul}</Navbar.Brand>
        <Navbar.Text className="ml-auto">
          Soal : {index + 1}/{answers.length}
        </Navbar.Text>
      </Navbar>
      {!openResult && (
        <>
          {answers.length > 0 ? (
            <div className="mb-3">
              <Container>
                <QuestionBox
                  answers={answers}
                  index={index}
                  next={next}
                  prev={prev}
                  selectItem={selectItem}
                  toggleResult={() => {
                    setToggle(!openResult);
                    calculateFinal();
                  }}
                />
              </Container>
            </div>
          ) : (
            <div className="my-3 text-center">Loading...</div>
          )}
        </>
      )}
      {openResult && (
        <>
          <h1 className="text-center">Your Score : {finalValue}</h1>
          <div className="text-center"><Button
            variant="primary"
            className="text-center my-3"
            onClick={() => fetchAnswers()}
          >
            Coba Lagi?
          </Button></div>
          <Container>
            {answers.map((e, i) => (
              <>
                <Card
                  key={i}
                  bg={
                    e.selected === null
                      ? "secondary"
                      : e.selected === e.answers.indexOf(e.correct_answer)
                      ? "success"
                      : "danger"
                  }
                  text="white"
                >
                  <Card.Header>
                    {e.selected === null
                      ? "Kosong"
                      : e.selected === e.answers.indexOf(e.correct_answer)
                      ? "Benar (+1)"
                      : "Salah (- 1)"}
                  </Card.Header>
                  <Card.Body>
                    <p>
                      {i + 1}. {he.decode(e.question)}
                    </p>
                    <p>Jawaban : {he.decode(e.correct_answer)}</p>
                    <p>Jawabanmu : {decode(e.answers[e.selected])}</p>
                  </Card.Body>
                </Card>
                <br />
              </>
            ))}
          </Container>
        </>
      )}
    </div>
  );
}
