import { useNavigate } from "react-router-dom"
const AuthHeader = ({headingText, paragraphText}) => {
    
    const navigate = useNavigate()
    
    return (
        <header>
            <div className="flex items-center gap-2 mb-4 font-semibold cursor-pointer text-redbold" onClick={ () => navigate(-1)}>
                <i className="text-2xl bi bi-arrow-left"></i>
                <p>Back</p>
            </div>
            <h2 className="text-5xl font-medium text-black001 tab:text-3xl">{headingText}</h2>
            <p className="mt-2 text-lg font-normal text-grayBlue">{paragraphText}</p>
        </header>
    )
}


export default AuthHeader