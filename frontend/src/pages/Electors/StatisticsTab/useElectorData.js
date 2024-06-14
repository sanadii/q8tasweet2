// hooks/useElectorData.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getElectorsByCategory } from "store/actions";

const useElectorData = (selectedOptions, electionSlug) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedOptions.families.length || selectedOptions.areas.length) {
            dispatch(getElectorsByCategory({
                slug: electionSlug,
                families: selectedOptions.families.map(opt => opt.value),
                areas: selectedOptions.areas.map(opt => opt.value),
            }));
        }
    }, [selectedOptions, dispatch, electionSlug]); // Ensure all dependencies are correctly listed
};


export default useElectorData;
