import {Badge, Button} from "react-bootstrap";
/*
theme = react-bootstrap button variant OR 'none'
 */
export const UserFlair = ({user, theme="outline-dark"}) => {
    if (!user) {
        return null
    }

    const displayName = user.name ? user.name : "Un voisin"

    if (theme === "none") {
        return <span>{displayName}</span>
    } else {
        return <Button size="sm" variant={theme} className="user-flair">
            { displayName }
            <Badge pill className={`mx-1 ${ !user.reputationsPoints && 'd-none' }`} bg="secondary">{ user.reputationPoints }</Badge>
            <span className="visually-hidden">reputation points</span>
        </Button>
    }
}