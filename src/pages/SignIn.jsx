import { useState, useContext, useRef} from "react"
import { Link } from "react-router-dom"
import { AuthInfoContext } from "../context/AuthContextProvider"
import AuthText from "../components/AuthText"
import AuthHeader from "../components/AuthHeader"
import close from '../assets/close.svg'
import Loader from "../components/Loader"
import Reveal from "../components/Reveal"

const SignIn = () => {

    const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

    const passwordInput = useRef(null)

    const {handleAuthSuccess} = useContext(AuthInfoContext)

    const [loginInfo, setLoginInfo] = useState({
        email : "",
        password : ""
    })

    const handleChange = (e) => {
        setLoginInfo({...loginInfo, [e.target.name]: e.target.value})
    }
    
    const [errorMessage, setErrorMessage] = useState(null)

    const [buttonDisabled, setButtonDisable] = useState(false)

    const userLogin = async (e) => {

        e.preventDefault();

        setButtonDisable(true)

        try{
            let response = await fetch(`${apiUrl}/user/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: loginInfo.email, password : loginInfo.password})
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
            setErrorMessage(error.message);
            setButtonDisable(false)
            setTimeout( () => {
                setErrorMessage(null)
            }, 4000)

        }
    }


    const ErrorContainer = () => {
        return (
            <div className="flex justify-between items-center bg-red-200 w-[80%]  px-2 py-4 rounded-lg tab:w-full">
                <p>{errorMessage}</p>
                <img onClick={() => setErrorMessage(null)} className="h-[20px] cursor-pointer" src={close} alt="close icon" />
            </div>
        )
    }

    return (
        <section className="flex min-h-full">
            <AuthText />
            <div className="className= w-[50%] mobile:w-full p-[3em] tab:p-[2em]">
                <AuthHeader headingText = "Sign in" paragraphText = "Welcome back, kindly enter your login details" />
                <form className="authForm" onSubmit={userLogin} method="post">
                    {errorMessage && <ErrorContainer />}
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="email">Email Address:</label>
                        <input className="authInput" onChange={handleChange} name="email" id="email" type="email" required value={loginInfo.email}  />
                    </div>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="password">Password:</label>
                        <div className="authPasswordContainer">
                            <input ref={passwordInput} className="authPasswordInput" onChange={handleChange} name="password" id="password" type="password" required value={loginInfo.password}  />
                            <Reveal inputField={passwordInput} />
                        </div>
                    </div>
                    <div>
                        <button className="authSubmitInput" type="submit" disabled={buttonDisabled}>
                            {buttonDisabled ? <Loader /> : "Sign in"}
                        </button>
                    </div>
                </form>
                <div className="authFooterContainer">
                    <p className="text-center">Don't have an account? <Link className="authFooterLink" to="/signup">Create a free account</Link></p>
                </div>
            </div>
        </section>
    )
}


export default SignIn