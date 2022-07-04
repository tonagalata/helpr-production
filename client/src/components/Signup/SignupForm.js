import React, { useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import classes from './SignUpForm.module.css'
import useToken from '../useToken';


export default function SignUpForm(props) {

    const { token, setToken } = useToken();

    const [getUsers, setGetUsers] = useState(null)
    const firstName = useRef("")
    const lastName = useRef("")
    const email = useRef("")
    const userName = useRef("")
    const password = useRef("")

    const handleGetUser = async (username, password) => {
      
        console.log(username, password)
      
        const userNameVal = username
        const passwordVal = password
      
      
      
        const user = `username=${userNameVal}&password=${passwordVal}&grant_type=password`
      
        console.log(user)
      
        const url = `http://localhost:8000/token`
      
      
        //   if (getUser === null){
            fetch(url, {
              method: 'POST',
              headers: new Headers({    
                'Content-Type': 'application/x-www-form-urlencoded',      
              }),
              body: user
            }).then(res => res.json()).then( token => setToken(token))
            
        //   }
      
      };


    const handleCreateUser = (e) => {
  // "disabled": false,
  // "image_path": "string"
    e.preventDefault()
    const firstNameVal = firstName.current.value
    const lastNameVal = lastName.current.value
    const userNameVal = userName.current.value
    const emailVal = email.current.value
    const passwordVal = password.current.value
    const disableVal = false
    const imagePath = ""
    
    const createUser = {
        "first_name": firstNameVal,
        "last_name": lastNameVal,
        "username": userNameVal,
        "email": emailVal,
        "disabled": disableVal,
        "image_path": imagePath,
    }
    console.log(e, createUser)

    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(createUser)
    };

    const url = `http://localhost:8000/user/signup?password=${passwordVal}`


        if (getUsers === null){
        fetch(url, {
            method: 'POST',
            headers: {          
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            'Access-Control-Request-Method': 'GET, POST, DELETE, PUT, OPTIONS',
            'Content-Type':'application/json'
            },
            body: JSON.stringify(createUser)
        }).then(res => console.log(res)).then(data => {
            if(!token){
                handleGetUser(userNameVal, passwordVal)
            }
        })

        }


    };


  return (
    <Container component="main" maxWidth="xs">
      <Link className="btn btn-primary" style={{ textDecoration: 'none', color: "#fff", top: '2em', marginTop: '1em', right: '1em', position: 'absolute' }} href="/all-projects" variant="body2"> ← Go Back To All Projects</Link>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Project Hub Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                inputRef={firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                inputRef={lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                inputRef={email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                inputRef={userName}
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
                autoComplete="current-password"
                inputRef={password}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleCreateUser}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
