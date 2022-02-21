import {format, formatDistanceToNow} from "date-fns";
import {fr} from 'date-fns/locale'

export const formatDate = (dbDate) => {
    return format(new Date(dbDate), "d/MM/yyyy", { locale: fr })
}

export const formatDistance = (dbDate, addSuffix = true) => {
    return formatDistanceToNow(new Date(dbDate), {addSuffix: addSuffix, locale: fr })
}