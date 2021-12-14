import React from 'react'

function ValidationError({errors}) {
  return errors ? (
    <span className="form__input--error">{errors[0]}</span>
  ) : (
    <></>
  );
}

export default ValidationError
