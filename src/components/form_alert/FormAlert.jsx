import React from "react";

function FormAlert({msg, type}) {
  return <div className={`form__alert form__alert--${type ? type : 'green'}`}>{msg}</div>;
}

export default FormAlert;
