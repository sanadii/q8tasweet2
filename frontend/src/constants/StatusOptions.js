export const StatusOptions = [
  {
    id: 1,
    name: "جديد",
    value: "new",
    badgeClass: "badge bg-info",
    description: "منشور جديد في انتظار مزيد من الإجراءات.",
    role: "Admin, Moderator",
  },
  {
    id: 2,
    name: "جاري العمل عليه",
    value: "onGoing",
    badgeClass: "badge bg-warning",
    description: "يتم العمل حاليًا على المنشور.",
    role: "Admin, Moderator",
  },
  {
    id: 3,
    name: "يفتقد للبيانات",
    value: "missingData",
    badgeClass: "badge bg-primary",
    description: "المنشور غير مكتمل ويفتقد لبيانات أساسية.",
    role: "Moderator",
  },
  {
    id: 4,
    name: "في أنتظار الموافقة ",
    value: "pendingApproval",
    badgeClass: "badge bg-danger",
    description: "المنشور مكتمل وفي انتظار الموافقة قبل النشر.",
    role: "Moderator",
  },
  {
    id: 5,
    name: "خاص",
    value: "private",
    badgeClass: "badge bg-primary",
    description: "المنشور يمكن مشاهدته بواسطة الإدارة فقط.",
    role: "Admin",
  },
  {
    id: 6,
    name: "منشور",
    value: "published",
    badgeClass: "badge bg-success",
    description: "تمت الموافقة على المنشور ويمكن للجميع مشاهدته.",
    role: "Admin",
  },
  {
    id: 9,
    name: "محذوف",
    value: "deleted",
    badgeClass: "badge bg-dark",
    description: "المنشور في سلة المحذوفات ولا يمكن مشاهدته للعامة.",
    role: "Admin, Moderator",
  },
];


export const StatusBadge = ({ status }) => {
  const entryStatus = StatusOptions.find(option => option.id === status);
  if (!entryStatus) return null;

  return (
    <div className={`badge rounded-pill ${entryStatus.badgeClass} fs-12`}>
      {entryStatus.name}
    </div>
  );
};

// switch (status) {
//   case 1:
//     statusName = "Published";
//     badgeClass = "badge-soft-success";
//     break;
//   case 2:
//     statusName = "Private";
//     badgeClass = "badge-soft-secondary";
//     break;
//   case 3:
//     statusName = "Pending Approval";
//     badgeClass = "badge-soft-warning";
//     break;
//   case 4:
//     statusName = "Missing Data";
//     badgeClass = "badge-soft-warning";
//     break;
//   case 5:
//     statusName = "Inprogress";
//     statusName = "Inprogress";
//     break;
//   case 6:
//     statusName = "New";
//     badgeClass = "badge-soft-info";
//     break;
//   case 9:
//     statusName = "Deleted";
//     badgeClass = "badge-soft-secondary";
//     break;
//   default:
//     statusName = "Unknown";
//     badgeClass = "badge-soft-primary";
//     break;
// }