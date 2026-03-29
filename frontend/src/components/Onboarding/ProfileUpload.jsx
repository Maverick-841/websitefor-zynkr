import React, { useState } from 'react';
import { RiCameraFill } from '@remixicon/react';

export const ProfileUpload = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative group mb-4">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-blue-50 flex flex-col items-center justify-center relative">
          {imagePreview ? (
            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <RiCameraFill className="text-blue-300 w-10 h-10 mb-1" />
          )}
          
          <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <RiCameraFill className="text-white w-8 h-8" />
            <span className="text-white text-xs font-medium mt-1">Upload</span>
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleImageChange}
            title="Upload profile photo"
          />
        </div>
      </div>
      <label className="text-sm font-semibold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors">
        Add Photo
        <input 
          type="file" 
          accept="image/*" 
          className="hidden"
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
};
