/*
export const PropositionListItemBrief = ({ greeting, isShow }) =>
    isShow ? <h1>{greeting}</h1> : null;
 */
export const PropositionListItemBrief = ({proposition}) => {

    return <div><h4>{proposition.title}</h4>
        <span>{typeof proposition.author === "string" ? proposition.author : proposition.author.displayName}</span>
    </div>

};
