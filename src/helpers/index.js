import _ from "lodash";

const disableRefs = (refs) => {
  _.each(refs, function (ref) {
    if (ref.current) {
      ref.current.disabled = true;
    }
  });
};

const enableRefs = (refs) => {
  _.each(refs, function (ref) {
    if (ref.current) {
      ref.current.disabled = false;
    }
  });
};

const greeting = () => {
  let date = new Date();
  let hrs = date.getHours();

  let greet;

  if (hrs < 12)
    greet = 'Good Morning';
  else if (hrs >= 12 && hrs <= 17)
    greet = 'Good Afternoon';
  else if (hrs >= 17 && hrs <= 24)
    greet = 'Good Evening';

  return greet;
}

export {
  disableRefs,
  enableRefs,
  greeting
};