
import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import { Redirect, Route, Router, Switch } from "wouter";
import Home from './pages/Home/Home';
import AllProjects from './pages/AllProjects/AllProjects';
import MyProjects from './pages/MyProjects/MyProjects';
import Transactions from './pages/Transactions/Transactions';
import Account from './pages/Account/Account';
import wine_p from './images/wine_project.jpeg'
import beer_p from './images/beer_project.jpeg'
import tornado_p from './images/tornado_project.jpeg'
import crime_p from './images/crime_project.jpeg'
import movie_p from './images/movie_project.jpeg'
import covid_p from './images/covid_project.jpeg'
import SignUpForm from './components/Signup/SignupForm';
import SignInForm from './components/Signin/SigninForm';
import useToken from './components/useToken';
import useUser from './components/useUser';
import CreateProject from './components/CreateProject/CreateProject';

  
function App() {

  const { token, setToken } = useToken();
  const { user, setUser } = useUser();


  const [sidebar, setSidebar] = useState(false)
  const [pathName, setPathName] = useState()
  // const [currentUser, setCurrentUser] = useState(null)
  const [projects, setProjects] = useState(null)

  const pagesList = ['all projects', 'transactions', 'my projects', 'create project', 'account']
  

  const faIcons = ['fa fa-project-diagram', 'fa fa-history', 'fa fa-check-square', 'fa fa-plus', 'fa fa-user']

  useEffect(() => {
    if (pathName){
      setPathName(['/signin', '/signup'].includes(window.location.pathname))
      window.location.reload();
    }
  },[pathName]);

  // useEffect(() => {
  //   if (user){
  //     fetch(`http://localhost:8000/user/${user}/info`)
  //     .then(response => response.json())
  //     // .then(data => console.log(data.username))
  //     .then(data => setCurrentUser(data.username))
  //   }
  // },[user]);


  useEffect(() => {
    if (token){
      const currentDate = new Date();
      const sessionDate = new Date(JSON.parse(sessionStorage.getItem('session_date')));

      if(currentDate > sessionDate){
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('session_date');
        window.location.reload();
      }    
    }
  }, [token]);

  useEffect(() => {
    if (projects === null){
      fetch("http://localhost:8000/project/all")
      .then(response => response.json())
      .then(data => setProjects(data))
    }
  },[projects]);

  const handleSidebar = (e) => {
    setSidebar(false)
};


if(!token) {
  
  return (
    <div>

          <Router>
            {
            !['/all-projects', '/signin', '/signup'].includes(window.location.pathname) ?
              <Redirect from="*" to="/signin" />
              : ""
            }
            {
              <Route 
                    path="/all-projects">
                  <Sidebar
                    faIcons={faIcons} 
                    pagesList={['all-projects']}
                    // user={currentUser} 
                    handleSidebar={handleSidebar} 
                    sidebar={sidebar} 
                    setSidebar={setSidebar} 
                  /> 
                    <AllProjects 
                      projects={projects}
                    />
              </Route>
            }

            <Route path="/signin">
            <SignInForm
              setToken={setToken}
              setUser={setUser}
              />
          </Route> 
          <Route path="/signup">
            <SignUpForm />
          </Route>
        </Router>
    </div>
  )}


return (
    <div className="App">
      <Router>
          <Switch>
            
            <div>
              <Redirect from="/signup" to="all-projects" />
              <Sidebar
                  faIcons={faIcons} 
                  pagesList={pagesList}
                  // user={currentUser} 
                  handleSidebar={handleSidebar} 
                  sidebar={sidebar} 
                  setSidebar={setSidebar} /> 
              <Route path="/all-projects">
                <AllProjects projects={projects}/>
              </Route>

              <Route exact path="/my-projects">
                <MyProjects/>
              </Route>

              <Route exact path="/transactions">
                <Transactions/>
              </Route>
              <Route exact path="/account">
                <Account/>
              </Route>
              <Route exact path="/create-project">
                <CreateProject />
              </Route>
              </div>
          </Switch>
      </Router>
      
    </div>
);
}
  
export default App;