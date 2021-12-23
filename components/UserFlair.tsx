import {Badge, Button} from "react-bootstrap";

export const UserFlair = ({user, theme="outline-dark"}) => {
    if (!user) {
        return null
    }

    return <Button size="sm" variant={theme} className="user-flair">
        { user.name ? user.name : "Un voisin" }
        <Badge pill className="mx-1" bg="secondary">{ user.reputationPoints}</Badge>
        <span className="visually-hidden">reputation points</span>
    </Button>
}