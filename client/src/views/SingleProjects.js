import React, {useEffect, useState} from "react";
import ReactQuill from "react-quill";
import { 
  Container, 
  Row, 
  Col,
  Card,
  CardBody,
  Badge,
  Button,
  Form,
  FormInput,
  FormGroup,
  CardHeader,
  ListGroup,
  ListGroupItem,
  ButtonGroup,
  Modal,
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import useUser from "../components/useUser";
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

const SingleProjects = (props) => {

  const style = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    // overflow: 'auto',
    height: '90%'
  };

  const { user } = useUser();
  const [projects, setProjects] = useState(null)
  const [members, setMembers] = useState(null)

  const [projectFund, setProjectFund] = useState(null)

  const [projectTransaction, setProjectTransaction] = useState(null)


  const [projectName, setProjectName] = useState(null)
  const [projectRepo, setProjectRepo] = useState(null)
  const [projectDesc, setProjectDesc] = useState(null)
  const [projectShortDesc, setProjectShortDesc] = useState(null)
  const [projectImage, setProjectImage] = useState(null)


  const [open, setOpen] = useState(false);
  const [getAllUsers, setGetAllUsers] = useState(null);
  const [openMember, setOpenMembers] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleOpenMembers = () => setOpenMembers(true);
  const handleCloseMembers = () => setOpenMembers(false);
  const handleClose = () => setOpen(false);


  useEffect(() => {
    if (getAllUsers === null){
      fetch("http://localhost:8000/user/search")
      .then(response => response.json())
      .then(data => {
        setGetAllUsers(data)
        setCurrentUser(data['users'].filter(e => e.username === user))
      })
    }
  },[getAllUsers]);


  useEffect(() => {
    fetch(`http://localhost:8000/project/${props.match.params.project}`)
    .then(response => response.json())
    .then((project) => {
        setProjects(project)
        setProjectName(project.project_name)
        setProjectRepo(project.github_repo)
        setProjectDesc(project.description)
        setProjectShortDesc(project.short_desc)
        setProjectImage(project.icon_path)
      }).catch((err) => {
          console.log(err);
      });
      
    }, []);


  useEffect(() => {
    if (projects !== null) {
        fetch(`http://localhost:8000/project/members/${projects._key}`)
          .then(response => response.json())
          .then(data => {
            if(data.length > 0) {
              // eslint-disable-next-line
              data.filter( f =>{ 
                delete f['password']
                delete f['_id']
                delete f['_key']
                delete f['_rev']
                delete f['email']
              })
              projects['members'] = data
              setMembers([projects._key, data])
            }
          }) 
    }
  }, [!projects]);

  useEffect(() => {
    if (projectTransaction === null && projects !== null){
      fetch(`http://localhost:8000/fund/get-all`)
      .then(response => response.json())
      .then(data => {
        data.filter( pro => pro.project_id === projects._id)
        setProjectTransaction(data)
      })
    }
  },[projectTransaction, !projects]);

  const handleDeleteMember = (mem) => {
    

    const proj_k = projects._key
    
    const url = `http://localhost:8000/project/members/${proj_k}/${mem}`
  
    fetch(url, {
      method: 'DELETE',
      headers: new Headers({  
        'Accept': 'application/json',
        'Content-Type':'application/json'  
      })
    })

    setTimeout(function(){
      window.location.reload()
    }, 1000);

    
  };
  
  const handleAddMember = (mem) => {
    
    const proj_k = projects._key
    
    const member_info = {
      "project_key": proj_k,
      "username": [
        mem
      ],
      "role": "Member"
    }
    
    const url = `http://localhost:8000/project/members/add`
    
    fetch(url, {
      method: 'POST',
      headers: new Headers({
        // 'Authorization': `Bearer ${token}`,      
        'Accept': 'application/json',
        'Content-Type':'application/json'  
        }),
        body: JSON.stringify(member_info)
      })

      setTimeout(function(){
        window.location.reload()
      }, 1000);
      
      };
  
  const handleUpdateInfo = () => {
    
    const proj_k = projects._key
    
    const project_info = {
      "project_name": projectName,
      "github_repo": projectRepo,
      "description": projectDesc,
      "short_desc": projectShortDesc,
      "icon_path": projectImage
    }
    
    const url = `http://localhost:8000/project/update/${proj_k}`
    
    fetch(url, {
      method: 'PUT',
      headers: new Headers({   
        'Accept': 'application/json',
        'Content-Type':'application/json'  
        }),
        body: JSON.stringify(project_info)
      })

      setTimeout(function(){
        window.location.reload()
      }, 1000);
      
      };

      const handleAddFunds = () => {

        console.log(projectFund, user)
        
        const project_info = {
          "project_id": projects._id,
          "username": user,
          "funding_amount": projectFund
        }
        
        const url = `http://localhost:8000/fund/project`
        
        fetch(url, {
          method: 'POST',
          headers: new Headers({   
            'Accept': 'application/json',
            'Content-Type':'application/json'  
            }),
            body: JSON.stringify(project_info)
          }).catch((err) => {
            console.log(err);
        });
    
          setTimeout(function(){
            window.location.reload()
          }, 1000);
          
      };

      const handleUpdateHeart = () => {
  
          const proj_k = projects._key
          
          const project_info = {
            "hearts": projects.hearts + 1
          }
          const url = `http://localhost:8000/project/update/${proj_k}`
          
          fetch(url, {
            method: 'PUT',
            headers: new Headers({   
              'Accept': 'application/json',
              'Content-Type':'application/json'  
              }),
              body: JSON.stringify(project_info)
            })
      
            setTimeout(function(){
              window.location.reload()
            }, 1000);
            
      };


  return(
  (projects || members) &&
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4 d-flex flex-row">
      <PageTitle title={`${projects.project_name}`} subtitle="Dashboard" className="text-sm-left mb-3" /> 
    </Row>
      <Row className="d-flex justify-content-between" 
      style={{ marginLeft: '0em', marginRight: '0em'}}
      >
        <span className="text-uppercase page-subtitle">
          Project Funding
          <h3 className="text-sm-left mb-3">{`$${projects.funds}`}</h3>
        </span>

      <span>
        <i className="material-icons mr-1" style={{ color: 'red', fontSize: '35px' }}>favorite_border</i>
        <span 
        style={{ 
          borderRadius: '100%', 
          width: '15px', 
          height: '15px', 
          fontSize: '11px', 
          textAlign: 'center', 
          backgroundColor: '#fff', 
          fontWeight: '800', 
          position: 'absolute', 
          marginLeft: '-1.7em', 
          marginTop: '1.2em'  }}
          >
            {projects.hearts <= 9 ? projects.hearts : `9+`}
        </span>
      </span>
      </Row>
      <Row>
            <Col lg="12" className="mb-4">
              <Card large="true" className="card-post card-post--1">
                <div
                  className="card-post__image"
                  style={{ backgroundImage: `url(${projects.icon_path})` }}
                >
                  {/* <Badge> */}
                  {
                    // console.log(projects, "<------------ members")
                    projects.members && projects.members.map(u => u.username).includes(user) &&
                    <Button className={` bg-${palletes[0]}`} style={{ border: 'none' }} onClick={handleOpen}>
                      <i className="material-icons mr-1">edit</i> Edit Project
                    </Button>
                  }
                  {/* </Badge> */}
                  <Badge
                    pill
                    className={`card-post__category bg-${palletes[0]}`}
                  >
                    {projects.project_name}
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
                    projects.members
                    ?
                    members[1].map( (mem, idx)=>
                        <div className="card-post__author d-flex"
                          style={{
                            position: "relative",
                            transform: "none",
                            marginLeft: "0",
                          }}
                          key={idx}
                        >
                          <Link
                            to={`/user-profile/${mem.username}`}
                            className="card-post__author-avatar card-post__author-avatar--small"
                            style={{ backgroundImage: `url('${mem.image_path}')` }}
                          >
                            By {mem.first_name}
                          </Link>
                        </div> 
                        )
                      : 
                      <div className="card-post__author d-flex"
                      style={{
                        transform: "none",
                        marginLeft: "0",
                        position: "relative",
                      }}
                    >
                    </div> 
                    }
                  </div>
                </div>
                <CardBody>
                  <h5 className="card-title">
                    <span className="text-fiord-blue">
                      {projects.short_desc}
                    </span>
                    <Button outline style={{ position: 'absolute', right: '1em', top: '14em' }} onClick={handleUpdateHeart}><i className="material-icons mr-1">thumb_up</i> Like</Button>
                  </h5>
                  <div className="d-flex flex-column">
                    <p className="card-text d-inline-block mb-3"dangerouslySetInnerHTML={{ __html: projects.description }} />

                  {
                    currentUser &&
                    <div className="d-flex flex-row mb-3">
                        <FormInput type="number" placeholder="$100000" onChange={(e) => setProjectFund(e.target.value)} />
                        <Button outline theme={"success"} style={{ marginLeft: '1em' }} onClick={handleAddFunds}>Add Funds</Button>
                    </div>
                  }
                  <span className="text-muted">{new Date(projects.utc_date_created).toLocaleDateString()}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          <Col lg="12" className="mb-4">
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">{projects.project_name} Members</h6>
                {
                  members &&
                  members[1].filter(f => f.username.includes(user)).length > 0 &&
                  <ButtonGroup style={{ position: 'absolute', right: '1em', top: '1em' }}>
                    <Button outline theme="success" onClick={handleOpenMembers}>
                    <i className="material-icons mr-1">person_add_alt</i> Add Member
                    </Button>
                  </ButtonGroup>
                }
              </CardHeader>
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                    <table className="table mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th scope="col" className="border-0">
                            #
                          </th>
                          <th scope="col" className="border-0">
                            First Name
                          </th>
                          <th scope="col" className="border-0">
                            Last Name
                          </th>
                          <th scope="col" className="border-0">
                            Username
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          members 
                          ?
                          members[1].map( (membe, idx) =>
                            <tr key={idx}>
                              <td>{ idx + 1 }</td>
                              <td>{ membe.first_name }</td>
                              <td>{ membe.last_name }</td>
                              <td>{ membe.username }</td>
                              <td>
                                {
                                  members[1].filter(f => f.username === user).length > 0 && membe.username === user &&
                                  <ButtonGroup>
                                    <Button theme="danger" onClick={() => handleDeleteMember(membe.username)}>Delete</Button>
                                  </ButtonGroup>
                                }
                              </td>
                            </tr>
                          ) :
                          <tr>
                            <td style={{ textAlign: 'center', fontSize: '2em', padding: '2em'}} colSpan="4">
                              This Project Does Not Have Members
                            </td>
                          </tr>
                        }

                      </tbody>
                    </table>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
          <Col>
          <Modal
            lg="12"
            keepMounted
            open={openMember}
            toggle={handleCloseMembers}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
            sx={style}
          >
              <table className="table mb-0 table-hover">
                <thead className="bg-light">
                <tr>
                          <th scope="col" className="border-0">
                            #
                          </th>
                          <th scope="col" className="border-0">
                            First Name
                          </th>
                          <th scope="col" className="border-0">
                            Last Name
                          </th>
                          <th scope="col" className="border-0">
                            Username
                          </th>
                        </tr>
                </thead>
                  <tbody>
                    {
                      getAllUsers &&
                      getAllUsers.users.map( (membe, idx) => 
                        // e.map( (membe, idx) =>
                        <tr key={idx}>
                          <td>{ idx + 1 }</td>
                          <td>{ membe.first_name }</td>
                          <td>{ membe.last_name }</td>
                          <td>{ membe.username }</td>
                          <td>
                            <ButtonGroup>
                              <Button theme="success" onClick={() => handleAddMember(membe.username)}>Add</Button>
                            </ButtonGroup>
                          </td>
                        </tr>
                      // )

                      )
                    }
                  </tbody>
              </table>
              </Modal>
          </Col>
          <Col lg="12" className="mb-4">
            <Card small className="mb-4">
              <Modal
              large="true"
                  lg="12"
                  keepMounted
                  open={open}
                  toggle={handleClose}
                  aria-labelledby="keep-mounted-modal-title"
                  aria-describedby="keep-mounted-modal-description"
                  sx={style}
                >
              <CardHeader className="border-bottom">
                <h6 className="m-0">{projects.project_name}</h6>
              </CardHeader>
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                      <Form>
                        <Row form>
                          {/* First Name */}
                          <Col md="12" className="form-group">
                            <label htmlFor="feprojname">Project Name</label>
                            <FormInput
                              id="feprojname"
                              placeholder="Project Name"
                              value={projectName}
                              onChange={(e) => setProjectName(e.target.value)}
                            />
                          </Col>
                          {/* Last Name */}
                          <Col md="12" className="form-group">
                            <label htmlFor="fegithubrepo">GitHub Repo</label>
                            <FormInput
                              id="fegithubrepo"
                              placeholder="GitHub Repo"
                              value={projectRepo}
                              onChange={(e) => setProjectRepo(e.target.value)}
                            />
                          </Col>
                        </Row>
                        <Row form>
                          {/* Email */}
                          <Col md="12" className="form-group">
                            <label htmlFor="feShortDesc">Short Description</label>
                            <FormInput
                              id="feShortDesc"
                              placeholder="Short Description"
                              value={projectShortDesc}
                              onChange={(e) => setProjectShortDesc(e.target.value)}
                              autoComplete="short description"
                            />
                          </Col>
                          {/* Password */}
                          <Col md="12" className="form-group">
                            <label htmlFor="feprojectImage">Project Image</label>
                            <FormInput
                              id="feprojectImage"
                              placeholder="Project Image"
                              value={projectImage}
                              onChange={(e) => setProjectImage(e.target.value)}
                              autoComplete="project-image"
                            />
                          </Col>
                        </Row>
                        <FormGroup style={{ height: '50% !important', overflow: 'scroll'}}>
                          <label htmlFor="feDescription">Description</label>
                          <ReactQuill className="add-new-post__editor mb-1"
                            id="feDescription"
                            placeholder="Long Description"
                            value={projectDesc} 
                            onChange={setProjectDesc}
                            style={{ height: '50% !important', overflow: 'scroll'}}
                            
                          />
                        </FormGroup>
                        <div className="d-flex justify-content-between w-100">
                          <Button theme="accent" className="mx-2" onClick={handleUpdateInfo}>Update Info</Button>
                        </div>
                      </Form>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
              </Modal>
            </Card>
          </Col>
          <Col lg="12" className="mb-4">
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">{projects.project_name} Transactions</h6>
              </CardHeader>
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                    <table className="table mb-0 table-hover">
                      <thead className="bg-light">
                        <tr>
                          <th scope="col" className="border-0">
                            #
                          </th>
                          <th scope="col" className="border-0">
                            Full Name
                          </th>
                          <th scope="col" className="border-0">
                            Amount
                          </th>
                          <th scope="col" className="border-0">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                        projectTransaction &&
                        projectTransaction.map( (funder, idx) => 

                        projects._id === funder.project_id &&
                        <tr key={idx}>
                          <td>{projectTransaction.indexOf(funder)}</td>
                          <td>{getAllUsers && `${getAllUsers['users'].filter(f => f.username === funder.username)[0]['first_name']} ${getAllUsers['users'].filter(f => f.username === funder.username)[0]['last_name']}`}</td>
                          <td>${funder.funding_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                          <td>{new Date(funder.funding_date).toLocaleDateString()}</td>
                        </tr>
                        )
                        }
                      </tbody>
                    </table>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>

  </Container>
)};

export default SingleProjects;
