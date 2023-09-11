export const MemberRankOptions = [
  {
    id: 1,
    name: "Party",
    description: "Party",
    showTo: [],
  },
  {
    id: 2,
    name: "Candidate",
    description: "Candidate",
    showTo: [1, 10],
  },
  {
    id: 3,
    name: "Supervisor",
    description: "Supervisor",
    showTo: [1, 2, 10],
  },
  {
    id: 4,
    name: "Guarantor",
    description: "Guarantor",
    showTo: [1, 2, 3, 10],
  },
  {
    id: 5,
    name: "Attendant",
    description: "Attendant",
    showTo: [1, 2, 3, 10],
  },
  {
    id: 6,
    name: "Sorter",
    description: "Sorter",
    showTo: [1, 2, 3, 10],
  },
  // {
  //   id: 7,
  //   name: "Other",
  //   description: "Other",
  // },
  {
    id: 10,
    name: "Moderator",
    description: "Moderator",
    showTo: [1, 2, 10],
  },
];
