import React, { useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TinyMceEditor from "../TinyMCEditor/TinyMCEditor";
import classes from './CreateProject.module.css'
import useToken from '../useToken';
import useUser from "../useUser";


export default function CreateProject(props) {

    const { token } = useToken();
    const { user } = useUser();

    const [description, setDescription] = useState();
    const projectName = useRef("");
    const githubRepo = useRef("");
    const shortDesc = useRef("");
    const iconPath = useRef("");

    const handleCreateProject = async () => {
      
      
        const project = {
          "project_name": projectName.current.value,
          "github_repo": githubRepo.current.value,
          "description": description,
          "short_desc": shortDesc.current.value,
          "icon_path": iconPath.current.value || "https://images.unsplash.com/photo-1595452767427-0905ad9b036d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
        }
      
        const url = `http://localhost:8000/project/create`
      
            fetch(url, {
              method: 'POST',
              headers: new Headers({
                'Authorization': `Bearer ${token.access_token}`,      
                'Accept': 'application/json',
                'Content-Type':'application/json'  
              }),
              body: JSON.stringify(project)
            })
            .then(res => res.json())
            .then(data => {
              handleAddMember(data.project_key, user)
            })
            // .then( token => setToken(token))
            
      
      };

      const handleAddMember = (project_key, user) => {

        const member_info = {
          "project_key": project_key,
          "username": [
            user
          ],
          "role": "Member"
        }

        const url = `http://localhost:8000/project/members/add`
      
            fetch(url, {
              method: 'POST',
              headers: new Headers({
                'Authorization': `Bearer ${token.access_token}`,      
                'Accept': 'application/json',
                'Content-Type':'application/json'  
              }),
              body: JSON.stringify(member_info)
            })
            .then(res => res.json())
      }

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginTop: '3em', marginBottom: '2em' }}>
          Create A Project
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="pname"
                name="project_name"
                variant="outlined"
                required
                fullWidth
                id="project_name"
                label="Project Name"
                autoFocus
                inputRef={projectName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="github_repo"
                label="GitHub Repo"
                name="github_repo"
                autoComplete="gname"
                inputRef={githubRepo}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="iconPath"
                label="Project Image URL"
                name="iconPath"
                autoComplete="iconPath"
                inputRef={iconPath}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="shortDesc"
                label="Short Description"
                type="shortDesc"
                id="shortDesc"
                autoComplete="shortDesc"
                inputRef={shortDesc}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <TextareaAutosize
                variant="outlined"
                required
                style={{width: '100%', height: 200}}
                name="description"
                label="Description"
                type="description"
                id="description"
                autoComplete="description"
                // inputRef={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your project..."
              /> */}
              <TinyMceEditor 
                onChange={e => setDescription(e.target.value)}
              />

            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleCreateProject}
          >
            Create Project
          </Button>
        </form>
      </div>
    </Container>
  );
}
