export const PriorityOptions = [
  {
    id: 1,
    name: "منخفض",
    value: "low",
    badgeClass: "badge bg-info",
    description: "الانتخابات ذات الأولوية المنخفضة. (منخفض)",
  },
  {
    id: 2,
    name: "متوسط",
    value: "medium",
    badgeClass: "badge bg-warning",
    description: "الانتخابات ذات الأولوية المتوسطة. (متوسط)",
  },
  {
    id: 3,
    name: "عالي",
    value: "high",
    badgeClass: "badge bg-danger",
    description: "الانتخابات ذات الأولوية العالية. (عالي)",
  },
];


export const PriorityBadge = ({ priority }) => {
  const entryPriority = PriorityOptions.find(option => option.id === priority);
  if (!entryPriority) return null;

  return (
    <div className={`badge rounded-pill ${entryPriority.badgeClass} fs-12`}>
      {entryPriority.name}
    </div>
  );
};
