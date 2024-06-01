import React, { useState, useEffect, useCallback } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { updateCampaignMember } from "store/actions";
import { userSelector, campaignSelector } from 'selectors';

// Components
import { useMemberOptions, useCampaignRoles, getListOptions, getAllCommittees, getCampaignAgentCommittees, useCommitteeSiteCommittees } from "shared/hooks";
import { FormFields } from "shared/components";
import { useFormik } from "formik";

// Reactstrap (UI) imports
import { Form, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const MembersUpdateModal = ({ campaignMember, toggle }) => {
  const dispatch = useDispatch();
  // State Managemenet
  const { currentUser } = useSelector(userSelector);
  const { currentCampaignMember, campaignMembers, campaignRoles, electionCommitteeSites } = useSelector(campaignSelector);

  const requiresSupervisor = ["campaignFieldDelegate", "campaignDigitalDelegate"].includes(campaignMember?.roleCodename);
  const requiresCommittee = ["campaignFieldAgent", "campaignDigitalAgent", "campaignFieldDelegate", "campaignDigitalDelegate"].includes(campaignMember?.roleCodename);

  // const supervisorOptions = useSupervisorMembers(campaignRoles, campaignMembers);
  const filteredRoleOptions = useCampaignRoles(campaignRoles, currentCampaignMember);

  const committeeSiteIds = campaignMember?.committeeSites?.map(committee => committee.committeeSite.id) || [];
  const committeesIds = campaignMember?.committees?.map(committee => committee.committee.id) || [];

  const committeeSiteOptions = getListOptions(electionCommitteeSites)
  const committeeOptions = useCommitteeSiteCommittees(electionCommitteeSites);


  // Form Validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: campaignMember?.id || null,
      role: campaignMember?.role || null,
      committeeSites: committeeSiteIds || [],
      committees: committeesIds || [],
      supervisor: campaignMember?.supervisor || null,
      phone: campaignMember?.phone || "",
      notes: campaignMember?.notes || "",
    },
    // validationSchema: Yup.object({
    //   role: Yup.number().integer().required("role is required"),
    //   supervisor: Yup.number().integer(),
    //   committeeSites: Yup.number().integer(),
    // }),
    onSubmit: (values) => {
      const updatedCampaignMember = {
        id: campaignMember?.id || null,
        role: parseInt(values.role, 10),
        supervisor: requiresSupervisor ? parseInt(values.supervisor, 10) : null,
        committeeSites: values.committeeSites || [],
        committees: values.committees || [],
        phone: values.phone,
        notes: values.notes,
      };

      dispatch(updateCampaignMember(updatedCampaignMember));
      validation.resetForm();
      toggle();
    },
  });
  console.log("committeeOptions: ", committeeOptions)
  console.log("validation: ", validation.values.committeeSites)

  // Show formFields based on Selected Role String
  const getRoleString = useCallback((roleId, roles) => {
    if (roleId == null) return null;
    const roleObj = roles.find(role => role.id.toString() === roleId.toString());
    return roleObj ? roleObj.codename : null;
  }, []);

  const agentRoles = ["campaignFieldAgent", "campaignDigitalAgent"].includes(getRoleString(validation.values.role, campaignRoles));
  const delegateMembers = ["campaignFieldDelegate", "campaignDigitalDelegate", "campaignDelegate"].includes(getRoleString(validation.values.role, campaignRoles));
  const campaignFieldAgentOptions = useMemberOptions(campaignMembers, "campaignFieldAgent");
  const campaignDigitalAgentOptions = useMemberOptions(campaignMembers, "campaignDigitalAgent");
  const campaignMemberRoleCodename = getRoleString(validation.values.role, campaignRoles)

  const getCampaignSupervisorData = (campaignMemberRoleCodename, campaignFieldAgentOptions, campaignDigitalAgentOptions) => {
    switch (campaignMemberRoleCodename) {
      case "campaignFieldDelegate":
        return {
          options: campaignFieldAgentOptions,
          label: "الوكلاء الميدانيين",
        };
      case "campaignDigitalDelegate":
        return {
          options: campaignDigitalAgentOptions,
          label: "الوكلاء الرقميين",
        };
      default:
        return {
          options: [],
          label: "",
        };
    }
  };

  const { options: campaignSupervisorOptions, label: campaignSupervisorLabel } = getCampaignSupervisorData(
    campaignMemberRoleCodename,
    campaignFieldAgentOptions,
    campaignDigitalAgentOptions
  );


  const isCurrentUserCampaignMember = campaignMember && currentUser.id !== campaignMember.userId;


  const campaignAgentCommittees = getCampaignAgentCommittees(validation?.values?.supervisor, electionCommitteeSites)


  const fields = [
    isCurrentUserCampaignMember && {
      id: "role-field",
      name: "role",
      label: "العضوية",
      type: "select",
      options: getListOptions(filteredRoleOptions),
    },
    {
      id: "supervisor-field",
      name: "supervisor",
      label: campaignSupervisorLabel,
      type: "select",
      options: campaignSupervisorOptions,
      condition: delegateMembers
    },
    {
      id: "committeeSites-field",
      name: "committeeSites",
      label: "اللجنة",
      type: "selectMulti",
      options: committeeSiteOptions,
      condition: { delegateMembers, agentRoles },
    },
    {
      id: "committees-field",
      name: "committees",
      label: "اللجنة",
      type: "selectMulti",
      options: committeeSiteOptions,
      condition: { delegateMembers, agentRoles },
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
  ].filter(Boolean);


  return (
    <Form
      className="tablelist-form"
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
      }}
    >
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        تعديل {campaignMember?.name}
      </ModalHeader>
      <ModalBody className="vstack gap-3">
        <input type="hidden" id="id-field" />
        <h5>
          <strong>
            [{campaignMember?.id}] {campaignMember?.name}
          </strong>
          <span>- {campaignMember?.roleName}</span>
        </h5>
        {
          fields.map(field => (
            (field.condition === undefined || field.condition) && (
              <FormFields
                key={field.id}
                field={field}
                validation={validation}
                formStructure="table2"
              />
            )
          ))
        }
      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button
            color="light"
            onClick={() => { toggle(); }}
            className="btn-light"
          >
            إغلاق
          </Button>

          {/* if modalButtonText and modalButtonText is not empty */}
          <Button
            color="success"
            id="add-btn"
            type="submit"
          >
            تعديل
          </Button>
        </div>
      </ModalFooter>

    </Form>
  );
};

export default MembersUpdateModal;