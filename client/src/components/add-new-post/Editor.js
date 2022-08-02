import React, { useState } from "react";
import ReactQuill from "react-quill";
import { Button, ButtonGroup, Card, CardBody, Form, FormInput } from "shards-react";

import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";
import useUser from "../useUser";
import useToken from "../useToken";

const Editor = (props) => {

  const { user } = useUser();
  const { token } = useToken();
  const [projectTitle, setProjectTitle] = useState();
  const [githubRepo, setGithubRepo] = useState();
  const [shortDesc, setShortDesc] = useState();
  const [iconPath, setIconPath] = useState("https://source.unsplash.com/random");

  const [savedText, setSavedText] = useState("");

  const handleSaveProject = () => {
    const text = savedText
    setSavedText(text.replace(/(<([^>]+)>)/gi, ""));
    // console.log(savedText.replace(/(<([^>]+)>)/gi, ""))

    const project = {
      "project_name": projectTitle,
      "github_repo": githubRepo,
      "description": savedText,
      "short_desc": shortDesc,
      "icon_path": iconPath
    }
  
    const url = `http://localhost:8000/project/create`
  
        fetch(url, {
          method: 'POST',
          headers: new Headers({
            'Authorization': `Bearer ${token}`,      
            'Accept': 'application/json',
            'Content-Type':'application/json'  
          }),
          body: JSON.stringify(project)
        })
        .then(res => res.json())
        .then(data => {
          console.log(data, "<-------- project data")
          handleAddMember(data)
          setTimeout(function(){
            window.location.reload()
            window.location.href = '/project-overview'
          }, 2000);
        })

  };

  const handleAddMember = (member) => {
    const member_info = {
      "project_key": member['project_key'],
      "username": [
        user
      ],
      "role": "Member"
    }

    console.log(member, "<----------- movie")

    const url = `http://localhost:8000/project/members/add`
  
        fetch(url, {
          method: 'POST',
          headers: new Headers({   
            'Accept': 'application/json',
            'Content-Type':'application/json'  
          }),
          body: JSON.stringify(member_info)
        })
  }



  return (
  <Card small className="mb-3">
    <CardBody>
      <Form className="add-new-post">
        <h6><strong>Project Title</strong></h6>
        <FormInput size="lg" className="mb-3" placeholder="Your Project Title" 
          onChange={(e) => setProjectTitle(e.target.value)}
        />
        <h6><strong>GitHub Repo</strong></h6>
        <FormInput size="lg" className="mb-3" placeholder="Your Github Repo" 
          onChange={(e) => setGithubRepo(e.target.value)}
        />
        <h6><strong>Image Link Address</strong></h6>
        <FormInput size="lg" className="mb-3" placeholder="Your Image Link" 
          onChange={(e) => setIconPath(e.target.value)}
        />
        <h6><strong>Short Description</strong></h6>
        <FormInput size="lg" className="mb-3" placeholder="Short Description" 
          onChange={(e) => setShortDesc(e.target.value)} 
        />
        <h6><strong>Description</strong></h6>
        <ReactQuill className="add-new-post__editor mb-1"
          placeholder="Long Description" 
          onChange={setSavedText} 
        />
        <ButtonGroup className="w-100 d-flex justify-content-center" style={{ paddingLeft: '90%'}}>
          <Button pill onClick={handleSaveProject} >Submit</Button>
        </ButtonGroup>
      </Form>
    </CardBody>
  </Card>
)};

export default Editor;
