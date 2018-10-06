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

  return (
    <div className={'value'}>
      <label>{props.label}</label>
      {
        (value === undefined || value === null) ? (
          <input type="number" onChange={(event) => props.onChange(event.target.value)} min={min} max={max}/>
        ) : (
          <span>{value}</span>
        )
      }
    </div>
  );
}
