import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddQualifications = ({ onQualificationsChange }) => {
  const [qualificationTitles, setQualificationTitles] = useState([]);
  const [qualifications, setQualifications] = useState([]);

  useEffect(() => {
    // Fetch qualification titles from API
    axios.get('http://127.0.0.1:5000/api/qualifications')
      .then(response => {
        const fetchedTitles = response.data.allQualifications;
        if (Array.isArray(fetchedTitles)) {
          setQualificationTitles(fetchedTitles.map(item => item.qualification));
        } else {
          console.error('Qualification titles data is not an array:', fetchedTitles);
        }
      })
      .catch(error => {
        console.error('Error fetching qualification titles:', error);
      });
  }, []);

  const handleAddQualification = () => {
    // Create a new qualification object with default values
    const newQualification = {
      title: '',
      specialization: '',
      college: '',
      cgpaPercentage: '',
      yearOfPassing: '',
    };

    // Add the new qualification to the list
    setQualifications(prevQualifications => [...prevQualifications, newQualification]);
    onQualificationsChange([...qualifications, newQualification]);
};

  const handleRemoveQualification = (index) => {
    const updatedQualifications = qualifications.filter((_, i) => i !== index);
    setQualifications(updatedQualifications);
    onQualificationsChange(updatedQualifications);
  };

  const handleQualificationChange = (index, field, value) => {
    // Update the specified field of the qualification at the given index
    const updatedQualifications = qualifications.map((qualification, i) =>
      i === index ? { ...qualification, [field]: value } : qualification
    );

    setQualifications(updatedQualifications);
    onQualificationsChange(updatedQualifications);
  };

  return (
    <div>
      <h2 className="text-base font-semibold leading-7 text-gray-900">Qualifications</h2>
      <div className='mt-5'>
        {qualifications.map((qualification, index) => (
          <div key={index} className='mt-5 border-b border-gray-900/10 pb-5'>
            <h3 className="text-base font-semibold leading-7 text-gray-900">Qualification {index + 1}</h3>
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor={`title${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                  Qualification Title
                </label>
                <div className="mt-2">
                  <select
                    id={`title${index}`}
                    name={`title${index}`}
                    value={qualification.title}
                    onChange={(e) => handleQualificationChange(index, 'title', e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden>Select a qualification</option>
                    {qualificationTitles.map(title => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor={`specialization${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                  Specialization
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id={`specialization${index}`}
                    name={`specialization${index}`}
                    value={qualification.specialization}
                    onChange={(e) => handleQualificationChange(index, 'specialization', e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={`college${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                  College/School Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id={`college${index}`}
                    name={`college${index}`}
                    value={qualification.college}
                    onChange={(e) => handleQualificationChange(index, 'college', e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor={`cgpaPercentage${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                  CGPA/Percentage
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id={`cgpaPercentage${index}`}
                    name={`cgpaPercentage${index}`}
                    value={qualification.cgpaPercentage}
                    onChange={(e) => handleQualificationChange(index, 'cgpaPercentage', e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={`yearOfPassing${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                  Year of Passing
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    id={`yearOfPassing${index}`}
                    name={`yearOfPassing${index}`}
                    value={qualification.yearOfPassing}
                    onChange={(e) => handleQualificationChange(index, 'yearOfPassing', e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              <div className="sm:col-span-1 self-end">
                <button
                  type="button"
                  onClick={() => handleRemoveQualification(index)}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-start gap-x-6">
        <button type="button" onClick={handleAddQualification} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Add Qualification
        </button>
        {/* Add a "Save Qualifications" button if needed */}
      </div>
    </div>
  );
};

export default AddQualifications;
