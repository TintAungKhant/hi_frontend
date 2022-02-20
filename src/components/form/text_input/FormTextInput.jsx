import React, { useMemo } from "react";
import _ from "lodash";

const FormTextInput = React.memo(
  React.forwardRef(({ label, type, value, disabled, autocomplete, max, errors }, ref) => {
    return (
      <div>
        {useMemo(() => {
          return (
            <div className="flex flex-col gap-1">
              <label className="font-semibold">{label}</label>
              <input
                type={type}
                ref={ref}
                defaultValue={value}
                max={max}
                className="p-2 rounded-md border border-gray-800/40 bg-gray-800"
                disabled={disabled}
                autoComplete={autocomplete}
              />
            </div>
          );
        }, [])}

        {!_.isEmpty(errors) && (
          <div>
            {errors.map((error, index) => {
              return (
                <div className="text-red-400 text-sm" key={index}>
                  {error}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  })
);

export default FormTextInput;
