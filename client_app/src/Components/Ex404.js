import React, { Fragment } from "react";
import notFound from "../images/notFound.svg";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
const Ex404 = () => {
  return (
    <Fragment>
      <div className="container">
        <div className="text-center">
          <img
            src={notFound}
            className="img-responsive mt-5"
            width="250"
            height="250"
            alt="not found img"
          />
          <p style={styles.title}>Страница не найдена</p>
          <div>
            <Link to="/">
              <Button variant="primary" className="mr-1">
                <i className="fas fa-home"></i> На главную
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const styles = {
  title: {
    fontSize: "48px",
  },
};

export default Ex404;
