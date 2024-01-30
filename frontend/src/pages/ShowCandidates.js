import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar';
import DisplayCandidate from '../components/DisplayCandidate';

const ShowCandidates = () => {

  const [candidates, setCandidates] = useState([]);
  useEffect(() => {
    // Fetch candidates from your API
    axios.get('http://127.0.0.1:5000/api/candidates')
      .then(response => {
        console.log('API response:', response.data);
        setCandidates(response.data.allCandidate);
      })
      .catch(error => {
        console.error('Error fetching candidates:', error);
      });
  }, []);

  return (
    <div>
      <Navbar />
      
      {candidates.map(candidate => (
        <DisplayCandidate key={candidate.id} {...candidate} />
      ))}
    </div>
  )
}

export default ShowCandidates;