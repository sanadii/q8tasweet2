// React & Redux core imports
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Action & Selector imports
import { getParties, addElectionParty } from "store/actions";
import { electionSelector, partySelector } from 'selectors';

// UI Components & styling imports
import { Input, Form } from "reactstrap";
import SimpleBar from "simplebar-react";

const AddElectionParty = ({ election }) => {
    const dispatch = useDispatch();
    const { electionParties } = useSelector(electionSelector);
    const { parties } = useSelector(partySelector);
    const electionPartyList = electionParties;

    // Dispatch getParty TODO: MOVE TO ELECTION DETAILS
    useEffect(() => {
        if (parties && !parties.length) {
            dispatch(getParties());
        }
    }, [dispatch, parties]);

    // Add New ElectionParty Search & Filter
    const [searchPartyInput, setSearchPartyInput] = useState("");
    const [partyList, setPartyList] = useState(parties);

    useEffect(() => {
        setPartyList(
            parties.filter((party) =>
                party?.name ? party?.name
                    .toLowerCase().includes(searchPartyInput
                        .toLowerCase()) : false
            )
        );
    }, [parties, searchPartyInput]);

    return (
        <>
            <div className="search-box mb-3">
                <Input
                    type="text"
                    className="form-control bg-light border-light"
                    placeholder="Search here..."
                    value={searchPartyInput}
                    onChange={(e) => setSearchPartyInput(e.target.value)}
                />
                <i className="ri-search-line search-icon"></i>
            </div>

            <SimpleBar
                className="mx-n4 px-4"
                data-simplebar="init"
                style={{ maxHeight: "225px" }}
            >
                <div className="vstack gap-3">
                    {partyList.map((party) => (
                        <Form
                            key={party.id}
                            className="tablelist-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const newElectionParty = {
                                    election: election,
                                    party: party.id,
                                };
                                dispatch(addElectionParty(newElectionParty));
                            }}
                        >
                            <div className="d-flex align-items-center">
                                <input
                                    type="hidden"
                                    id="id-field"
                                    name="id"
                                    value={party.id}
                                />
                                <div className="avatar-xs flex-shrink-0 me-3">
                                    <img src={party.image} alt="" className="img-fluid rounded-circle" />
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fs-13 mb-0">
                                        {party.name}
                                    </h5>
                                </div>
                                <div className="flex-shrink-0">
                                    {electionPartyList.some(
                                        (item) => item.party === party.id
                                    ) ? (
                                        <p className="text-success">
                                            تمت الإضافة
                                        </p>
                                    ) : (
                                        <button type="submit" className="btn btn-light btn-sm" id="add-btn">
                                            أضف
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Form>
                    ))}
                </div>
            </SimpleBar>
        </>
    );
};

export default AddElectionParty;
