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

    const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

    const {LoggedinUser, userLogout, authDataObject, loading} = useContext(AuthInfoContext);

    const [validatedIdeaResponse, setValidatedIdeaResponse] = useState(null);

    const [previouslyValidatedIdeas, setPreviouslyValidatedIdeas] = useState(null);

    const [buttonDisabled, setButtonDisable] = useState(false);

    const screenWidth = useRef(window.innerWidth);

    const [isSideBarOpen, setIsSideBarOpen] = useState(screenWidth.current >= 800 ? true : false);;

    const [error, setError] = useState(null);

    const sideBar = useRef(null);

    const mainBody = useRef(null);


    /**
     * Asynchronous function to retrieve all previously validated business ideas for the logged-in user.
     * 
     * This function sends a GET request to the server to fetch a list of all the user's previously validated ideas.
     * The retrieved data is then stored in the application state for displaying to the user.
     * 
     * @function getPreviousValidatedIdeas
     * @returns {Promise<void>} - A promise that resolves when the fetch operation completes.
     */

    const getPreviousValidatedIdeas = async () => {
        
        let response  = await fetch(`${apiUrl}/bot/validator/`, {
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
    
    /**
     * Asynchronous function to retrieve and display the validation response of a previously submitted idea.
     * 
     * This function sends a GET request to fetch the validation response of a specific idea by its `id`. 
     * If the request is successful, the function updates the UI state with the retrieved validation response.
     * 
     * @function readPreviousIdea
     * @param {string|number} id - The unique identifier of the previously submitted idea.
     * @returns {Promise<void>} - A promise that resolves when the fetch operation completes.
     */

    const readPreviousIdea = async (id) => {

        let response = await fetch(`${apiUrl}/bot/validator/${id}/`, {
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
    

    /**
     * Asynchronous function to validate a user's business idea using an external bot API.
     * 
     * This function handles the form submission event, checks the user's internet connection, and sends the user's business idea and target market
     * to an API for validation. It also manages UI states such as button disabling, error messages, and successful responses.
     * 
     * @function validateIdea
     * @param {Event} e - The form submission event.
     * @returns {Promise<void>} - A promise that resolves when the validation process is complete.
     */
    const validateIdea = async (e) => {

        try{
        
            e.preventDefault();

            setButtonDisable(true);

            if(!navigator.onLine){
                throw new Error();
            }
            else{
                const online = await isOnline();
                if (!online) {
                    throw new Error()
                }
            }

            const user_idea = e.target.idea.value
            const user_target_market = e.target.targetMarket.value
            
            let botResponse = await fetch(`${apiUrl}/bot/validator/`,{
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
                setError("This request is taking longer than expected, please try again.")
                setTimeout( () => {
                    setError(null)
                }, 5000)
            }
        }
        catch(err){
            setError("Check your internet connection and try again")
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

    useEffect( () => {
        window.scrollTo(0,0);
    }, [])


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
                        <button onClick={userLogout} className="flex gap-4 cursor-pointer">
                            <img className="h-[25px] icons" src={logout} alt="" /> 
                            <p>Log Out</p>
                        </button>  
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
