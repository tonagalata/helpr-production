import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    // console.log(userToken, "<------- token")
    return userToken
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    if(userToken){
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
        window.location.reload();
    }
  };

  return {
    setToken: saveToken,
    token
  }
}