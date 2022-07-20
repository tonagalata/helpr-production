import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import ProjectCard from '../../components/Card/ProjectCard'
import styles from './AllProjects.module.css'
  
const SelectedProject = (props) => {

  
  const [projects, setProjects] = useState(props.projects)
  const [projectName, setProjectName] = useState(props.projects.name || window.location.pathname.split("/")[2])


  setProjectName(window.location.pathname.split("/")[2])

  useEffect(() => {
    if(projectName && projects.length === 0) {
      console.log(window.location.pathname.split("/")[2])
    
      console.log(projectName, "<---- project name")
      fetch(`http://localhost:8000/project/${projectName}`)
      .then(response => response.json())
      .then(data => setProjects(data))
    } else {
      setProjects(props.projects.filter(e => e._key == projectName))
    }

  },[projectName])
  


  return (
    props.projects &&
    <div className={styles.mainDiv}>
      <h1>{projects.filter(p => p.key === projectName)}</h1>
      <div className={styles.mainContainer}>

      {
       props.projects.map((project, i) =>
          // <Link href={`/all-projects/${project._key}`} >
          <div key={i}>
                <ProjectCard 
                  favorite={project.favorite}
                  setFavorite={project.setFavorite}
                  fund={project.funds}
                  setFund={project.setFund}
                  key={i} 
                  project={project} 
                />
            </div>
          // </Link>
       ) 
      }

      </div>
    </div>
  );
};
  
export default SelectedProject;