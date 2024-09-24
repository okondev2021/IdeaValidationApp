const PreviousIdea = ({previousIdeas, readPreviousIdea}) => {

    const shortenIdea = (idea) => {
        let userIdea = idea.user_idea.split(' ').slice(0,4).join(" ")
        return userIdea+"..."
    }
    
    return (
        <div className="p-2 rounded-lg cursor-pointer hover:bg-red-100" onClick={() => readPreviousIdea(previousIdeas.id)}>
            {shortenIdea(previousIdeas)}
        </div>
    )
}

export default PreviousIdea