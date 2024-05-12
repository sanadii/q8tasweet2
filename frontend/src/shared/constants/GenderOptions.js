const GenderOptions = [
  {
    id: 1,
    name: "ذكر",
    pleural: "ذكور",
    color: "info",
    borderColor: "#299cdb",
    description: "male",
  },
  {
    id: 2,
    name: "أنثى",
    pleural: "إناث",
    color: "pink",
    borderColor: "#f672a7",
    description: "female",
  },
];

const getGenderOptions = () => {
  return GenderOptions.map(item => ({
    id: item.id,
    label: item.name,
    value: item.id
  }));
}


export { GenderOptions, getGenderOptions }