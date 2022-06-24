import React from 'react';
import ProjectCard from '../../components/Card/ProjectCard'
import styles from './AllProjects.module.css'
  
const AllProjects = (props) => {
  return (
    <div className={styles.mainDiv}>
      <h1>All Projects</h1>
      <div className={styles.mainContainer}>

      {
       props.projects && props.projects.map((project, i) =>
        <div key={i}>
          <ProjectCard key={i} project={project} />
        </div>
       ) 
      }

      </div>
    </div>
  );
};
  
export default AllProjects;