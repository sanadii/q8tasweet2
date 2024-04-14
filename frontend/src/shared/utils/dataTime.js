// Dates
import * as moment from "moment";


// Used for ElectionList, 
export const defaultDate = () => {
    let d = new Date();
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
};


// used in ElectionListColumns, ElectionModal
// export const handleValidDate = (dueDate) => {
//     const formattedDate = moment(dueDate).format("YYYY-MM-DD");
//     return formattedDate;
// };

export const handleValidDate = (dueDate) => {
    // Check if dueDate is already in the correct format
    if (moment(dueDate, "YYYY-MM-DD", true).isValid()) {
        return dueDate; // Return the date as it is
    } else {
        // Try parsing with other common formats
        const formattedDate = moment(dueDate, ["YYYY-MM-DD", "MM/DD/YYYY", "YYYY/MM/DD", "DD-MM-YYYY", "DD/MM/YYYY"], true).format("YYYY-MM-DD");
        if (moment(formattedDate, "YYYY-MM-DD", true).isValid()) {
            return formattedDate; // Return the formatted date if it's valid
        } else {
            // Handle invalid date input here, such as returning null or throwing an error
            return null;
        }
    }
};

