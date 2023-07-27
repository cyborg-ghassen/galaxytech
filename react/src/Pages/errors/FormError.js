import React from 'react';
import PropTypes from 'prop-types';
const FormError = ({ error }) => {
    return (
        <div>
            {error && <p style={{ color: 'red', fontSize: '15px' }}>{error}</p>}
        </div>
    );
};

FormError.propTypes = {
    error: PropTypes.string
};

export default FormError;
