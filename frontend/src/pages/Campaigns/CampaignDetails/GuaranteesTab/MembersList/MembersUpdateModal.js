// React & Redux
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCampaignMember } from "store/actions";
import { userSelector, campaignSelector } from 'selectors';

// Component & Constants imports 
import { useSupervisorMembers, useCampaignRoles } from "shared/hooks";

// Form validation imports
import { FormFields } from "shared/components"
import * as Yup from "yup";
import { useFormik } from "formik";

// Reactstrap (UI) imports
import { ModalBody, Form } from "reactstrap";

const MembersUpdateModal = ({ campaignMember, setOnModalSubmit, modalMode }) => {
  const dispatch = useDispatch();
  // State Managemenet
  const { currentUser } = useSelector(userSelector);
  const {
    currentCampaignMember,
    campaignId,
    campaignMembers,
    campaignRoles,
    campaignElectionCommittees,
  } = useSelector(campaignSelector);

  // Campaign Supervisor Options
  const supervisorOptions = useSupervisorMembers(campaignRoles, campaignMembers);
  const filteredRoleOptions = useCampaignRoles(campaignRoles, currentCampaignMember);
  const [campaignCommitteeList, setCampaignCommitteeList] = useState(campaignElectionCommittees);

  useEffect(() => {
    setCampaignCommitteeList(campaignElectionCommittees);
  }, [campaignElectionCommittees]);


  // Form Validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (campaignMember && campaignMember.id) || "",
      role: (campaignMember && campaignMember.role) || "",
      committee: (campaignMember && campaignMember.committee) || "",
      supervisor: (campaignMember && campaignMember.supervisor) || "",
      phone: (campaignMember && campaignMember.phone) || "",
      notes: (campaignMember && campaignMember.notes) || "",
    },
    validationSchema: Yup.object({
      role: Yup.number().integer().required("role is required"),
      supervisor: Yup.number().integer(),
      committee: Yup.number().integer(),
    }),
    onSubmit: (values) => {

      const requiresSupervisor = ["campaignGuarantor", "campaignAttendant", "campaignSorter"].includes(getRoleString(values.role, campaignRoles));
      const requiresCommittee = ["campaignAttendant", "campaignSorter"].includes(getRoleString(values.role, campaignRoles));

      const updatedCampaignMember = {
        id: campaignMember ? campaignMember.id : 0,
        role: parseInt(values.role, 10),
        supervisor: requiresSupervisor ? parseInt(values.supervisor, 10) : '',
        committee: requiresCommittee ? parseInt(values.committee, 10) : '',
        phone: values.phone,
        notes: values.notes,
      };
      dispatch(updateCampaignMember(updatedCampaignMember));
      validation.resetForm();
    },
  });


  // Show formFields based on Selected Role String
  const getRoleString = useCallback((roleId, roles) => {
    const roleObj = roles.find(role => role.id.toString() === roleId.toString());
    return roleObj ? roleObj.name : null;
  }, [campaignRoles]);

  const [selectedRole, setSelectedRole] = useState(validation.values.role);

  useEffect(() => {
    setSelectedRole(validation.values.role);
  }, [validation.values.role]);

  const selectedRoleString = getRoleString(selectedRole, campaignRoles);

  const isCurrentUserCampaignMember = campaignMember && currentUser.id !== campaignMember.userId;

  const fields = [
    isCurrentUserCampaignMember && {
      id: "role-field",
      name: "role",
      label: "العضوية",
      type: "select",
      options: filteredRoleOptions.map(role => ({
        id: role.id,
        label: role.displayName,
        role: role.name,
        value: role.id
      })),
    },
    {
      id: "supervisor-field",
      name: "supervisor",
      label: "الوكيل",
      type: "select",
      options: [
        { id: '', label: '- اختر الوكيل - ', value: '' }, // Add this default option
        ...supervisorOptions.map(supervisor => ({
          id: supervisor.id,
          label: supervisor.name,
          value: supervisor.id
        }))
      ],
      condition: ["campaignGuarantor", "campaignAttendant", "campaignSorter"].includes(selectedRoleString),
    },
    {
      id: "committee-field",
      name: "committee",
      label: "اللجنة",
      type: "select",
      options: [
        { id: '', label: '- اختر اللجنة - ', value: '' }, // Add this default option
        ...campaignCommitteeList.map(committee => ({
          id: committee.id,
          label: committee.name,
          value: committee.id
        }))
      ],
      condition: ["campaignAttendant", "campaignSorter"].includes(selectedRoleString),
    },
    {
      id: "phone-field",
      name: "phone",
      label: "الهاتف",
      type: "text",
    },
    {
      id: "notes-field",
      name: "notes",
      label: "ملاحظات",
      type: "textarea",
    },
  ].filter(Boolean); // This will remove any falsey values from the array, e.g., if isCurrentUserCampaignMember is false


  // Get formFields & Handle Form Submission
  const handleUpdateButton = useCallback(() => validation.submitForm(), [validation]);

  useEffect(() => {
    setOnModalSubmit(() => handleUpdateButton);
    return () => setOnModalSubmit(null);
  }, []);

  return (
    <Form
      className="tablelist-form"
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
      }}
    >
      <ModalBody className="vstack gap-3">
        <input type="hidden" id="id-field" />
        <h4>
          <strong>
            [{validation.values.id}] {validation.values.fullName}
          </strong>
        </h4>
        {
          fields.map(field => {
            return (field.condition === undefined || field.condition) && (
              <FormFields
                key={field.id}
                field={field}
                validation={validation}
                inLineStyle={true}
              />
            );
          })
        }
      </ModalBody>
    </Form >
  );
};

export default MembersUpdateModal;