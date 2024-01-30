import { PhotoIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import AddQualifications from './AddQualifications'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function CandidateForm() {
    const [userSkills, setUserSkills] = useState({});
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('Contacted');
    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState('');
    const [selectedExperience, setSelectedExperience] = useState('');
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




    const handleFnameChange = (event) => {
        const selectedValue = event.target.value;
        setFname(selectedValue);

    };

    const handleLnameChange = (event) => {
        const selectedValue = event.target.value;
        setLname(selectedValue);
    };

    const handleEmailChange = (event) => {
        const selectedValue = event.target.value;
        setEmail(selectedValue);
    };

    const handlePhoneChange = (event) => {
        const selectedValue = event.target.value;
        setPhone(selectedValue);
    };

    const handleSkillsChange = (updatedSkills) => {
        setUserSkills(updatedSkills);
    };

    const handleStatusChange = (event) => {
        const selectedValue = event.target.value;
        setStatus(selectedValue);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const candidate = {
            fname,
            lname,
            email,
            phone,
            userSkills,
            qualifications,
            status,
        };
        console.log(candidate);

    };


    const handleSkillChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedSkill(selectedValue);
    };

    const handleExperienceChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedExperience(selectedValue);
    };

    const handleAddSkill = (clickedSkill) => {
        if (selectedSkill && selectedExperience) {
            setUserSkills(prevSkills => ({
                ...prevSkills,
                [selectedSkill]: selectedExperience,
            }));
            setSelectedSkill('');
            setSelectedExperience('');
            setSkills((prevSkills) =>
                prevSkills.filter((skill) => skill.skill !== selectedSkill)
            );
            // onSkillsChange(userSkills);
        }
    };


    const handleRemoveSkill = (removedSkill) => {
        const { [removedSkill]: _, ...restSkills } = userSkills;
        setUserSkills(restSkills);
        setSkills(prevSkills => [...prevSkills, { id: Date.now(), skill: removedSkill }]);
        // onSkillsChange(userSkills);
    };

    const handleSaveSkills = () => {
        console.log('User Skills:', userSkills);
        // Perform any other actions to save the user's skills
    };

    const getExperienceDotColor = (experience) => {
        if (experience === 'Less than 1 year') {
            return '#512B81';
        } else if (experience === '1-2 years') {
            return 'green';
        } else if (experience === 'Over 2 years') {
            return 'blue';
        }
        return 'black'; // Default color
    };

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

    };

    const handleRemoveQualification = (index) => {
        const updatedQualifications = qualifications.filter((_, i) => i !== index);
        setQualifications(updatedQualifications);
    };

    const handleQualificationChange = (index, field, value) => {
        // Update the specified field of the qualification at the given index
        const updatedQualifications = qualifications.map((qualification, i) =>
            i === index ? { ...qualification, [field]: value } : qualification
        );

        setQualifications(updatedQualifications);
    };

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/skills')
            .then(response => {
                const fetchedSkills = response.data.allSkills;
                if (Array.isArray(fetchedSkills)) {
                    setSkills(fetchedSkills);
                } else {
                    console.error('Skills data is not an array:', fetchedSkills);
                }
            })
            .catch(error => {
                console.error('Error fetching skills:', error);
            });
    }, []);

    return (
        <form className='m-10'>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">Add Candidate</h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                            <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                                Photo
                            </label>
                            <div className="mt-2 flex items-center gap-x-3">
                                <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                                <button
                                    type="button"
                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                First name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={handleFnameChange}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Last name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="last-name"
                                    id="last-name"
                                    autoComplete="family-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={handleLnameChange}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={handleEmailChange}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Phone
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={handlePhoneChange}
                                />
                            </div>
                        </div>

                    </div>
                </div>
                <div className="border-b border-gray-900/10 pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            {/* Add Skill Component */}
                            <div>
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Skills</h2>
                                <div className='mt-5'>
                                    <label htmlFor="skillSelect">Select Skill:</label>
                                    <select id="skillSelect" value={selectedSkill} onChange={handleSkillChange} className='className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"'>
                                        <option value="" disabled hidden>Select a skill</option>
                                        {skills.map(skill => (
                                            <option key={skill.id} value={skill.skill} onClick={() => handleAddSkill(skill.skill)}>
                                                {skill.skill}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='mt-5'>
                                    <label htmlFor="experienceSelect">Select Experience:</label>
                                    <select id="experienceSelect" value={selectedExperience} onChange={handleExperienceChange} className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                                        <option value="" disabled hidden>Select experience</option>
                                        <option value="Less than 1 year">Less than 1 year</option>
                                        <option value="1-2 years">1-2 years</option>
                                        <option value="Over 2 years">Over 2 years</option>
                                    </select>
                                </div>
                                <div className='mt-3'>
                                    <button type="button" onClick={handleAddSkill} className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                        Add Skill
                                    </button>
                                </div>
                                <div className='mt-5 flex justify-start flex-row flex-wrap'>
                                    {Object.entries(userSkills).map(([skill, experience]) => (
                                        <div key={skill} className='flex content-center justify-items-center w-min p-1 ml-1 rounded-lg' style={{ color: getExperienceDotColor(experience), border: `3px solid ${getExperienceDotColor(experience)}` }}>
                                            {skill} <span style={{ color: getExperienceDotColor(experience) }}>&nbsp;</span>
                                            <div className='flex content-center flex-wrap'>
                                                <XMarkIcon className="block h-4 w-4" aria-hidden="true" onClick={() => handleRemoveSkill(skill)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='mt-5'>
                                    <button type="button" onClick={handleSaveSkills} className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                        Save Skills
                                    </button>
                                </div>
                            </div >
                        </div>
                        <div className="sm:col-span-4">

                            {/* Add Qualification Component */}
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
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="country" className="text-base font-semibold leading-7 text-gray-900">
                                Application Status
                            </label>
                            <div className="mt-2">
                                <select
                                    id="country"
                                    name="country"
                                    autoComplete="country-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    onChange={handleStatusChange}
                                >
                                    <option>Contacted</option>
                                    <option>Interview Scheduled</option>
                                    <option>Offer Extended</option>
                                    <option>Hired</option>
                                    <option>Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                        Cancel
                    </button>
                    <button
                        // type="submit"
                        onClick={handleSubmit}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    )
}
