import React from 'react';
import 'cdbreact';
import styles from './Sidebar.module.css'
import { Link } from 'wouter';


const Sidebar = (props) => {
    return (
        <div className={styles.mainNav}>
            <div style={{ height: '3em' }}>
               <span style={{ margin: '0 2em' }} onClick={() => props.setSidebar(true)}><i className="fa fa-bars"></i></span>
               <div className={styles.logoContainer}>
                    <Link href="/all-projects">ROCA</Link>
               </div>
               <span style={{ padding: '.5em .75em .5em .75em', backgroundColor: '#333', color: '#FFF', borderRadius: '100%', marginRight: '2em' }}><Link style={{ textDecoration: 'none', color: '#fff' }} href="/account">{props.user ? props.user.first_name.charAt(0) : <i className='fa fa-user'></i>}</Link></span>
            </div>
            <div>
                <ul className={styles.menuItems}>

                  {
                    props.pagesList && props.pagesList.map( (page, i) => 
                      <Link key={i} href={"/" + page.replace(" ", "-")}><li key={i}>{page.charAt(0).toUpperCase() + page.slice(1)}</li></Link>
                    )
                  }

                </ul>
            </div>
            <div className={ props.sidebar ? styles.sidebar : styles.unsidebar}>
                <span className={styles.close} onClick={props.handleSidebar}>
                    <i className='fa fa-times'></i>
                </span>                
                <ul className={styles.sidemenuItems}>
                    
                {
                    (props.pagesList && props.faIcons) && props.pagesList.map( (page, i) => 
                      <Link key={i} href={"/" + page.replace(" ", "-")}><li key={i}><i className={props.faIcons[i]}></i>&nbsp;&nbsp;{page.charAt(0).toUpperCase() + page.slice(1)}</li></Link>
                    )
                  }
                   
                </ul>
            </div> 

        </div>

    );

}

export default Sidebar;