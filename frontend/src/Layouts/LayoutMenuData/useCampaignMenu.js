// Layouts/Menus/AdminMenu.js
import { useNavigate } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";
import { campaignSelector } from 'selectors';

// Utils
import { useCampaignMenuCondition } from 'shared/hooks'

export function useCampaignMenu(setIsCurrentState, currentCampaign) {
    const history = useNavigate();
    const {
      currentCampaignMember,
      campaignRoles,
      campaignMembers,
      campaignElectionCommitteeSites,
    } = useSelector(campaignSelector);
  
    const currentCampaignMemberGroup = useCampaignMenuCondition(currentCampaignMember || {});
  
    const handleNavigation = (state, path) => {
      setIsCurrentState(state);
      history(path);
      document.body.classList.add("twocolumn-panel");
    }
  
  
  
    return [
      {
        label: "الحملة الإنتخابية",
        isCampaign: true,
        image: currentCampaign.image,
        name: currentCampaign.name,
      },
      {
        label: "الحملة الإنتخابية",
        isHeader: true,
      },
  
      // Display For Managers and Agents
      {
        id: "campaignDashboard",
        label: "الرئيسية",
        icon: "mdi mdi-account-circle",
        link: "/campaign/overview",
        click: (e) => {
          e.preventDefault();
          handleNavigation("campaignDashboard", "/campaign/overview");
        },
        condition: ["campaignManagers", "campaignAdmins", "campaignAgents"].includes(currentCampaignMemberGroup)
      },
  
      // Display For Managers and Agents
      {
        id: "campaignTeam",
        label: "فريق العمل",
        icon: "ri-honour-line",
        link: "/campaign/members",
        click: (e) => {
          e.preventDefault();
          handleNavigation("campaignDashboard", "/campaign/members");
        },
        condition: ["campaignManagers", "campaignAdmins", "campaignAgents"].includes(currentCampaignMemberGroup)
      },
  
      // Display For All
      {
        id: "campaignGuarantees",
        label: "المجاميع والضمانات",
        icon: "ri-honour-line",
        link: "/campaign/guarantees",
        click: function (e) {
          e.preventDefault();
          handleNavigation("campaignGuarantees", "/campaign/guarantees");
        },
      },
  
      // Display For Managers
      {
        id: "campaignAttendance",
        label: "الحضور",
        icon: "ri-honour-line",
        link: `/campaign/attendees`,
        click: function (e) {
          e.preventDefault();
          setIsCurrentState("campaignAttendance", "/campaign/attendees");
        },
        condition: ["campaignManagers", "campaignAdmins"].includes(currentCampaignMemberGroup)
      },
      {
        id: "campaignSorting",
        label: "الفرز",
        icon: "ri-honour-line",
        link: "/campaign/sorting",
        click: (e) => {
          e.preventDefault();
          handleNavigation("campaignSorting", "/campaign/sorting");
        }
      },
      {
        id: "campaignElectors",
        label: "البحث",
        icon: "ri-honour-line",
        link: "/campaign/electors-search",
        click: (e) => {
          e.preventDefault();
          handleNavigation("campaignElectors", "/campaign/electors-search");
        },
      },
  
  
      // Display For CampaignFieldDelegate
      {
        id: "campaignAttendance",
        label: "التحضير",
        icon: "ri-honour-line",
        link: "/campaign/electors-attendance",
        click: (e) => {
          e.preventDefault();
          handleNavigation("campaignElectors", "/campaign/electors-attendance");
        },
        condition: ["campaignDelegates"].includes(currentCampaignMemberGroup)
  
      },
      // {
      //   id: "campaignCandidates",
      //   label: "المرشحين والنتائج",
      //   icon: "ri-honour-line",
      //   link: "/campaign/candidates",
      //   click: (e) => {
      //     e.preventDefault();
      //     handleNavigation("campaignCandidates", "/campaign/candidates");
      //   }
      // },
  
      // Display For Managers
      {
        label: "الانتخابات",
        isHeader: true,
        condition: ["campaignManagers", "campaignAdmins", "campaignAgents"].includes(currentCampaignMemberGroup)
      },
  
      {
        id: "campaignCommittees",
        label: "اللجان",
        icon: "ri-honour-line",
        link: "/campaign/committees",
        click: (e) => {
          e.preventDefault();
          handleNavigation("campaignCommittees", "/campaign/committees");
        },
      condition: ["campaignManagers", "campaignAdmins"].includes(currentCampaignMemberGroup)
  
      },
      // {
      //   id: "campaignAddMember",
      //   label: "إضافة مستخدم",
      //   icon: "ri-honour-line",
      //   link: "/campaign/add-member",
      //   click: function (e) {
      //     e.preventDefault();
      //     setIsCurrentState("campaignAddMember", "/campaign/add-member");
  
      //   },
      // },
      // {
      //   id: "campaignEdit",
      //   label: "تعديل الحملة",
      //   icon: "ri-honour-line",
      //   link: `/campaign/edit-campaign`,
      //   click: function (e) {
      //     e.preventDefault();
      //     setIsCurrentState("campaignEdit", "/campaign/edit-campaign");
  
      //   },
      // },
    ];
  }