import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Button,
  ListGroup,
  ListGroupItem,
  Progress
} from "shards-react";
// import useToken from "../useToken";
import useUser from "../useUser";
// import LoadingImg from "../../images/loading.gif"

const UserDetails = ({props}) => {

  const { user } = useUser();

  const [projectTransaction, setProjectTransaction] = useState(null)

  const [userStatus, setUserStatus] = useState();
  const [userProfile, setUserProfile] = useState(null);

  const [guestViewProfile, setGuestViewProfile] = useState(null);

  const [projects, setProjects] = useState(null)
  const [members, setMembers] = useState(null)


  // eslint-disable-next-line
  const handleDeleteUser = (e) => {

      e.preventDefault()
      
      const url = `http://localhost:8000/user/delete?username=${user}`


      fetch(url, {
        method: 'DELETE',
        headers: new Headers({    
          'Content-Type': 'application/x-www-form-urlencoded',      
        })
      })
      .catch( (err) => {
          console.log(err)
      })

      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('session_date');
      window.location.href = "/signin";
      window.location.reload();
  }


  const handleDisableUser = (e) => {

    if(user) {
      const params = {
        "disabled": false,
        'username' : user
      }
    
      const url = `http://localhost:8000/user/update/info`
    
          fetch(url, {
            method: 'PUT',
            headers: new Headers({ 
              'Accept': 'application/json',
              'Content-Type':'application/json'  
            }),
            body: JSON.stringify(params)
          }).then(
            d =>
            window.location.reload()
          )
      }

  }



// console.log(props, "<------------- user detail")

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
            setMembers([projects[i]._key, data])
          }
        }) 
    }
  }
}, [!projects, !userProfile]);



    useEffect(() => {
    if (guestViewProfile === null && props){
      fetch(`http://localhost:8000/user/${props.match.params.username}/info`)
      .then(response => response.json())
      // .then(data => console.log(data.username))
      .then(data =>{
        setGuestViewProfile(data)
      })
    }
  },[guestViewProfile]);

    useEffect(() => {
    if (userProfile === null){
      fetch(`http://localhost:8000/user/${user}/info`)
      .then(response => response.json())
      // .then(data => console.log(data.username))
      .then(data =>{
        setUserProfile(data)

        if (data.disabled === false){
          setUserStatus("Active")
        } else {
          setUserStatus("Disabled")
        }
      })
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
  
  return (
  (userProfile && !guestViewProfile && userStatus === 'Active')
  ?
  <Card small className="mb-4 pt-3">
    <CardHeader className="border-bottom text-center">
      <Button onClick={handleDisableUser} outline size="sm" className="mb-2" theme="danger" style={{ position: 'absolute', top: '1em', right: '1em' }}>
        <i className="material-icons mr-1">delete_forever</i> Delete
      </Button>
      <div className="mb-3 mx-auto">
        <img
          className="rounded-circle"
          src={userProfile.image_path}
          alt={`${userProfile.first_name} ${userProfile.last_name}`}
          width="100"
        />
      </div>
      <h4 className="mb-0">{`${userProfile.first_name} ${userProfile.last_name}`}</h4>
      <span className="text-muted d-block mb-2">{userProfile.username}</span>
      <div className="d-flex flex-row justify-content-center align-items-center" style={{ gap: '1em' }}>
        <Button pill outline size="sm" className="mb-2" disabled={true}>
          <i className="material-icons mr-1">person_add</i> Follow
        </Button>
        <span>Account Status: <span className={`${userStatus === 'Active' ? `text-success` : `text-danger`}`}>{userStatus}</span></span>
      </div>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="px-4">
        <div className="progress-wrapper">
          <strong className="text-muted d-block mb-2">
            Available Funds
          </strong>
          <strong>
            ${userProfile.available_funds}
          </strong>
          <Progress
            className="progress-sm"
            value={(userProfile.available_funds / 100000)*100}
          >
            <span className="progress-value">
              {(userProfile.available_funds / 100000)*100}%
            </span>
          </Progress>
        </div>
      </ListGroupItem>
      <ListGroupItem className="p-4 lg-1">
        <strong className="text-muted d-block mb-2">
          Project Membership
        </strong>
        <table className="table mb-0">
              <thead className="bg-light">
                <tr>
                  <th scope="col" className="border-0">
                    #
                  </th>
                  <th scope="col" className="border-0">
                    Project
                  </th>
                  <th scope="col" className="border-0">
                    Funds
                  </th>
                  <th scope="col" className="border-0">
                    Likes
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  members && userProfile ?
                  projects.filter(g => g.members && g.members.map(e => e.username).includes(userProfile.username)).map((e, idx) => 
                  // eslint-disable-next-line
                    <tr key={idx}>
                      <td>{ projects.filter(g => g.members && g.members.map(e => e.username).includes(userProfile.username)).indexOf(e) + 1 }</td>
                      <td>{ e.project_name}</td>
                      <td>${ e.funds.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</td>
                      <td>{ e.hearts }</td>
                    </tr>
                    )
                    : 
                    <tr>
                      <td className="text-center" colSpan="4">
                        Not A Member of A Project
                      </td>
                    </tr>
                }

              </tbody>
            </table>
      </ListGroupItem>
    </ListGroup>
  </Card>
  
  :

  guestViewProfile && props.match.params.username &&
  <Card small className="mb-4 pt-3">
      <CardHeader className="border-bottom text-center">
        <div className="mb-3 mx-auto">
          <img
            className="rounded-circle"
            src={guestViewProfile.image_path}
            alt={`${guestViewProfile.first_name} ${guestViewProfile.last_name}`}
            width="110"
          />
        </div>
        <h4 className="mb-0">{`${guestViewProfile.first_name} ${guestViewProfile.last_name}`}</h4>
        <span className="text-muted d-block mb-2">{guestViewProfile.username}</span>
        <div className="d-flex flex-row justify-content-center align-items-center" style={{ gap: '1em' }}>
        <Button pill outline size="sm" className="mb-2" disabled={true}>
          <i className="material-icons mr-1">person_add</i> Follow
        </Button>
        <span>Account Status: <span className={`${userStatus === 'Active' ? `text-success` : `text-danger`}`}>{userStatus}</span></span>
      </div>
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="px-4">
          <div className="progress-wrapper">
            <strong className="text-muted d-block mb-2">
              Available Funds
            </strong>
            <strong>
              ${guestViewProfile.available_funds}
            </strong>
            <Progress
              className="progress-sm"
              value={(guestViewProfile.available_funds / 100000)*100}
            >
              <span className="progress-value">
                {(guestViewProfile.available_funds / 100000)*100}%
              </span>
            </Progress>
          </div>
        </ListGroupItem>
        <ListGroupItem className="p-4 lg-1">
          <strong className="text-muted d-block mb-2">
            Project Membership
          </strong>
          <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0">
                      #
                    </th>
                    <th scope="col" className="border-0">
                      Project
                    </th>
                    <th scope="col" className="border-0">
                      Funds
                    </th>
                    <th scope="col" className="border-0">
                      Likes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    members && guestViewProfile ?
                    projects.filter(g => g.members && g.members.map(e => e.username).includes(guestViewProfile.username)).map((e, idx) => 
                      <tr key={idx}>
                        <td>{ projects.filter(g => g.members && g.members.map(e => e.username).includes(userProfile.username)).indexOf(e) + 1 }</td>
                        <td>{ e.project_name}</td>
                        <td>${ e.funds.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</td>
                        <td>{ e.hearts }</td>
                      </tr>
                      )
                      : 
                      <tr>
                        <td className="text-center" colSpan="4">
                          Not A Member of A Project
                        </td>
                      </tr>
                  }

                </tbody>
              </table>
        </ListGroupItem>
      </ListGroup>
    </Card>
)};

export default UserDetails;
