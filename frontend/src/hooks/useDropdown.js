import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook to manage dropdown functionality with outside click detection
 * @returns {Object} dropdown state and handlers
 */
const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    setIsOpen,
    toggle,
    close,
    dropdownRef
  };
};

export default useDropdown;
