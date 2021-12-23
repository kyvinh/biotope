import {format} from "date-fns";

export const formatDate = (dbDate) => {
    return format(new Date(dbDate), "d/MM/yyyy")
}