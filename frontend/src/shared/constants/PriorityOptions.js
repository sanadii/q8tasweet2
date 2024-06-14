export const PriorityOptions = [
  {
    id: 1,
    name: "منخفض",
    value: "low",
    badgeClass: "badge bg-info",
<<<<<<< HEAD
=======
    color: "bg-info",
>>>>>>> sanad
    description: "الانتخابات ذات الأولوية المنخفضة. (منخفض)",
  },
  {
    id: 2,
    name: "متوسط",
    value: "medium",
<<<<<<< HEAD
=======
    color: "bg-warning",
>>>>>>> sanad
    badgeClass: "badge bg-warning",
    description: "الانتخابات ذات الأولوية المتوسطة. (متوسط)",
  },
  {
    id: 3,
    name: "عالي",
    value: "high",
<<<<<<< HEAD
=======
    color: "bg-danger",
>>>>>>> sanad
    badgeClass: "badge bg-danger",
    description: "الانتخابات ذات الأولوية العالية. (عالي)",
  },
];


export const PriorityBadge = ({ priority }) => {
  const entryPriority = PriorityOptions.find(option => option.id === priority);
  if (!entryPriority) return null;

  return (
<<<<<<< HEAD
    <div className={`badge rounded-pill ${entryPriority.badgeClass} fs-12`}>
      {entryPriority.name}
    </div>
=======
    <badge className={`${entryPriority.badgeClass} fs-12`}>
      {entryPriority.name}
    </badge>
>>>>>>> sanad
  );
};
