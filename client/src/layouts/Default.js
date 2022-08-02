import React from "react";
import { Container, Row, Col } from "shards-react";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";
import useUser from "../components/useUser";


const DefaultLayout = (props) => {

// { children, noNavbar, noFooter, noSidebar }

  const { user } = useUser();


  // if(!routes.map(r => r.path).includes(window.location.pathname)){
  //   return(<>
  //   </>)
  // }

  return (
   props.children.type.name !== 'Errors' ?
  <Container fluid>
    <Row>
      {((user && !props.noSidebar) && !["/signin", "/signup"].includes(window.location.pathname)) ? 
        <>
          {(props.children.type.name !== 'Errors') && <MainSidebar /> } 
            <Col
            style={{}}
            className="main-content p-0"
            lg={{ size: 10, offset: 2 }}
            md={{ size: 9, offset: 3 }}
            sm="12"
            tag="main"
            >
            {(props.children.type.name !== 'Errors') && (!props.noNavbar) && <MainNavbar />}
            {props.children.type.name !== 'Errors' && props.children}
            {(props.children.type.name !== 'Errors') && (!props.noFooter) && <MainFooter />}
          </Col>
        </>
          :
          <>
            {/* <MainSidebar />   */}
            <Col
              className="main-content p-0"
              sm="12"
              tag="main"
            >
            {(!props.noNavbar) && <MainNavbar />}
            {props.children}
          </Col>
        </>
      }
    </Row>
  </Container>
  :
  <>
  {(props.children.type.name === 'Errors') && !window.location.pathname.split("/").splice(1,window.location.pathname.split("/").length).includes(window.location.pathname.split("/")[1]) && props.children}
  </>
)};

export default DefaultLayout;
