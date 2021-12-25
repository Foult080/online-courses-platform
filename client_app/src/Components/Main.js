import React, { Fragment } from "react";
import { Container, Button } from "react-bootstrap";
const Main = () => {
  return (
    <Fragment>
      <Container style={styles.main}>
        <div id="title" className="text-center">
          <h1 style={styles.title}>ONLINE-COURSES-PLATFORM</h1>
          <h1 style={styles.titleSub}>Made by @foult080</h1>
        </div>
        <div id="content" className="text-center my-5">
          <h4>Всего участников: 10</h4>
          <Button size="large" className="mt-2" variant="primary">
            Присоединиться
          </Button>
        </div>
      </Container>
    </Fragment>
  );
};

const styles = {
  content: {
    fontFamily: "Oswald, sans-serif",
  },
  main: {
    marginTop: "10em",
  },
  titleSub: {
    fontFamily: "Caveat, cursive",
  },
  title: {
    fontSize: "86px",
    fontFamily: "Oswald, sans-serif",
  },
};

export default Main;
