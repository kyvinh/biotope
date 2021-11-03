
export const PropositionListItemBrief = ({proposition}) => {

    return <div><h4>{proposition.title}</h4>
        <div>From: {proposition.author}</div>
        <div>Description: {proposition.text}</div>
        <ul>{!!proposition.constituents ? proposition.constituents.map((constituent, i) => (
            <li key={i}>{constituent}</li>
        )) : null}</ul>
    </div>

};
