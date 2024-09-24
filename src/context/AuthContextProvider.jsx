import {createContext, useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export const AuthInfoContext = createContext(null)


const AuthContextProvider = ({children}) => {


    const navigate = useNavigate()


    const [loggedInUser, setLoggedInUser] = useState(
        localStorage.getItem("AuthToken") ? jwtDecode(JSON.parse(localStorage.getItem("AuthToken")).refresh).full_name : null
    )


    const [authDataObject, setAuthDataObject] = useState(
        localStorage.getItem("AuthToken") ? JSON.parse(localStorage.getItem("AuthToken")) : null
    )


    const [loading, setLoading] = useState(true)


    const handleAuthSuccess = (data, refresh) => {
        localStorage.setItem("AuthToken",JSON.stringify(data))
        setLoggedInUser(jwtDecode(refresh).full_name)
        setAuthDataObject(data)
        navigate("/")
    }


    const handleAuthFailure = () => {
        localStorage.removeItem("AuthToken");
        setLoggedInUser(null);
        setAuthDataObject(null);
    }


    const refreshToken = async () => {

        const currentTime = Math.floor(Date.now() / 1000);

        let response = await fetch('http://127.0.0.1:8000/user/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh:authDataObject?.refresh
            })
        })

        let data = await response.json()

        if (response.ok){
            setAuthDataObject(data)
            localStorage.setItem("AuthToken",JSON.stringify(data))
        }
        else if(!response.ok && currentTime >= jwtDecode(authDataObject?.refresh).exp ){
            handleAuthFailure()
        }
        else{
            refreshToken()
        }
                  
        if(loading){
            setLoading(false)
        }
    }


    const userLogout = async () => {

        let response = await fetch('http://127.0.0.1:8000/user/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authDataObject?.access}`
            },
            body: JSON.stringify({
                refresh:authDataObject?.refresh
            })
        })

        let data = await response.json()

        if(response.ok){
            handleAuthFailure()
        }
        else{
            navigate('/')
        }
    }


    useEffect(() => {
        if(loading && authDataObject){
            refreshToken()
        }

        const REFRESH_INTERVAL = 1000 * 60 * 7 // 7 minutes since the access token last for 8 minutes.
        let interval = setInterval(()=>{
            if(authDataObject){
                refreshToken()
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)
        
    }, [authDataObject, loading]);

    
    /* The `contextData` object is being created to store various values and functions related to
    authentication. */
    let contextData = {
        LoggedinUser: loggedInUser,
        authDataObject:authDataObject,
        setLoggedInUser : setLoggedInUser,
        setAuthDataObject: setAuthDataObject,
        userLogout: userLogout,
        refreshToken:refreshToken,
        handleAuthSuccess: handleAuthSuccess
    }

    
    return(
        <AuthInfoContext.Provider value = {contextData} >
            {children}
        </AuthInfoContext.Provider>
    )


}

  
export default AuthContextProvider

