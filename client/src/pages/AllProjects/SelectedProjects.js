import React from 'react';
import { Link } from 'wouter';
import ProjectCard from '../../components/Card/ProjectCard'
import styles from './AllProjects.module.css'
  
const SelectedProject = (props) => {

  const projects = props.projects.filter(e => e._key == window.location.pathname.split("/")[2])
  console.log(projects)
  return (
    props.projects &&
    <div className={styles.mainDiv}>
      <h1>{projects[0].project_name}</h1>
      <div className={styles.mainContainer}>

      {
       projects.map((project, i) =>
          // <Link href={`/all-projects/${project._key}`} >
            <div key={i}>
                <ProjectCard 
                  favorite={props.favorite}
                  setFavorite={props.setFavorite}
                  fund={props.fund}
                  setFund={props.setFund}
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