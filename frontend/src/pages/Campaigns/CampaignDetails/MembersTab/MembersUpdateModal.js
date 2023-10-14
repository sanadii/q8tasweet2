// React & Redux
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCampaignMember } from "store/actions";
import { userSelector, campaignSelector } from 'Selectors';

// Component & Constants imports 
import { useUserRoles, useSupervisorMembers, useCampaignRoles } from "Components/Hooks";

// Form validation imports
import * as Yup from "yup";
import { useFormik } from "formik";

// Reactstrap (UI) imports
import { Col, Row, ModalBody, Label, Input, Form, FormFeedback } from "reactstrap";

const MembersUpdateModal = ({ campaignMember, setOnModalSubmit }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(userSelector);
  const {
    currentCampaignMember,
    campaignId,
    campaignMembers,
    campaignRoles,
    campaignElectionCommittees
  } = useSelector(campaignSelector);

  const [campaignCommitteeList, setCampaignCommitteeList] = useState(campaignElectionCommittees);

  useEffect(() => {
    setCampaignCommitteeList(campaignElectionCommittees);
  }, [campaignElectionCommittees]);

  const supervisorOptions = useSupervisorMembers(campaignRoles, campaignMembers);
  const roleOptions = useCampaignRoles(campaignRoles, currentCampaignMember);

  const { id, campaign, role, committee, supervisor, phone, notes } = campaignMember || {};

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: id || "",
      campaign: campaignId || "",
      role: role || "",
      committee: committee || "",
      supervisor: supervisor || "",
      phone: phone || "",
      notes: notes || "",
    },
    validationSchema: Yup.object({
      role: Yup.number().integer().required("role is required"),
      supervisor: Yup.number().integer(),
      committee: Yup.number().integer(),
    }),
    onSubmit: (values) => {
      dispatch(updateCampaignMember({
        ...values,
        campaign: parseInt(values.campaign, 10),
        role: parseInt(values.role, 10),
        committee: parseInt(values.committee, 10),
        supervisor: parseInt(values.supervisor, 10)
      }));
      validation.resetForm();
    },
  });
  
  const getRoleString = useCallback((roleId, roles) => {
    const roleObj = roles.find(role => role.id.toString() === roleId.toString());
    return roleObj ? roleObj.role : null;
  }, [campaignRoles]);

  const [selectedRole, setSelectedRole] = useState(validation.values.role);

  useEffect(() => {
    setSelectedRole(validation.values.role);
  }, [validation.values.role]);

  const currentRoleString = getRoleString(selectedRole, campaignRoles);

  const handleUpdateButton = useCallback(() => validation.submitForm(), [validation]);

  useEffect(() => {
    setOnModalSubmit(() => handleUpdateButton);
    return () => setOnModalSubmit(null);
  }, [handleUpdateButton]);

  // Field Definition Builder
  const buildFields = () => {
    const isCurrentUserCampaignMember = campaignMember && currentUser.id !== campaignMember.userId;

    const defaultFields = [
      isCurrentUserCampaignMember && {
        id: "role-field",
        label: "Role",
        type: "select",
        options: campaignRoles.map(role => ({
          id: role.id,
          label: role.name,
          role: role.role,
          value: role.id
        })),
        name: "role",
      },
      {
        id: "phone-field",
        label: "Mobile",
        type: "text",
        name: "phone"
      },
      {
        id: "notes-field",
        label: "Notes",
        type: "textarea",
        name: "notes"
      }
    ];

    const conditionalFields = [
      {
        condition: ["campaignGuarantor", "campaignAttendant", "campaignSorter"].includes(currentRoleString),
        field: {
          id: "supervisor-field",
          label: "المشرف",
          type: "select",
          options: supervisorOptions.map(supervisor => ({
            id: supervisor.id,
            label: supervisor.fullName,
            value: supervisor.id
          })),
          name: "supervisor",
          valueAccessor: (item) => item.fullName,
        }
      },
      {
        condition: ["campaignAttendant", "campaignSorter"].includes(currentRoleString),
        field: {
          id: "committee-field",
          label: "Committee",
          type: "select",
          options: campaignCommitteeList.map(committee => ({
            id: committee.id,
            label: committee.name,
            value: committee.id
          })),

          name: "committee",
          valueAccessor: (item) => item.name,
        }
      }
    ];

    const filteredFields = conditionalFields
      .filter(({ condition }) => condition)
      .map(({ field }) => field);

    return [...defaultFields, ...filteredFields].filter(Boolean);
  };

  const fields = useMemo(buildFields, [currentRoleString, campaignCommitteeList, supervisorOptions, roleOptions]);


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

        {fields.map((field) => (
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
                  invalid={
                    validation.touched[field.name] && validation.errors[field.name]
                  }
                />
              ) : (
                <Input
                  {...field}
                  className={field.type === "select" ? "form-select" : ""}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values[field.name] || ""}
                >
                  {field.type === "select" && <option value="">-- Select --</option>}
                  {field.options && field.options.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Input>
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

export default MembersUpdateModal;
