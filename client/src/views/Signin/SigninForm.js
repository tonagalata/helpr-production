import React, { useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import classes from './SigninForm.module.css';
import useToken from "../../components/useToken";
import useUser from "../../components/useUser";


const SignInForm = () => {
    const [unautherized, setUnautherized] = useState(false);
    const username = useRef("");
    const password = useRef("");
    // const [username, setUsername] = useState();
    // const [password, setPassword] = useState();
    
    const { setToken } = useToken();
    const { setUser} = useUser();
  

    const handleGetUser = async (e) => {

        e.preventDefault()
      
        const userNameVal = username.current.value
        const passwordVal = password.current.value
      
        const user = `username=${userNameVal}&password=${passwordVal}&grant_type=password`
      
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
                setUser(userNameVal)
            })
            .catch( () => {
                setUnautherized(true)
                username.current.value = ""
                password.current.value = ""
            })
            
      };


  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        {/* <Link className="btn btn-primary" style={{ textDecoration: 'none', color: "#fff", marginTop: '1em', right: '1em', position: 'absolute' }} href="/project-overview" variant="body2"> ← Go Back To All Projects</Link> */}
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Project Hub Sign in
          </Typography>
          <form className={classes.form} noValidate>
              {
              unautherized ?
            <>
            <div className={classes.unautherized}>
                Wrong username and/or password
            </div>
            <TextField
            error
            // onChange={e => setUsername(e.target.value)}
            inputRef={username}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            defaultValue="username"
            autoComplete="current-username"
            autoFocus
            /> 
            <TextField
            error
            inputRef={password}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            defaultValue="password"
            autoComplete="current-password"
            />
            </>
            :
            <>
            <TextField
            // onChange={e => setUsername(e.target.value)}
            inputRef={username}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="current-username"
            autoFocus
            />
            <TextField
            // onChange={e => setPassword(e.target.value)}
            inputRef={password}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            />
            </>
        }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleGetUser}
            >
              Sign In
            </Button>
            <Grid container>

              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default SignInForm;
