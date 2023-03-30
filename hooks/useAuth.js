import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext({})

export const AuthProvider = ({children}) =>{
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (user != null){
        setUser(user);
        }else{
          setUser(null);
        }   
        setLoadingInitial(false);
    }, [])

    const login = () =>{
      const APIURL = "http://192.168.101.117/API/login.php";
      const headers = {
        'Accept':'application/json',
        'Content-Type':'application.json'
      }
      fetch(APIURL,{
        method: 'POST',
        headers: headers,
      }).then((response) =>
        response.json()
      ).then((response) =>{
        console.log(response);
      }).then(()=>{
        setLoading(true);
        setLoadingInitial(true);
      }).catch((error)=>console.log(error))
    }
    
    const logout = () =>{

    }

    const memoedValue = useMemo(() =>({
        user,
        loading,
        error,
        login,
        logout,
    }),[user, loading, error])
  return (
    <AuthContext.Provider value={memoedValue}>
      {children}
    </AuthContext.Provider>
  )

}
export default function useAuth(){
    return useContext (AuthContext);
}