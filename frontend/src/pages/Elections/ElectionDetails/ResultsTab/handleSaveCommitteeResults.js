import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { updateElectionCommitteeResults, updateElectionCandidates } from "store/actions";

// UpdateCommittee Results
const useSaveCommitteeResults = (
    committeeEditedData,
    committeeEdited,
    setCommitteeEdited,
    setCommitteeEditedData,
    toggleCommitteeToEdit
) => {
    const dispatch = useDispatch();

    return useCallback((committeeId) => {
        if (committeeEditedData[committeeId]) {
            const updatedElectionCommitteeResult = {
                id: committeeId,
                data: committeeEditedData[committeeId]
            };
            console.log("DataData:", committeeEditedData)
            dispatch(updateElectionCommitteeResults(updatedElectionCommitteeResult));



            // Reset edited data for this specific committee
            const updatededitedCommittee = { ...committeeEdited };
            delete updatededitedCommittee[committeeId];
            setCommitteeEdited(updatededitedCommittee);

            // Reset the modified data for this committee if needed
            const updatedModifiedData = { ...committeeEditedData };
            delete updatedModifiedData[committeeId];
            setCommitteeEditedData(updatedModifiedData);

            // Toggle edit mode off immediately, don’t wait for the action to complete
            toggleCommitteeToEdit(committeeId);
        } else {
            // If no modifications are there but user still clicked save, simply toggle off the edit mode
            toggleCommitteeToEdit(committeeId);
        }
    }, [committeeEditedData, dispatch, committeeEdited, setCommitteeEdited, setCommitteeEditedData, toggleCommitteeToEdit]);
};



export default useSaveCommitteeResults;
