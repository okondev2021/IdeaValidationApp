import { useContext, useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom";
import isOnline from 'is-online';
import Validator from "../components/Validator";
import Response from "../components/Response";
import PreviousIdea from "../components/PreviousIdea";
import { AuthInfoContext } from "../context/AuthContextProvider"
import add from '../assets/add.svg'
import logout from '../assets/logout.svg'
import Loader from "../components/Loader";

const MainPage = () => {

    const {LoggedinUser, userLogout, authDataObject, loading} = useContext(AuthInfoContext);

    const [validatedIdeaResponse, setValidatedIdeaResponse] = useState(null);

    const [previouslyValidatedIdeas, setPreviouslyValidatedIdeas] = useState(null);

    const [buttonDisabled, setButtonDisable] = useState(false);

    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    const [error, setError] = useState(null)

    const sideBar = useRef(null);

    const mainBody = useRef(null);


    /**
     * The function `getPreviousValidatedIdeas` fetches previously validated ideas  and
     * updates the state with the retrieved data if the response is successful.
     */
    // This function allows users
    const getPreviousValidatedIdeas = async () => {
        
        let response  = await fetch("http://127.0.0.1:8000/bot/validator/", {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authDataObject?.access}`
            },
        })
        let data = await response.json()

        if(response.ok){
            setPreviouslyValidatedIdeas(data)
        }
    }
    
    // Only accessible to logged in users, this function fetches previous validated ideas
    /**
     * The function `readPreviousIdea` fetches data from the specified endpoint and sets the response data to a
     * state variable if the response is successful.
     */
    const readPreviousIdea = async (id) => {

        let response = await fetch(`http://127.0.0.1:8000/bot/validator/${id}/`, {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
            },   
        })
        
        let data = await response.json()
        
        if(response.ok){
            setValidatedIdeaResponse(data.bot_response)
        }
    }
    

    // Sends user's input as request and returns a break down of their idea
    /**
     * The function `validateIdea` is an asynchronous function that sends a POST request to the
     * server endpoint with user input data(idea and target_market) and sets the response to state if successful.
     */
    const validateIdea = async (e) => {

        try{
        
            e.preventDefault();

            setButtonDisable(true);

            if(!navigator.onLine){
                setButtonDisable(false);
                throw new Error('Check your internet connection and try again');
            }
            else{
                const online = await isOnline();
                if (!online) {
                    setButtonDisable(false);
                    throw new Error('Check your internet connection and try again');
                }
            }

            const user_idea = e.target.idea.value
            const user_target_market = e.target.targetMarket.value
            
            let botResponse = await fetch("http://127.0.0.1:8000/bot/validator/",{
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                    ...(LoggedinUser && { 'Authorization': `Bearer ${authDataObject?.access}`})
                },
                body: JSON.stringify({
                    user_idea : user_idea,
                    user_target_market : user_target_market  
                })
            })

            let data = await botResponse.json()

            if(botResponse.ok){
                setValidatedIdeaResponse(data.response)
                setButtonDisable(false);
            }
            else{
                console.log(data, botResponse)
            }
        }
        catch(err){
            setError(err.message)
            setTimeout( () => {
                setError(null)
            }, 5000)
        }
        finally{
            setButtonDisable(false);
        }
    }

    // Brings up the form ui for users to validate a new idea
    const validateNewIdea = () => {
        setValidatedIdeaResponse(null)
    }


    useEffect( () => {  

        if (LoggedinUser){
            getPreviousValidatedIdeas()
        }
    }, [validatedIdeaResponse, loading])


    const navBar = () => {
        setIsSideBarOpen(!isSideBarOpen)
    }


    const Hamburger = () => {
        return(
            <div onClick={navBar} className="flex flex-col gap-1 px-2 cursor-pointer mobile:gap-2">
                <div className="w-[25px] h-[2px] bg-black"></div>
                <div className="w-[25px] h-[2px] mobile:w-[17px] bg-black"></div>
                <div className="w-[25px] h-[2px] bg-black mobile:hidden"></div>
            </div>
        )
    }



    return (
        <div className="flex min-h-screen ">
            {
                LoggedinUser &&
                <aside ref={sideBar} className={`overflow-x-hidden text-nowrap bg-redlight fixed h-screen flex flex-col py-6 z-40 transition-all duration-300 ${isSideBarOpen ? "px-4 w-[20vw] tab:w-[40vw] mobile:w-[70vw] ease-linear " : "w-[0vw]"}`}>
                    <div className={``}>
                        <Hamburger />
                    </div>
                    <div className="mt-[2em] flex items-center justify-between hover:bg-red-100 cursor-pointer px-2 py-3 rounded-lg" onClick={validateNewIdea}>
                        <p>Validate Idea</p>
                        <img className="h-[30px] icons" src={add} alt="" />
                    </div>
                    <div className="mt-[1em]">
                        <h1 className="px-2 py-3 text-sm font-semibold ">Validated Ideas</h1>
                    </div>
                    <div className={`overflow-x-hidden relative overflow-y-auto h-3/6 gap-[0.5em] text-sm ${previouslyValidatedIdeas ? "flex flex-col" : ""}`}>
                        {previouslyValidatedIdeas ? 
                            previouslyValidatedIdeas.length >= 1 ?
                            previouslyValidatedIdeas.map( (previousIdeas) => (
                                <PreviousIdea 
                                    key={previousIdeas.id} 
                                    previousIdeas = {previousIdeas}
                                    readPreviousIdea = {readPreviousIdea}
                                />
                                    
                            ))
                            : 
                            <p>No previous ideas</p>                        
                        : 
                            <Loader /> 
                        }
                    </div>
                    <div className="absolute auth bottom-6">
                        <div onClick={userLogout} className="flex gap-4 cursor-pointer">
                            <img className="h-[25px] icons" src={logout} alt="" /> 
                            <p>Log Out</p>
                        </div>  
                    </div>
                </aside>
            }

            <main ref={mainBody} className={`relative flex flex-col transition-all duration-300 ${LoggedinUser && isSideBarOpen ? 'w-[80vw] ml-[20%] tab:w-[60vw] tab:ml-[40%]' : "w-[100vw] ml-[0%] mobile:w-[100vw]"} mobile:w-[100vw] mobile:ml-[0%] `}>
                <header className="sticky top-0 flex items-center justify-between w-full px-8 py-5 bg-white shadow-sm mobile:px-2">
                    {  LoggedinUser &&   
                        <div className={`${!isSideBarOpen ? "block" : "hidden"}`}>
                            <Hamburger />
                        </div>
                    }
                    <div>
                        <h1 className="text-4xl font-bold text-redbold mobile:text-lg">StartupTrybe</h1>
                    </div>
                    <div>
                        {LoggedinUser ? 
                            <h1 className="text-lg font-bold mobile:text-base">{LoggedinUser}</h1> : 
                            <Link to="/signup" className="px-6 py-2 font-semibold text-white bg-redbold rounded-3xl mobile:text-sm mobile:px-3">Create Account</Link>
                        }
                    </div>
                </header>
                <section className="flex flex-col h-full">
                    {validatedIdeaResponse ? <Response botResponse={validatedIdeaResponse} validateNewIdeaFunct={validateNewIdea} /> : <Validator validateIdea={validateIdea} buttonDisabled={buttonDisabled} isSideBarOpen = {isSideBarOpen} errorMessage = {error} />} 
                </section>
            </main>
        </div>
    )
}


export default MainPage