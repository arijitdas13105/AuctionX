// import React from 'react';
// import { AlertTriangle, Check, X } from 'lucide-react';

// function YesNoModal({ 
//   isOpen, 
//   setIsYesNoModalOpen, 
//   onClose, 
//   handleDelete, 
//   title = "Confirm Action", 
//   description = "Are you sure you want to proceed?" 
// }) {
 
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//         <div className="flex items-center mb-4">
//           <AlertTriangle className="w-10 h-10 text-yellow-500 mr-3" />
//           <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
//         </div>
        
//         <p className="text-gray-600 mb-6">{description}</p>
        
//         <div className="flex justify-end space-x-3">
//           <button 
//             onClick={onClose} 
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             <X className="mr-2 w-5 h-5 inline-block" /> No
//           </button>
          
//           <button 
//             onClick={handleDelete} 
//             className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
//           >
//             <Check className="mr-2 w-5 h-5 inline-block" /> Yes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default YesNoModal;

import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

function YesNoModal({ setIsYesNoModalOpen, onClose, onSuccess }) {
  const handleYesClick = () => {
    onSuccess(); // Call the delete function
    setIsYesNoModalOpen(false); // Close the modal
  };

  const handleNoClick = () => {
    onClose(); // Call the onClose function
    setIsYesNoModalOpen(false); // Close the modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-65 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Are you sure?</h2>
        <p className="text-gray-600 mb-6">
          Do you really want to perform this action? This process cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleYesClick}
            className="flex items-center justify-center bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            <FaCheck className="mr-2" /> Yes
          </button>
          <button
            onClick={handleNoClick}
            className="flex items-center justify-center bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            <FaTimes className="mr-2" /> No
          </button>
        </div>
      </div>
    </div>
  );
}

export default YesNoModal;