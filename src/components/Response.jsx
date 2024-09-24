import addLight from '../assets/addLight.svg'
const Response = ({botResponse, validateNewIdeaFunct}) => {

    return (
        <div className="p-8 px-8">
            <div dangerouslySetInnerHTML={{ __html: botResponse }} />
            <div className='mt-[3em]'>
                <button onClick={validateNewIdeaFunct} className='flex items-center px-3 py-3 text-white rounded-2xl bg-redbold'> 
                    <img className="h-[30px] icons" src={addLight} alt="" />
                    <p>Validate a new idea</p>
                </button>
            </div>
        </div>
    )
}

export default Response