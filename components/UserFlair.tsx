import {Badge, Button} from "react-bootstrap";
import messages from "../lib/messages.fr";
/*
theme = react-bootstrap button variant OR 'none'
 */
export const UserFlair = ({user, theme="outline-dark"}) => {
    if (!user) {
        return null
    }

    const displayName = user.name ? user.name : messages.user['anonymous-name']

    if (theme === "none") {
        return <span>{displayName}</span>
    } else {
        return <Button size="sm" variant={theme} className="user-flair">
            { displayName }
            <Badge pill className={`mx-1 ${ !user.reputationsPoints && 'd-none' }`} bg="secondary">{ user.reputationPoints }</Badge>
            <span className="visually-hidden">{messages.user["reputation-points"]}</span>
        </Button>
    }
}