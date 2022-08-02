import React, {useEffect, useState} from "react";
import { 
  Container, 
  Row, 
  Col,
  Card,
  CardBody,
  Badge,
} from "shards-react";

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

const ProjectOverview = () => {

  const [projects, setProjects] = useState(null)
  const [members, setMembers] = useState(null)

  // const getUser = () => {

  //   const username = sessionStorage.getItem('username');
  //   const userToken = JSON.parse(username);
  //   return userToken
  // };
  
  // const user = getUser()

  useEffect(() => {
      fetch("http://localhost:8000/project/all")
      .then(response => response.json())
      .then((project) => {
        setProjects(project)
    }).catch((err) => {
        console.log(err);
    });
    
  }, []);

  
  useEffect(() => {
  if (projects !== null) {
    for(let i = 0; i < projects.length; i++){
      fetch(`http://localhost:8000/project/members/${projects[i]._key}`)
        .then(response => response.json())
        .then(data => {
          // eslint-disable-next-line
          if(data.length > 0) {
            // eslint-disable-next-line
            data.filter( f =>{ 
              delete f['password']
              delete f['_id']
              delete f['_key']
              delete f['_rev']
              delete f['email']
            })
            projects[i]['members'] = data
            setMembers([projects[i]._key, data])
          }
        }) 
    }
  }
}, [!projects]);


  if (!projects && members === undefined) {
    return <p>Data is loading...</p>;
  }

  return(
  (projects && members) ?
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title="Projects Overview" subtitle="Dashboard" className="text-sm-left mb-3" />
    </Row>
      <Row>
          {
          projects && members &&
            projects.map((post, idx) => (
            <Col lg="4" md="6" sm="12" className="mb-4" key={idx}>
              <Link to={`/project-overview/${post._key}`} style={{ cursor: 'pointer !important', all: 'unset' }}>
              <Card small className="card-post card-post--1" style={{ cursor: 'pointer' }}>
                <div
                  className="card-post__image"
                  style={{ backgroundImage: `url(${post.icon_path})` }}
                >
                  <Badge
                    pill
                    className={`card-post__category bg-${palletes[projects.indexOf(post)]}`}
                  >
                    {post.project_name}
                  </Badge>
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      transform: "translateY(50%)",
                      position: "absolute",
                      bottom: "0",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                      paddingLeft: "1.5625rem",
                      paddingRight: "1.5625rem",
                      flexWrap: "nowrap",
                    }}
                  >

                    {
                      post.members
                      ?
                      post.members.map( (mem, idx) =>
                        <div className="card-post__author d-flex"
                          style={{
                            transform: "none",
                            marginLeft: "0",
                            position: "relative",
                          }}
                          key={idx}
                        >

                          <span
                            className="card-post__author-avatar card-post__author-avatar--small"
                            style={{ backgroundImage: `url('${mem.image_path}')` }}
                          >
                            By {mem.first_name}
                          </span>
                        </div> 
                      
                        
                      )
                      : 
                      <div className="card-post__author d-flex"
                      style={{
                        transform: "none",
                        marginLeft: "0",
                        position: "relative",
                      }}
                      key={idx}
                    >
                    </div> 
                    }
                  </div>
                </div>
                <CardBody>
                  <h5 className="card-title">
                    <span className="text-fiord-blue">
                      {post.short_desc}
                    </span>
                  </h5>
                  <div className="d-flex flex-column">
                    {/* <p className="card-text d-inline-block mb-3"dangerouslySetInnerHTML={{ __html: post.description }} /> */}
                    <span className="text-muted">{new Date(post.utc_date_created).toLocaleDateString()}</span>
                  </div>
                </CardBody>
              </Card>
              </Link>
            </Col>
          ))
          }
        </Row>

  </Container>
  :
  <Container fluid className="main-content-container px-4">
    <Col lg="12" className="mb-4">
      <Row className="d-flex w-100 align-items-center justify-content-center" style={{ height: '100vh'}}>
        <h1>No Projects</h1>
      </Row>
    </Col>
  </Container>

)};

export default ProjectOverview;
