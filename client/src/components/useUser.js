import { useState } from 'react';

export default function useUser() {
  const getUser = () => {
    
    const username = sessionStorage.getItem('username');
    const userToken = JSON.parse(username);
    return userToken
  };

  const [user, setUser] = useState(getUser());

  const saveUser = user => {
    if(user){
        sessionStorage.setItem('username', JSON.stringify(user));
        setUser(user.username);
        window.location.reload();
    }
  };

  return {
    setUser: saveUser,
    user
  }
}
