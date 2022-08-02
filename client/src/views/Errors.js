import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Button } from "shards-react";
import routes from "../routes"

const Errors = () => {

  if(routes.map(r => r.path).includes(window.location.pathname)) {
    return (
      <></>
    )
  }

  return(
    // !routes.map(r => r.path).includes(window.location.pathname) &&
  <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <h2>404</h2>
        <h3>Something went wrong!</h3>
        <p>The requested page is not avaliable.</p>
        <NavLink to="/project-overview">
         <Button pill> Go Back To Project Overview</Button>
        </NavLink>
      </div>
    </div>
  </Container>
)};

export default Errors;
