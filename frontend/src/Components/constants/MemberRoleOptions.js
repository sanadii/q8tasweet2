export const MemberRoleOptions = [
  {
    id: 1,
    name: "Party",
    description: "Party",
    TabsToShow: [],
  },
  {
    id: 2,
    name: "Candidate",
    description: "Candidate",
    TabsToShow: [1, 10],
  },
  {
    id: 3,
    name: "Supervisor",
    description: "Supervisor",
    TabsToShow: [1, 2, 10],
  },
  {
    id: 4,
    name: "Guarantor",
    description: "Guarantor",
    TabsToShow: [1, 2, 3, 10],
  },
  {
    id: 5,
    name: "Attendant",
    description: "Attendant",
    TabsToShow: [1, 2, 3, 10],
  },
  {
    id: 6,
    name: "Sorter",
    description: "Sorter",
    TabsToShow: [1, 2, 3, 10],
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
    TabsToShow: [1, 2, 10],
  },
];
