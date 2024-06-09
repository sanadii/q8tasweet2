import React, { useMemo, useEffect } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { updateCampaignMember } from "store/actions";
import { userSelector, campaignSelector } from 'selectors';

// Components
import { useMemberOptions, useCampaignRoles, getCommitteeSiteOptions, useAgentMemberCommitteeSites, useCommitteeOptions, getCampaignAgentMembers, useCampaignRoleString, isMemberRoleOption } from "shared/hooks";
import { FormFields } from "shared/components";
import { useFormik } from "formik";
import * as Yup from "yup";

// Reactstrap (UI) imports
import { Form, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const MembersUpdateModal = ({ campaignMember, toggle }) => {
  const dispatch = useDispatch();

  // Selectors
  const { currentUser } = useSelector(userSelector);
  const {
    currentCampaignMember,
    campaignMembers,
    campaignRoles,
    electionCommitteeSites,
  } = useSelector(campaignSelector);

  // Campaign Role Dictionary
  const campaignManagerRoles = ["campaignCandidate", "campaignAdmin", "campaignFieldAdmin", "CampainDigitalAdmin"];
  const campaignAgentRoles = ["campaignFieldAgent", "campaignDigitalAgent"];
  const campaignDelegateRoles = ["campaignFieldDelegate", "campaignDigitalDelegate"];

  // Filtered Role Options based on Current Member Role
  const filteredRoleOptions = useCampaignRoles(campaignRoles, currentCampaignMember);

  // Get campaign Agent Options for Field and Digital
  const campaignFieldAgentOptions = useMemberOptions(campaignMembers, "campaignFieldAgent");
  const campaignDigitalAgentOptions = useMemberOptions(campaignMembers, "campaignDigitalAgent");

  // Get CommitteeSite and Committee Options
  const committeeSiteOptions = getCommitteeSiteOptions(electionCommitteeSites);
  const committeeOptions = useCommitteeOptions(electionCommitteeSites);

  // Form Validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: campaignMember?.id || null,
      role: campaignMember?.role || null,
      committeeSites:
        campaignMember?.committeeSites?.map((site) => site.id) || [],
      committee: campaignMember?.committee?.id || null,
      supervisor: campaignMember?.supervisor || null,
      phone: campaignMember?.phone || "",
      notes: campaignMember?.notes || "",
    },
    validationSchema: Yup.object({
      role: Yup.number().integer().required("Role is required"),
    }),
    onSubmit: (values) => {
      const updatedCampaignMember = {
        id: values.id,
        role: parseInt(values.role, 10),
        phone: values.phone,
        notes: values.notes,
      };


      if (isMemberRoleOption(campaignRoles, campaignManagerRoles, values.role)) {
        updatedCampaignMember.supervisor = null;
        updatedCampaignMember.committeeSites = [];
        updatedCampaignMember.committee = null;
      }

      if (isMemberRoleOption(campaignRoles, campaignAgentRoles, values.role)) {
        updatedCampaignMember.supervisor = null;
        updatedCampaignMember.committeeSites = values.committeeSites || [];
        updatedCampaignMember.committee = null;
      }

      if (isMemberRoleOption(campaignRoles, campaignDelegateRoles, values.role)) {
        updatedCampaignMember.supervisor = values?.supervisor || null;
        updatedCampaignMember.committeeSites = [];
        updatedCampaignMember.committee = values.committee || null;
      }

      dispatch(updateCampaignMember(updatedCampaignMember));
      validation.resetForm();
      toggle();
    },
  });

  const isCurrentUserDifferentCampaignMember = campaignMember && currentUser.id !== campaignMember.userId;
  const isAgentMember = campaignAgentRoles.includes(useCampaignRoleString(validation.values.role, campaignRoles));
  const isDelegateMember = campaignDelegateRoles.includes(useCampaignRoleString(validation.values.role, campaignRoles));
  const campaignMemberRoleCodename = useCampaignRoleString(validation.values.role, campaignRoles);

  const { options: campaignSupervisorOptions, label: campaignSupervisorLabel } =
    getCampaignAgentMembers(
      campaignMemberRoleCodename,
      campaignFieldAgentOptions,
      campaignDigitalAgentOptions
    );

  // Memoized value for campaignAgentCommittees
  const campaignAgentCommittees = useAgentMemberCommitteeSites(validation?.values?.supervisor, campaignMembers);
  const campaignAgentCommitteeOptions = useCommitteeOptions(campaignAgentCommittees);

  console.log("campaignAgentCommitteeOptions: ", campaignAgentCommitteeOptions)

  // Form fields
  const fields = [
    {
      id: "role-field",
      name: "role",
      label: "الرتبة",
      type: "select",
      options: filteredRoleOptions,
      condition: isCurrentUserDifferentCampaignMember,
    },
    {
      id: "supervisor-field",
      name: "supervisor",
      label: campaignSupervisorLabel,
      type: "select",
      options: campaignSupervisorOptions,
      condition: isDelegateMember,
    },
    {
      id: "committeeSites-field",
      name: "committeeSites",
      label: "Committee Sites",
      type: "selectMulti",
      options: committeeSiteOptions,
      condition: isAgentMember,
    },
    {
      id: "committee-field",
      name: "committee",
      label: "اللجنة",
      type: "selectSingle",
      options: campaignAgentCommitteeOptions,
      condition: isDelegateMember,
    },
    {
      id: "phone-field",
      name: "phone",
      label: "رقم الهاتف",
      type: "text",
    },
    {
      id: "notes-field",
      name: "notes",
      label: "ملاحضات",
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
        تعديل عضوية: {campaignMember?.name}
      </ModalHeader>
      <ModalBody className="vstack gap-3">
        <input type="hidden" id="id-field" />
        <h5>
          <strong>
            <span className="pe-2">{campaignMember?.name} - {campaignMember?.roleName}</span>
            <div className="badge bg-primary fs-12">
              الرمز:  {campaignMember?.id}
            </div>
          </strong>
        </h5>
        {fields.map(
          (field) =>
            (field.condition === undefined || field.condition) && (
              <FormFields key={field.id} field={field} validation={validation} />
            )
        )}
      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button
            color="light"
            onClick={() => {
              toggle();
            }}
            className="btn-light"
          >
            Close
          </Button>
          <Button color="success" id="add-btn" type="submit">
            Update
          </Button>
        </div>
      </ModalFooter>
    </Form>
  );
};

export default MembersUpdateModal;

