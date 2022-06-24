
import React, {useState, useEffect} from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import { Route } from "wouter";
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

  
function App() {
  const [sidebar, setSidebar] = useState(false)
  const [getUsers, setGetUsers] = useState(null)

  const pagesList = ['home', 'all projects', 'Transactions', 'my projects', 'account']
  const faIcons = ['fa fa-home', 'fa fa-project-diagram', 'fa fa-history', 'fa fa-check-square', 'fa fa-user']

  const projects = [
    {
      id: 1,
      name: 'Wine Project',
      short_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis dui",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis dui at massa luctus, eget tincidunt nisi consectetur",
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
  },[getUsers])

  const handleSidebar = (e) => {
    setSidebar(false)
};


return (
    <div className="App">
      <Sidebar
          faIcons={faIcons} 
          pagesList={pagesList} 
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
);
}
  
export default App;