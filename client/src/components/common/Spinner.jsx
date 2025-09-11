import React from 'react';

const Spinner = ({ small = false }) => (
    <div className={`animate-spin rounded-full ${small ? 'h-5 w-5 border-2' : 'h-12 w-12 border-4'} border-t-transparent border-white`}></div>
);

export default Spinner;