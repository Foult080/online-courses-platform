import React, { Fragment } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import logo from "../images/coaching.svg";
import {FaSignInAlt} from "react-icons/fa";

const NavBar = () => {
  return (
    <Fragment>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#">
            <img
              src={logo}
              alt="logo"
              width="35"
              height="35"
              className="d-inline-block align-top"
              style={{ color: "blue" }}
            />{" "}
            ККРИТ Онлайн Курсы
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
            >
              <Nav.Link href="#action1">О площадке</Nav.Link>
              <Nav.Link href="#action2">Поддержать проект</Nav.Link>
            </Nav>
            <Button variant="outline-primary">Войти <FaSignInAlt /></Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Fragment>
  );
};

export default NavBar;
