export const GenderCircle = ({ genderValue }) => {
  let circleColor;

  if (genderValue === 1) {
    circleColor = "info";
  } else if (genderValue === 2) {
    circleColor = "danger";
  } else {
    circleColor = "secondary";
  }

  return (
    <i className={`mdi mdi-circle align-middle text-${circleColor} me-2`}></i>
  );
};

