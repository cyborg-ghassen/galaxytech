import React from 'react';
import PropTypes from 'prop-types';
const FormErrors = ({ error, errors, index }) => {
    return (
        <div>
            {errors?.map((err, i) => {
                if (typeof err === 'string') {
                    // err is a string, just display the string
                    return (
                        <p key={i} style={{ color: 'red', fontSize: '15px' }}>{err}</p>
                    );
                } else if (
                    typeof err === 'object' &&
                    error in err &&
                    index === i
                ) {
                    // err is a dictionary and contains the passed in field
                    return (
                        <p key={i} style={{ color: 'red', fontSize: '15px' }}>
                            {err[error]}
                        </p>
                    );
                }
                return null;
            })}
        </div>
    );
};

FormErrors.propTypes = {
    error: PropTypes.string,
    errors: PropTypes.object,
    index: PropTypes.number
};

export default FormErrors;
