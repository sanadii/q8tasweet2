import React from "react"
import { Table } from "reactstrap"

const CommitteeExpandedContent = ({ row }) => {

    return (
        <React.Fragment>
            <p> <strong>اللجان الأصلية والفرعية</strong></p>
            <Table>
                <tr>
                    <th>م.</th>
                    <th>اللجنة</th>
                    <th>النوع</th>
                    <th>الحروف</th>
                </tr>
                {row.original.committees.map(committee => (

                    <tr key={committee.id}>
                        <td>{committee.serial} - {committee.type}</td>
                        <td>{committee.areas}</td>
                        <td>{row.original.gender}</td>
                        <td>{committee.letters}</td>
                    </tr>
                ))}

            </Table>
        </React.Fragment>

    )

}

export default CommitteeExpandedContent