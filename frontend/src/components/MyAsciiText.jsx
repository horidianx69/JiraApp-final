// src/components/MyAsciiText.jsx
import { AsciiText } from 'react-bits';

export default function MyAsciiText() {
  return (
    <div className="p-4">
      <AsciiText
        text="Hello, MERN!"
        fontSize={24}
        color="#1D4ED8" // Tailwind blue-700 hex
        animation="fadeIn"
      />
    </div>
  );
}
