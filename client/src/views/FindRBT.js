/* eslint jsx-a11y/anchor-is-valid: 0 */

import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Badge,
} from "shards-react";
import useUser from "../components/useUser";
import PageTitle from "../components/common/PageTitle";
import { Link } from "react-router-dom";

const palletes = {
  '0': 'info',
  '1': 'error',
  '2': 'danger',
  '3': 'primary',
  '4': 'warning',
  '5': 'secondary',
  '6': 'light',
  '7': 'dark',
  '8': 'success',
  '9': 'grey',
  '10': 'common',
}

const  FindRBT = () => {

  const { user } = useUser();

  const [userProfile, setUserProfile] = useState(null);
  const [allUsers, setAllUsers] = useState(null);

    useEffect(() => {
    if (allUsers === null){
      fetch(`http://localhost:8000/user/${user}/info`)
      .then(response => response.json())
      .then(data =>{
        setAllUsers(data)
      })
      .then()
    }
  },[allUsers]);

    useEffect(() => {
    if (userProfile === null){
      fetch(`http://localhost:8000/user/${user}/info`)
      .then(response => response.json())
      .then(data =>{
        setUserProfile(data)
      })
      .then()
    }
  },[userProfile]);

    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" subtitle="Table" title="Projects" className="text-sm-left" />
        </Row>
        <Row>
            <Col lg="4" md="6" sm="12" className="mb-4" >
            <Card small className="card-post card-post--1">
              {
                allUsers
              }
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }


export default FindRBT;
