export const GuaranteeStatusOptions = [
  {
    id: 1,
    name: "جديد",
    value: "New",
    role: "Admin, Moderator",
    badgeClass: "badge bg-info",
    bgClass: "bg-soft-info",
  },
  {
    id: 2,
    name: "تم الاتصال",
    value: "Contacted",
    role: "Admin, Moderator",
    badgeClass: "badge bg-warning",
    bgClass: "bg-soft-warning",

  },
  {
    id: 3,
    name: "مؤكد",
    value: "Confirmed",
    role: "Moderator",
    badgeClass: "badge bg-success",
    bgClass: "bg-soft-success",

  },
  {
    id: 4,
    name: "غير مؤكد",
    value: "Not Confirmed",
    role: "Moderator",
    badgeClass: "badge bg-danger",
    bgClass: "bg-soft-danger",

  },
];

export const STATUS_MAP = GuaranteeStatusOptions.reduce((accumulator, currentValue) => {
  accumulator[currentValue.value] = currentValue.id;
  return accumulator;
}, {});