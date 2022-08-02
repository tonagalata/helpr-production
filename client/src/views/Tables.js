import { Switch } from "@mui/material";
import React, {useState, useEffect} from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import useUser from "../components/useUser";
// import LoadingImg from "../images/loading.gif"

const Tables = () => {

  const { user } = useUser();

  const [projectTransaction, setProjectTransaction] = useState(null)

  const [colorUpdate, setColorUpdate] = useState(false);
  const [userProfile, setUserProfile] = useState(null);


  const [projects, setProjects] = useState(null)
  // const [members, setMembers] = useState(null)

  const handleChangeColor = () => {
    setColorUpdate(!colorUpdate)
  }

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
  if (projects !== null && userProfile !== null) {
    for(let i = 0; i < projects.length; i++){
      fetch(`http://localhost:8000/project/members/${projects[i]._key}`)
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
            projects[i]['members'] = data
            // setMembers([projects[i]._key, data])
          }
        }) 
    }
  }
}, [!projects, !userProfile]);



    useEffect(() => {
    if (userProfile === null){
      fetch(`http://localhost:8000/user/${user}/info`)
      .then(response => response.json())
      // .then(data => console.log(data.username))
      .then(data =>{
        setUserProfile(data)
      })
      .then()
    }
  },[userProfile]);

  useEffect(() => {
    if (projectTransaction === null && userProfile !== null){
      fetch(`http://localhost:8000/fund/get-all`)
      .then(response => response.json())
      .then(data => {
        data.filter( pro => pro.username === userProfile.username)
        setProjectTransaction(data)
      })
    }
  },[projectTransaction, !userProfile]);


  return(
  userProfile &&
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle sm="4" title="Transactions" subtitle={`${userProfile.first_name} ${userProfile.last_name}'s`} className="text-sm-left" />
    </Row>

    {/* Default Light Table */}
    <Row>
      <Col>
        <Card small className="mb-4 overflow-hidden">
          <CardHeader className={`border-bottom d-flex justify-content-between ${colorUpdate && `bg-dark`}`}>
            {/* <h6 className={`m-0 ${colorUpdate && `text-white`}`}>Full Users Transactions</h6> */}
            <Switch defaultValue={colorUpdate} onChange={handleChangeColor}/>
          </CardHeader>
          <CardBody className={`${colorUpdate && `bg-dark`} p-0 pb-3`}>
            <table className={`table mb-0 ${colorUpdate && `table-dark`}`}>
              <thead className={`${colorUpdate ? `table-dark` : `bg-light`}`}>
                <tr>
                  <th scope="col" className="border-0">
                    #
                  </th>
                  <th scope="col" className="border-0">
                    Project Name
                  </th>
                  <th scope="col" className="border-0">
                    Amount
                  </th>
                  <th scope="col" className="border-0">
                    Short Description
                  </th>
                  <th scope="col" className="border-0">
                    Total Funds
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  projectTransaction && 
                  projects ? 
                  projectTransaction.filter(u => u.username === userProfile.username).map((transactions, idx) =>
                <tr key={idx}>
                  <td>{projectTransaction.filter(u => u.username === userProfile.username).indexOf(transactions) + 1}</td>
                  <td>{projects.filter(p => p._id === transactions.project_id)[0]['project_name']}</td>
                  <td>${transactions.funding_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                  <td className="w-25">{projects.filter(p => p._id === transactions.project_id)[0]['short_desc']}</td>
                  <td>{projects.filter(p => p._id === transactions.project_id)[0]['funds']}</td>
                </tr>
                ) :
                <tr>
                  <td 
                  className="text-center" 
                  colSpan="5">
                    No Transactions Avaliable
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
)};

export default Tables;
