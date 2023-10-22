// React & Redux
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCampaignMember } from "store/actions";
import { userSelector, campaignSelector } from 'Selectors';

// Component & Constants imports 
import { useSupervisorMembers, useCampaignRoles } from "Components/Hooks";

// Form validation imports
import * as Yup from "yup";
import { useFormik } from "formik";

// Reactstrap (UI) imports
import { Col, Row, ModalBody, Label, Input, Form, FormFeedback } from "reactstrap";

const MembersUpdateModal = ({ campaignMember, setOnModalSubmit }) => {
  const dispatch = useDispatch();

  // State Managemenet
  const { currentUser } = useSelector(userSelector);
  const {
    currentCampaignMember,
    campaignId,
    campaignMembers,
    campaignRoles,
    campaignElectionCommittees
  } = useSelector(campaignSelector);

  // Campaign Supervisor Options
  const supervisorOptions = useSupervisorMembers(campaignRoles, campaignMembers);
  const filteredRoleOptions = useCampaignRoles(campaignRoles, currentCampaignMember);
  console.log("filteredRoleOptions:", filteredRoleOptions);
  console.log("Original campaignRoles:", campaignRoles);

  // Election Committee Options
  const [campaignCommitteeList, setCampaignCommitteeList] = useState(campaignElectionCommittees);

  useEffect(() => {
    setCampaignCommitteeList(campaignElectionCommittees);
  }, [campaignElectionCommittees]);


  // Form Validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (campaignMember && campaignMember.id) || "",
      campaign: campaignId || "",
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
      const updatedCampaignMember = {
        id: campaignMember ? campaignMember.id : 0,
        campaign: parseInt(values.campaign, 10),
        role: parseInt(values.role, 10),
        committee: parseInt(values.committee, 10),
        supervisor: parseInt(values.supervisor, 10),
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
    return roleObj ? roleObj.role : null;
  }, [campaignRoles]);

  const [selectedRole, setSelectedRole] = useState(validation.values.role);

  useEffect(() => {
    setSelectedRole(validation.values.role);
  }, [validation.values.role]);

  const selectedRoleString = getRoleString(selectedRole, campaignRoles);


  // Get formFields & Handle Form Submission
  const formFields = useMemo(
    () =>
      buildFields(
        currentUser,
        campaignMember,
        selectedRoleString,
        campaignCommitteeList,
        supervisorOptions,
        filteredRoleOptions
      ),
    [currentUser, campaignMember, selectedRoleString, campaignCommitteeList, supervisorOptions, filteredRoleOptions]
  );

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
        <Row>
          <input type="hidden" id="id-field" />
          <h4>
            <strong>
              [{validation.values.id}] {validation.values.fullName}
            </strong>
          </h4>
        </Row>

        {formFields.map((field) => (
          <Row key={field.id}>
            <Col lg={3} className="align-self-center">
              <Label for={field.id} className="mb-0">
                {field.label}
              </Label>
            </Col>
            <Col lg={9}>
              {field.type === "textarea" ? (
                <textarea
                  {...field}
                  className="form-control"
                  placeholder={`Enter ${field.label}`}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values[field.name] || ""}
                  invalid={validation.touched[field.name] && validation.errors[field.name] ? true : undefined}

                />
              ) : field.type === "select" ? (
                <Input
                  {...field}
                  type="select"
                  className="form-select"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values[field.name] || ""}
                >
                  <option value="">-- اختر --</option>
                  {field.options && field.options.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Input>
              ) : (
                <Input
                  {...field}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values[field.name] || ""}
                />
              )}
              {validation.touched[field.name] && validation.errors[field.name] && (
                <FormFeedback type="invalid">
                  {validation.errors[field.name]}
                </FormFeedback>
              )}
            </Col>

          </Row>
        ))}
      </ModalBody>
    </Form>
  );
};

// Field Definition Builder
const buildFields = (currentUser, campaignMember, selectedRoleString, campaignCommitteeList, supervisorOptions, filteredRoleOptions) => {
  const isCurrentUserCampaignMember = campaignMember && currentUser.id !== campaignMember.userId;

  const defaultFields = [
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
    }
  ];

  const conditionalFields = [
    {
      condition: ["campaignGuarantor", "campaignAttendant", "campaignSorter"].includes(selectedRoleString),
      field: {
        id: "supervisor-field",
        name: "supervisor",
        label: "المشرف",
        type: "select",
        options: supervisorOptions.map(supervisor => ({
          id: supervisor.id,
          label: supervisor.fullName,
          value: supervisor.id
        })),
        // valueAccessor: (item) => item.fullName,
      }
    },
    {
      condition: ["campaignAttendant", "campaignSorter"].includes(selectedRoleString),
      field: {
        id: "committee-field",
        name: "committee",
        label: "اللجنة",
        type: "select",
        options: campaignCommitteeList.map(committee => ({
          id: committee.id,
          label: committee.name,
          value: committee.id
        })),
      }
    }
  ];

  const filteredFields = conditionalFields
    .filter(({ condition }) => condition)
    .map(({ field }) => field);

  return [...defaultFields, ...filteredFields].filter(Boolean);
};

export default MembersUpdateModal;
