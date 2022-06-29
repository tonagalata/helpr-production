
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

  
function App() {
  const [sidebar, setSidebar] = useState(false)
  const [getUsers, setGetUsers] = useState(null)
  const [getProjects, setGetProjects] = useState(null)
  const firstName = useRef("")
  const lastName = useRef("")
  const email = useRef("")
  const userName = useRef("")
  const password = useRef("")

  const pagesList = ['home', 'all projects', 'Transactions', 'my projects', 'account']
  

  const faIcons = ['fa fa-home', 'fa fa-project-diagram', 'fa fa-history', 'fa fa-check-square', 'fa fa-user']

  const projects = [
    {
      id: 1,
      name: 'Wine Project',
      short_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis dui",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ",
      users: ['Ben', 'Mike', 'Amber', 'Atwan'],
      created_date: 'July 24, 2022',
      image: wine_p,
      money: 100000
    },
    {
      id: 2,
      name: 'Beer Project',
      short_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis dui",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis dui at massa luctus, eget tincidunt nisi consectetur",
      users: ['Ben', 'Mike', 'Amber', 'Atwan'],
      created_date: 'July 7, 2022',
      image: beer_p,
      money: 100000
    },
    {
      id: 3,
      name: 'Tornado Project',
      short_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis dui",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis dui at massa luctus, eget tincidunt nisi consectetur",
      users: ['Ben', 'Mike', 'Amber', 'Atwan'],
      created_date: 'July 10, 2022',
      image: tornado_p,
      money: 100000
    },
    {
      id: 4,
      name: 'Crime Project',
      short_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis dui",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis dui at massa luctus, eget tincidunt nisi consectetur",
      users: ['Ben', 'Mike', 'Amber', 'Atwan'],
      created_date: 'July 14, 2022',
      image: crime_p,
      money: 100000
    },
    {
      id: 5,
      name: 'Movie Project',
      short_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis dui",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis dui at massa luctus, eget tincidunt nisi consectetur",
      users: ['Ben', 'Mike', 'Amber', 'Atwan'],
      created_date: 'July 12, 2022',
      image: movie_p,
      money: 100000
    },
    {
      id: 6,
      name: 'Covid Project',
      short_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis dui",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis dui at massa luctus, eget tincidunt nisi consectetur",
      users: ['Ben', 'Mike', 'Amber', 'Atwan'],
      created_date: 'July 26, 2022',
      image: covid_p,
      money: 90000
    },
  ]


  useEffect(() => {
    if (getUsers === null){
      fetch("http://localhost:8000/user/search")
      .then(response => response.json())
      .then(data => setGetUsers(data.users[0]))
    }
  },[getUsers]);



  useEffect(() => {
    if (getUsers === null){
      fetch("http://localhost:8000/user/search")
      .then(response => response.json())
      .then(data => setGetUsers(data.users[0]))
    }
  },[getUsers]);

  useEffect(() => {
    if (getProjects === null){
      fetch("http://localhost:8000/project/all")
      .then(response => response.json())
      .then(data => console.log(data)
        // setGetProjects(data.users[0])
        )
    }
  },[getUsers]);

  const handleSidebar = (e) => {
    setSidebar(false)
};


const handleCreateUser = (e) => {
  // "disabled": false,
  // "image_path": "string"
  e.preventDefault()
  const firstNameVal = firstName.current.value
  const lastNameVal = lastName.current.value
  const userNameVal = userName.current.value
  const emailVal = email.current.value
  const passwordVal = password.current.value
  const disableVal = false
  const imagePath = ""
  
  const createUser = {
    "first_name": firstNameVal,
    "last_name": lastNameVal,
    "username": userNameVal,
    "email": emailVal,
    "disabled": disableVal,
    "image_path": imagePath,
  }
  console.log(e, createUser)

  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(createUser)
};

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = `http://localhost:8000/user/signup?password=${passwordVal}`


    if (getUsers === null){
      fetch(url, {
        method: 'POST',
        headers: {          
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
          'Access-Control-Request-Method': 'GET, POST, DELETE, PUT, OPTIONS',
          'Content-Type':'application/json'
        },
        body: JSON.stringify(createUser)
      }).then(res => console.log(res))

    }

};


return (
    <div className="App">

      <Router>
          <Switch>
            {/* <div className='login'>
              <Route path="/signin">
                <SignInForm />
              </Route> 
              <Route path="/signup">
                <SignUpForm 
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  userName={userName}
                  password={password}
                  handleCreateUser={handleCreateUser}
                />
              </Route>
              </div> */}
              {console.log(getUsers)}
            <div>
              <Sidebar
                  faIcons={faIcons} 
                  pagesList={
                    getUsers ? pagesList : pagesList.filter(e => ['home', 'all projects'].includes(e))
                  }
                  user={getUsers} 
                  handleSidebar={handleSidebar} 
                  sidebar={sidebar} 
                  setSidebar={setSidebar} />
              <Route path="/home">
                <Home projects={projects}/>
              </Route>
              <Route path="/all-projects">
                <AllProjects projects={projects}/>
              </Route>
              </div>
                {
                  getUsers ? 
                <div>
              <Route path="/my-projects">
                <MyProjects/>
              </Route>
              <Route path="/transactions">
                <Transactions/>
              </Route>
              <Route path="/account">
                <Account/>
              </Route>
            </div>
            :
            <Redirect to="/signin" />
            }
          </Switch>
      </Router>
      
    </div>
);
}
  
export default App;