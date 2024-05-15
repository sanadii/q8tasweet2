export const ElectionMethodOptions = [
  {
    id: '1',
    name: "مرشحين فقط",
    value: "candidateOnly",
    badgeClass: "badge bg-info",
  },
  {
    id: '2',
    name: "قوائم - قوائم فقط",
    value: "partyOnly",
    badgeClass: "badge bg-danger",
  },
  {
    id: '3',
    name: "قوائم - مرشحين فقط",
    value: "partyCandidateOnly",
    badgeClass: "badge bg-danger",
  },
  {
    id: '4',
    name: "قوائم - قوائم ومرشحين",
    value: "partyCandidateCombined",
    badgeClass: "badge bg-warning",
  },
  {
    id: '5',
    name: "قوائم - قوائم ومرشحين",
    value: "mixedVoteralSystem",
    badgeClass: "badge bg-warning",
  },
];

export const ElectionResultOptions = [
  {
    id: 1,
    name: "عرض نتائج المرشحين فقط",
    value: "candidateOnly",
  },
  {
    id: 2,
    name: "عرض نتائج القوائم فقط",
    value: "partyOnly",
  },
  {
    id: 3,
    name: "عرض نتائج القوائم والمرشحين",
    value: "partyCandidateCombined",
  },
];


export const ElectionSortingResultOptions = [
  {
    id: 1,
    name: "عرض نتائج الفرز",
    value: true,
  },
  {
    id: 2,
    name: "عرض النتائج النهائية",
    value: false,
  },
];


export const ElectionDetailedResultOptions = [
  {
    id: 1,
    name: "النتيجة الإجمالية",
    value: false,
  },
  {
    id: 2,
    name: "النتائج التفصيلية",
    value: true,
  },
];


export const electionMethodBadge = ({ electionMethod }) => {
  const entryItem = ElectionMethodOptions.find(option => option.id === electionMethod);
  if (!entryItem) return null;

  return (
    <div className={`badge ${entryItem.badgeClass} fs-12`}>
      {entryItem.name}
    </div>
  );
};