import React, { useState, useEffect } from "react";
import useToken from "../useToken";
import useUser from "../useUser";
import LoadingImg from "../../images/loading.gif"
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  Button
} from "shards-react";

const UserAccountDetails = ({ title }) => {

  const { user, setUser } = useUser();
  const { token, setToken } = useToken();
  const [password, setpassword] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState();
  const [zipcode, setZipcode] = useState();
  const [userStatus, setUserStatus] = useState();
  const [profileImg, setprofileImg] = useState("https://source.unsplash.com/random");

    useEffect(() => {
    if (user){
      fetch(`http://localhost:8000/user/${user}/info`)
      .then(response => response.json())
      // .then(data => console.log(data.username))
      .then(data =>{
        setRole(data.role)
        setZipcode(data.zipcode)
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setUsername(data.username);
        setEmail(data.email);
        setpassword("***************")

        if(data.image_path !== ""){
          setprofileImg(data.image_path)
        }

        if (data.disabled === false){
          setUserStatus("Active")
        } else {
          setUserStatus("Disabled")
        }
      })
    }
  },[user]);

  // DwWv4QERd3!8vv4

  // console.log(firstName, lastName, email, username, user, "<--------------- //")

  const handleUpdateUserInfo =  () => {
    handleGetUser();

   const params = {
      'image_path': profileImg,
      'first_name' : firstName,
      'last_name' : lastName,
      'email' : email,
      'username' : user,
      'role': role,
      'zipcode' : zipcode
    }
  
    const url = `http://localhost:8000/user/update/info`
  
        fetch(url, {
          method: 'PUT',
          headers: new Headers({
            // 'Authorization': `Bearer ${token}`,      
            'Accept': 'application/json',
            'Content-Type':'application/json'  
          }),
          body: JSON.stringify(params)
        })
        .then(
          d =>
          window.location.reload()
        )
  }
  const handleUpdatePassword =  () => {
  
    const url = `http://localhost:8000/user/update/password?username=${user}&password=${password}`
  
        fetch(url, {
          method: 'PUT',
          headers: new Headers({
            'Authorization': `Bearer ${token}`,      
            'Accept': 'application/json',
            'Content-Type':'application/json'  
          })
        })
        .then(res => res.json())
        .then(
          d =>
          window.location.reload()
        )
  }

  // eslint-disable-next-line
  const handleDeleteUser = async () => {
    
    const url = `http://localhost:8000/user/delete?username=${user}`
  
    fetch(url, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': `Bearer ${token.access_token}`,      
        'Accept': 'application/json',
        'Content-Type':'application/json'  
      })
    })
    .then(res => res.json())

      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('session_date');
      window.location.reload();
          
    
    };

    const handleGetUser = async (e) => {
    
      const user = `username=${username}&password=${password}&grant_type=password`
    
      const url = `http://localhost:8000/token`
    

          fetch(url, {
            method: 'POST',
            headers: new Headers({    
              'Content-Type': 'application/x-www-form-urlencoded',      
            }),
            body: user
          })
          .then(async res => { 
              if (!res.ok) {
                  const error = res.status;
                  return Promise.reject(error);
              } else {
                  return res.json()
              }
          })
          .then( UserToken => {
              setToken(UserToken.access_token)
              setUser(username)
          })
    };

    if(!(firstName && lastName && email && username && user && userStatus === 'Active')) {
      return <span style={{ margin: '0 auto', fontSize: '100px', textAlign: 'center', display: "flex", justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <img src={LoadingImg} alt="loading" />
      </span>
    }

  return (
  <Card small className="mb-4">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
          <Col>
            <Form>
              <Row form>
                {/* First Name */}
                <Col md="6" className="form-group">
                  <label htmlFor="feFirstName">First Name</label>
                  <FormInput
                    id="feFirstName"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Col>
                {/* Last Name */}
                <Col md="6" className="form-group">
                  <label htmlFor="feLastName">Last Name</label>
                  <FormInput
                    id="feLastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Col>
              </Row>
              <Row form>
                {/* Email */}
                <Col md="6" className="form-group">
                  <label htmlFor="feEmail">Email</label>
                  <FormInput
                    type="email"
                    id="feEmail"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </Col>
                {/* Password */}
                <Col md="6" className="form-group">
                  <label htmlFor="fePassword">Password</label>
                  <FormInput
                    type="password"
                    id="fePassword"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </Col>
              </Row>
              <FormGroup>
                <label htmlFor="feRole">Zipcode</label>
                <FormInput
                  id="feZipcode"
                  placeholder="Zipcode"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="feRole">User Type</label>
                <FormInput
                  id="feRole"
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={true}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="feAddress">Profile Image</label>
                <FormInput
                  id="feAddress"
                  placeholder="Address"
                  value={profileImg}
                  onChange={(e) => setprofileImg(e.target.value)}
                />
              </FormGroup>
              <div className="d-flex justify-content-between w-100">
                <Button theme="accent" className="mx-2" onClick={handleUpdateUserInfo}>Update Account</Button>
                <Button theme="info" className="mx-2" onClick={handleUpdatePassword}>Update Password</Button>
              </div>
            </Form>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  </Card>
)};

export default UserAccountDetails;
