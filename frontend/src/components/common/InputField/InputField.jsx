import React from 'react'
import './InputField.css'

function InputField({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`default-input ${className}`}
      required
    />
  )
}

export default InputField