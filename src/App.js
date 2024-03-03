import React, { useState } from 'react';
import './App.css';

function App() {
  const [pincode, setPincode] = useState('');
  const [pincodeDetails, setPincodeDetails] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [error, setError] = useState('');
  const [lookupClicked, setLookupClicked] = useState(false);

  const fetchPincodeDetails = () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError('Pincode must be 6 digits');
      setPincodeDetails([]);
      return;
    }

    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then(response => response.json())
      .then(data => {
        if (data[0].Status === 'Error') {
          setError(data[0].Message);
          setPincodeDetails([]);
        } else {
          setError('');
          setPincodeDetails(data[0].PostOffice);
          setLookupClicked(true); // Set lookup clicked to true after fetching data
        }
      })
      .catch(error => {
        setError('Something went wrong. Please try again later.');
        setPincodeDetails([]);
      });
  };

  const filterResults = () => {
    return pincodeDetails.filter(postOffice =>
      postOffice.Name.toLowerCase().includes(filterText.toLowerCase())
    );
  };

  return (
    <div className="container">
      {!lookupClicked && (
        <div>
          <h1>Enter Pincode</h1>
          <div className="form">
            <input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={e => setPincode(e.target.value)}
            />
            <button className='lookup-button' onClick={fetchPincodeDetails}>Lookup</button>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
      )}
      {lookupClicked && (
        <div>
          <div className="details">
            
          </div>
          <input
            type="text"
            placeholder="Filter by Post Office Name"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
          <div className="filtered-results">
            {filterResults().length === 0 && <div>Couldn't find the postal data you’re looking for…</div>}
            {filterResults().map(postOffice => (
              <div className="card" key={postOffice.Name}>
                <p><strong>Post Office Name:</strong> {postOffice.Name}</p>
                <p><strong>Branch Type:</strong> {postOffice.BranchType}</p>
                <p><strong>District:</strong> {postOffice.District}</p>
                <p><strong>State:</strong> {postOffice.State}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
