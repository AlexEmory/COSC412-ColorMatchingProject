import React from 'react';
import './value.css';

export default function Value(props) {
  const {
    label,
    value,
    min,
    max,
    onChange,
  } = props;

  if (onChange && value) {
    console.warn('change handler provided to readonly Value. Handler will not be used.');
  }

  function handleChange(event) {
    const value = parseInt(event.target.value);
    props.onChange(value);
  };
  
  return (
    <div className={'value'}>
      <label>{props.label}</label>
      {
        (value === undefined || value === null) ? (
          <input type="number" onChange={handleChange} min={min} max={max}/>
        ) : (
          <span>{value}</span>
        )
      }
    </div>
  );
}
