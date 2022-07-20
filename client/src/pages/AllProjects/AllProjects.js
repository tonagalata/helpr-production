import React from 'react';
import { Link } from 'wouter';
import ProjectCards from '../../components/Card/ProjectCards'
import styles from './AllProjects.module.css'
import LoadingImg from '../../images/loading.gif'
  
const AllProjects = (props) => {

  if((!props.projects)) {
    return <span style={{ margin: '0 auto', fontSize: '100px', textAlign: 'center', display: "flex", justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <img src={LoadingImg} alt="loading image" />
    </span>
  } else if(props.projects.length == 0) {
    return <span style={{ margin: '0 auto', fontSize: '50px', textAlign: 'center', display: "flex", justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
      <p>No Projects Created</p>
      <Link to="/create-project">Create a Project</Link>
    </span>
  }

  return (
    <div className={styles.mainDiv}>
      <h1>All Projects</h1>
      <div className={styles.mainContainer}>

      {
       props.projects && props.projects.map((project, i) =>
          <Link key={i} href={`/all-projects/${project._key}`}>
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