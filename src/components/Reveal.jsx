import { useState } from "react"
const Reveal = ({inputField}) => {

    const [isHidden, setIsHidden] = useState(true)

    const password = () => {
        // using the state updater function to make use of the new state variable instead of the current state variable snapshot.
        setIsHidden((prev) => {
            const newHiddenState = !prev;
            inputField.current.type = newHiddenState ? 'password' : 'text';
            return newHiddenState;
        });
    }
    return (
        <div className="w-[10%] flex justify-center items-center cursor-pointer">
            {
                isHidden ?
                    <i onClick={password} className="bi bi-eye-slash"></i>
                :
                    <i onClick={password} className="bi bi-eye"></i>    
            }
        </div>
    )
}

export default Reveal