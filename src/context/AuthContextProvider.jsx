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



    /**
     * Function to handle successful authentication by storing authentication data and updating the app's state.
     * 
     * This function is called when authentication is successful, such as after login or token refresh. It performs the following actions:
     * - Stores the authentication tokens in `localStorage`.
     * - Decodes the refresh token to retrieve the user's full name and updates the logged-in user's state.
     * - Updates the authentication data object (`authDataObject`) with the new tokens.
     * - Redirects the user to the home page ("/") after successful authentication.
     * 
     * @function handleAuthSuccess
     * @param {Object} data - The authentication data, typically including access and refresh tokens.
     * @param {string} refresh - The refresh token, used to decode the user's details.
     */
    const handleAuthSuccess = (data, refresh) => {
        localStorage.setItem("AuthToken",JSON.stringify(data))
        setLoggedInUser(jwtDecode(refresh).full_name)
        setAuthDataObject(data)
        navigate("/")
    }

    /**
     * Function to handle authentication failure by clearing authentication data.
     * 
     * This function is triggered when the user's authentication fails, such as when their tokens expire or the refresh process fails.
     * It performs the following actions:
     * - Removes the stored authentication tokens from `localStorage`.
     * - Clears the logged-in user state by setting it to `null`.
     * - Resets the `authDataObject` to `null`, effectively logging the user out.
     * 
     * @function handleAuthFailure
     */

    const handleAuthFailure = () => {
        localStorage.removeItem("AuthToken");
        setLoggedInUser(null);
        setAuthDataObject(null);
    }


    /**
     * Asynchronous function to refresh the user's access token using their refresh token.
     * 
     * This function checks the current time and attempts to send the refresh token to the backend's refresh endpoint. 
     * If successful, it updates the authentication object (`authDataObject`) and stores the new tokens in localStorage.
     * If the refresh token has expired, it triggers an authentication failure by calling `handleAuthFailure()`.
     * Additionally, it sets the `loading` state to false once the token refresh process is complete.
     * 
     * @function refreshToken
     * @returns {Promise<void>} - A promise that resolves when the token refresh process is complete.
     */

    const refreshToken = async () => {

        const currentTime = Math.floor(Date.now() / 1000);

        let response = await fetch('https://startuptrybe-bot.onrender.com/user/refresh/', {
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
                  
        if(loading){
            setLoading(false)
        }
    }


     /**
     * Asynchronous function to log out a user by sending a POST request to the backend's logout endpoint.
     * The function uses the user's access and refresh tokens stored in `authDataObject` for authentication.
     * Upon a successful logout (response.ok), it clears the user's authentication data using `handleAuthFailure()`.
     * If the request fails, it redirects the user to the home page ('/').
     * 
     * @function userLogout
     * @returns {Promise<void>} - A promise that resolves when the logout process is complete.
     */
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



    /**
     * useEffect hook to manage token refresh logic.
     * 
     * This effect ensures that the user's access token is refreshed periodically, maintaining the user's authentication session.
     * When the component is mounted or when `authDataObject` or `loading` changes, the following actions occur:
     * - If `loading` is true and `authDataObject` exists, the `refreshToken()` function is called immediately to refresh the token.
     * - A setInterval is set up to call `refreshToken()` every 7 minutes (as the access token expires after 8 minutes).
     * - The interval is cleared when the component unmounts or when the effect re-runs to avoid multiple intervals running simultaneously.
     * 
     * @function useEffect
     * @param {Array} dependencies - [authDataObject, loading]
     * - `authDataObject`: Contains the user's authentication details including access and refresh tokens.
     * - `loading`: A flag indicating whether the app is still loading.
     */
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
    authentication that will be available to all context consumers. */
    let contextData = {
        LoggedinUser: loggedInUser,
        authDataObject:authDataObject,
        loading: loading,
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

