import React from 'react'
import './Button.css'

function Button({ text, onClick, type = 'button', className = '', icon }) {
  return (
    <button
      type={type}
      className={`default-button ${className}`}
      onClick={onClick}
    >
      {icon}  {text}
    </button>
  )
}

export default Button