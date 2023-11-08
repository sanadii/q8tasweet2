export const ElectionTypeOptions = [
  {
    id: 1,
    name: "مرشحين فقط",
    value: "مرشحين فقط",
    badgeClass: "badge bg-info",
  },
  {
    id: 2,
    name: "قوائم فقط",
    value: "قوائم فقط",
    badgeClass: "badge bg-danger",

  },
  {
    id: 3,
    name: "قوائم ومرشحين",
    value: "قوائم ومرشحين",
    badgeClass: "badge bg-danger",

  },
];

export const ElectionTypeBadge = ({ electType }) => {
  const entryItem = ElectionTypeOptions.find(option => option.id === electType);
  if (!entryItem) return null;

  return (
    <div className={`badge ${entryItem.badgeClass} fs-12`}>
      {entryItem.name}
    </div>
  );
};