const ElectorAttendanceOption = [
    {
      id: 1,
      name: "حضر",
      value: true,
      color: "success",
      badgeClass: "badge bg-success",
      borderColor: "#299cdb",
      description: "attended",
    },
    {
      id: 2,
      name: "لم يحضر",
      value: false,
      color: "danger",
      badgeClass: "badge bg-danger",
      borderColor: "#f672a7",
      description: "notAttended",
    },
  ];
  
  const getElectorAttendanceOptions = () => {
    return ElectorAttendanceOption.map(item => ({
      id: item.id,
      label: item.name,
      value: item.id
    }));
  }
  
  
  export { ElectorAttendanceOption, getElectorAttendanceOptions }