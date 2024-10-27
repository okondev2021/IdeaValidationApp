import { useState, useContext,} from "react"
import { AuthInfoContext } from "../context/AuthContextProvider"
import { Link } from "react-router-dom"
import AuthText from "../components/AuthText"
import AuthHeader from "../components/AuthHeader"
import close from '../assets/close.svg'
import Loader from "../components/Loader"

const SignUp = () => {

    const {handleAuthSuccess} = useContext(AuthInfoContext)

    const [signUpInfo, setSignUpInfo] = useState({
        full_name: "",
        email: "",
        password: "",
        confirmpassword: "",
    })

    const [errorMessage, setErrorMessage] = useState(null)
    
    const handleChange = (e) => {
        setSignUpInfo({...signUpInfo, [e.target.name]: e.target.value})

    }

    const [buttonDisabled, setButtonDisable] = useState(false)


    const userRegistration = async (e) => {

        e.preventDefault();

        setButtonDisable(true)

        try{

            if(signUpInfo.password !== signUpInfo.confirmpassword){
                throw new Error("Passwords do not match.")
            }
            
            let response = await fetch('https://startuptrybe-bot.onrender.com/user/register/', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({full_name: signUpInfo.full_name, email: signUpInfo.email, password : signUpInfo.password})
            })
    
            let data = await response.json()
    
            if(response.ok){
                handleAuthSuccess(data.Token, data.Token.refresh)
            }
            else{
                throw new Error("Please Login, this email address already exists")
            }
        }
        catch(err){
            setErrorMessage(err.message)

            setTimeout( () => {
                setErrorMessage(null)
            }, 4000)
        }

        finally{
            setButtonDisable(false)
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
                <AuthHeader headingText = "Create an account" paragraphText = "Let's get started." />
                <form className="authForm" onSubmit={userRegistration}>
                    {errorMessage && <ErrorContainer />}
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="fullName">Full Name:</label>
                        <input className="authInput" onChange={handleChange} id="fullName" type="text" name="full_name" required  />
                    </div>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="email">Email Address:</label>
                        <input className="authInput" onChange={handleChange} id="email" type="email" name="email" required />
                    </div>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="password">Password:</label>
                        <input className="authInput" onChange={handleChange} id="password" type="password" name="password" required />
                    </div>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="confirmpassword">Confirm Password:</label>
                        <input className="authInput" onChange={handleChange} id="confirmpassword" type="password" name="confirmpassword" required />
                    </div>
                    <div>
                        <button className="authSubmitInput " type="submit" disabled={buttonDisabled}>
                            {buttonDisabled ? <Loader />: "Create an account"}
                        </button>
                    </div>
                </form>
                <div className="authFooterContainer">
                    <p className="text-center">Already have an account? <Link className="authFooterLink" to="/signin">Sign in</Link></p>
                </div>
            </div>
        </section>
    )
}


export default SignUp