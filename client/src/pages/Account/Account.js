import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import classes from './Account.module.css'
import useToken from "../../components/useToken";
import useUser from "../../components/useUser";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
  
const Account = () => {

  const { user, setUser } = useUser();
  const { token, setToken } = useToken();


  const [userStatus, setUserStatus] = useState();
  const [password, setpassword] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [profileImg, setprofileImg] = useState("https://source.unsplash.com/random)");

    useEffect(() => {
    if (user){
      fetch(`http://localhost:8000/user/${user}/info`)
      .then(response => response.json())
      // .then(data => console.log(data.username))
      .then(data =>{
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setUsername(data.username);
        setEmail(data.email);
        setpassword("***************")

        if(data.image_path !== ""){
          setprofileImg(data.image_path)
        }

        if (data.disabled == false){
          setUserStatus("Active")
        } else {
          setUserStatus("Disabled")
        }
      })
    }
  },[]);

  const handleUpdateUserInfo =  () => {
    handleGetUser();

   const params = {
      'image_path': profileImg,
      'first_name' : firstName,
      'last_name' : lastName,
      'email' : email,
      'username' : user
    }

    console.log(token)
  
    const url = `http://localhost:8000/user/update/info`
  
        fetch(url, {
          method: 'PUT',
          headers: new Headers({
            'Authorization': `Bearer ${token.access_token}`,      
            'Accept': 'application/json',
            'Content-Type':'application/json'  
          }),
          body: JSON.stringify(params)
        })
        // .then(res => res.json())
        // .then(data => {
        //   console.log(data)
        // })
  }
  const handleUpdatePassword =  () => {
  
    const url = `http://localhost:8000/user/update-password?username=${user}&password=${password}`
  
        fetch(url, {
          method: 'PUT',
          headers: new Headers({
            'Authorization': `Bearer ${token.access_token}`,      
            'Accept': 'application/json',
            'Content-Type':'application/json'  
          })
        })
        .then(res => res.json())
        .then(data => {
          console.log(data)
        })
  }

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
    .then(data => {
      console.log(data)
    })
      

      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('session_date');
      window.location.reload();
          
    
    };

    const handleGetUser = async (e) => {

      e.preventDefault()
    
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

    // const handleAddMember = (project_key, user) => {

    //   const member_info = {
    //     "project_key": project_key,
    //     "username": [
    //       user
    //     ],
    //     "role": "Member"
    //   }

    //   const url = `http://localhost:8000/project/members/add`
    
    //       fetch(url, {
    //         method: 'POST',
    //         headers: new Headers({
    //           'Authorization': `Bearer ${token.access_token}`,      
    //           'Accept': 'application/json',
    //           'Content-Type':'application/json'  
    //         }),
    //         body: JSON.stringify(member_info)
    //       })
    //       .then(res => res.json())
    // }

    if(!(firstName && lastName && email && username)) {
      return <span style={{ margin: '0 auto', fontSize: '100px', textAlign: 'center' }}>Loading...</span>
    }


  return (
    <div className={classes.mainDiv} style={{ marginTop: '200px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <span className={classes.accountImage} style={{ backgroundImage: `url(${profileImg})` }}>
      </span>
      <div className={classes.userInfo}>
      <Container component="main" maxWidth="lg">
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginTop: '7em', marginBottom: '2em' }}>
          Status: {userStatus == "Active" ? <span style={{color: "green"}}>Active</span> : <span style={{color: "red"}}>Disabled</span>}
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="first_name"
                variant="outlined"
                required
                fullWidth
                id="first_name"
                label="First Name"
                defaultValue={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="last_name"
                label="Last Name"
                name="last_name"
                autoComplete="lname"
                defaultValue={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="email"
                label="Email"
                type="email"
                id="email"
                autoComplete="email"
                defaultValue={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="profile"
                label="Profile Image"
                type="profile_image"
                id="profileImage"
                autoComplete="profile image"
                defaultValue={profileImg}
                onChange={e => setprofileImg(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
            <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="password"
                onChange={e => setpassword(e.target.value)}
                defaultValue={"*************"}
              />
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Project Name</TableCell>
                      <TableCell align="right">Members</TableCell>
                      <TableCell align="right">Funds</TableCell>
                      <TableCell align="right">Likes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                        <TableCell align="right">{row.carbs}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <div className={classes.buttonGroup}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleUpdatePassword}
            >
              Update Password
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              onClick={handleUpdateUserInfo}
            >
              Update User
            </Button>
          </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="error"
              className={classes.submit}
              onClick={handleDeleteUser}
            >
              Delete User
            </Button>
        </form>
      </div>
    </Container>
      </div>
    </div>
  );
};
  
export default Account;