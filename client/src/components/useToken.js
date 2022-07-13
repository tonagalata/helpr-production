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
        const tokenDate = new Date();
        const tokenDateMinutes = new Date(tokenDate);
        tokenDateMinutes.setMinutes(tokenDate.getMinutes() + 30);

        sessionStorage.setItem('session_date', JSON.stringify(tokenDateMinutes));
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