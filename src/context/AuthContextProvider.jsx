import {useContext, createContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export const AuthInfoContext = createContext(null)


const AuthContextProvider = ({children}) => {


    const navigate = useNavigate()


    const [loggedInUser, setLoggedInUser] = useState(
        localStorage.getItem("AuthToken") ? jwtDecode(JSON.parse(localStorage.getItem("AuthToken")).refresh).full_name : null
    )

    const handleAuthSuccess = (data, refresh) => {
        localStorage.setItem("AuthToken",JSON.stringify(data))
        setLoggedInUser(jwtDecode(refresh).full_name)
        navigate("/")
    }


    const userRegistration = async (e) => {
        e.preventDefault();
        const full_name = e.target.full_name.value
        const email = e.target.email.value
        const password = e.target.password.value

        let response = await fetch('http://127.0.0.1:8000/user/register/', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({full_name: full_name, email: email, password : password})
        })

        let data = await response.json()

        if(response.ok){
            handleAuthSuccess(data.Token, data.Token.refresh)
        }
        else{
            console.log("Please Login, this email address already exists")
        }
    }


    const userLogin = async (e) => {
        e.preventDefault();

        const email = e.target.email.value
        const password = e.target.password.value

        try{
            let response = await fetch('http://127.0.0.1:8000/user/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email, password : password})
            })

            let data = await response.json()

            if (!response.ok) {
                if (response.status === 401) {
                // Custom message for incorrect credentials
                  throw new Error('Incorrect credentials. Please try again.');
                } 
                else {
                    // Custom general message for other errors
                  throw new Error('An error occurred. Please try again later.');
                }
            }
            else{
                handleAuthSuccess(data, data.refresh)
            }
        }
        catch(error){
            console.log(error.message);
        }
    }


    const userLogout = async () => {

        const authDataObject = JSON.parse(localStorage.getItem("AuthToken"))
        let response = await fetch('http://127.0.0.1:8000/user/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authDataObject.access}`
            },
            body: JSON.stringify({
                refresh:authDataObject.refresh
            })
        })

        let data = await response.json()

        if(response.ok){
            localStorage.removeItem("AuthToken")
            setLoggedInUser(null)
        }
    }


    let contextData = {
        LoggedinUser: loggedInUser,
        userRegistration: userRegistration,
        userLogin: userLogin,
        userLogout: userLogout,
    }


    return(
        <AuthInfoContext.Provider value = {contextData} >
            {children}
        </AuthInfoContext.Provider>
    )
}
  
export default AuthContextProvider
