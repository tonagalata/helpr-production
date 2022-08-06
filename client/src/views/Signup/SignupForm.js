import React, { useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import classes from './SignUpForm.module.css'
import useToken from '../../components/useToken';
import useUser from "../../components/useUser";
import { MenuItem, Select } from "@mui/material";


export default function SignUpForm(props) {

    const { token, setToken } = useToken();
    const { user, setUser} = useUser();

    // const [getUsers, setGetUsers] = useState(null)
    const firstName = useRef("")
    const lastName = useRef("")
    const email = useRef("")
    const userName = useRef("")
    const zipcode = useRef("")
    const imagePath = useRef("")
    const password = useRef("")
    const userRoleSel = useRef("");

    const handleChange = (event) => {
      userRoleSel.current = event.target.value;
      console.log(userRole[userRole.indexOf(props.match.params.choice.toUpperCase())], userRoleSel.current)
    };

    const userRole = ['RBT', 'CHILD', 'PARENT', 'ADMIN']


    if(props.match){
      console.log(userRole[userRole.indexOf(props.match.params.choice.toUpperCase())], userRoleSel.current)
    //   // if (props.match.params.choice === 'rbt'){
    //   //     // setuserRole(() => 'RBT');
    //   //   console.log(props.match.params.choice)
    //   // }
    //   // if (props.match.params.choice === 'admin'){
    //   //     setuserRole('ADMIN');
    //   // }
    //   // if (props.match.params.choice === 'child'){
    //   //     setuserRole('CHILD');
    //   // }
    //   // if (props.match.params.choice === 'parent'){
    //   //     setuserRole('PARENT');
    //   // }
    }

    const handleGetUser = async (username, password) => {
      
        const userNameVal = username
        const passwordVal = password
      
      
      
        const users = `username=${userNameVal}&password=${passwordVal}&grant_type=password`
      
        const url = `http://localhost:8000/token`
      
      
        //   if (getUser === null){
            fetch(url, {
              method: 'POST',
              headers: new Headers({    
                'Content-Type': 'application/x-www-form-urlencoded',      
              }),
              body: users
            }).then(res => res.json()).then( token => {
              setToken(token)
              setUser(username)
            })
            
        //   }
      
      };


    const handleCreateUser = (e) => {

        e.preventDefault()

        const userType = userRole[userRole.indexOf(props.match.params.choice.toUpperCase())]
        
        const firstNameVal = firstName.current.value
        const lastNameVal = lastName.current.value
        const userNameVal = userName.current.value
        const emailVal = email.current.value
        const passwordVal = password.current.value
        const imagePathVal = imagePath.current.value
        const zipcodeVal = zipcode.current.value
        const roleVal = (!userRoleSel ? userRoleSel : userType) || "GUEST"
        const disableVal = false

        const createUser = {
            "first_name": firstNameVal,
            "last_name": lastNameVal,
            "username": userNameVal,
            "zipcode": zipcodeVal,
            "email": emailVal,
            "disabled": disableVal,
            "role": roleVal,
            "image_path": imagePathVal,
        }

        const url = `http://localhost:8000/user/signup?password=${passwordVal}`


            if (!user && (firstNameVal && lastNameVal && userNameVal && emailVal && imagePathVal)){
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
            }).then(res => res.json())
            .then(data => {
                if(!token){
                  handleGetUser(userNameVal, passwordVal)
                }
            })

            }


    };


  return (
    <Container component="main" maxWidth="md">
      {/* <Link className="btn btn-primary" style={{ textDecoration: 'none', color: "#fff", top: '2em', marginTop: '1em', right: '1em', position: 'absolute' }} href="/project-overview" variant="body2"> ← Go Back To All Projects</Link> */}
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="zipcode"
                label="Zipcode"
                name="zipcode"
                autoComplete="zipcode"
                inputRef={zipcode}
              />
            </Grid>
            <Grid item xs={`${ props.match ? 6 : 12}`}>
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
            {
              props.match &&

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id={userRole[userRole.indexOf(props.match.params.choice.toUpperCase())]}
                label="User Type"
                name={"user_type"}
                autoComplete={userRole[userRole.indexOf(props.match.params.choice.toUpperCase())]}
                inputRef={userRoleSel}
                defaultValue={userRole[userRole.indexOf(props.match.params.choice.toUpperCase())]}
                disabled={true}
              />
              {/* <Select
                variant="outlined"
                required
                fullWidth
                label="User Type"
                labelId="demo-simple-select-label"
                inputRef={userRoleSel}
                onChange={handleChange}
              >
                <MenuItem value="RBT">RBT</MenuItem>
                <MenuItem value="CHILD">CHILD</MenuItem>
                <MenuItem value="PARENT">PARENT</MenuItem>
                <MenuItem value="GUEST">GUEST</MenuItem>
              </Select> */}
              </Grid>
            }
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="image_path"
                label="Image Url"
                name="image_path"
                autoComplete="image_path"
                inputRef={imagePath}
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
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signup/rbt" variant="body2">
                Are you an RBT? Sign Up Here
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
