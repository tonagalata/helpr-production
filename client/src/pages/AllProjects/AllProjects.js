import React from 'react';
import { Link } from 'wouter';
import ProjectCards from '../../components/Card/ProjectCards'
import styles from './AllProjects.module.css'
  
const AllProjects = (props) => {
  return (
    <div className={styles.mainDiv}>
      <h1>All Projects</h1>
      <div className={styles.mainContainer}>

      {
       props.projects && props.projects.map((project, i) =>
          <Link href={`/all-projects/${project._key}`}>
            <div key={i}>
                <ProjectCards key={i} project={project} />
            </div>
          </Link>
       ) 
      }

      </div>
    </div>
  );
};
  
export default AllProjects;