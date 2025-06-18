import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContactSearchForm from '../components/ContactSearchForm/ContactSearchForm';
import ContactCard from '../components/ContactCard/ContactCard';
import Chatbot from '../components/Chatbot/Chatbot';
import './Home.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Home = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [repoFilter, setRepoFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Helper function to fetch timezone for a given latitude and longitude
const getTimezoneForLocation = async (zipCode, countryCode) => {
    const username = 'kode'; // Your GeoNames username
    try {
      // Step 1: Get coordinates from postal code
      const postalCodeUrl = `http://api.geonames.org/postalCodeSearchJSON?postalcode=${zipCode}&country=${countryCode}&maxRows=1&username=${username}`;
      const postalResponse = await axios.get(postalCodeUrl);
      const postalData = postalResponse.data.postalCodes?.[0];
  
      if (postalData) {
        const { lat, lng } = postalData;
  
        // Step 2: Get timezone data using the coordinates
        const timezoneUrl = `http://api.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=${username}`;
        const timezoneResponse = await axios.get(timezoneUrl);
        return timezoneResponse.data.time;
      }
    } catch (error) {
      console.error("Error fetching timezone data:", error);
    }
    return null;
  };
  
  const fetchContacts = async (searchOption, searchText) => {
    try {
      const token = localStorage.getItem('token');
      let url = `${BASE_URL}`;
      if (searchOption === 'product') {
        url += `/product/${searchText}`;
      } else if (searchOption === 'repository') {
        url += `/repository/${searchText}`;
      } else {
        url += `/${searchText}`;
      }
  
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      let data = [];
      if (searchOption === 'product') {
        data = response.data['Product details'];
      } else if (searchOption === 'repository') {
        data = response.data['Repository details'];
      }
  
      // Map API response to frontend required fields, including timezone
      const mappedData = await Promise.all(
        data.map(async contact => {
          const timezone = await getTimezoneForLocation(contact.zipcode, contact.country);
          console.log(timezone)
          return {
            firstName: contact.first_name,
            lastName: contact.last_name,
            email: contact.email_id,
            location: `${contact.city}, ${contact.state}`,
            title: contact.title,
            productName: contact.product_name,
            repoName: contact.repository_name,
            chat_username: contact.chat_username,
            timezone: timezone, // Adding timezone data
          };
        })
      );
  
      setContacts(mappedData);
      setFilteredContacts(mappedData);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };
  

  // Handle search from ContactSearchForm
  const handleSearch = (filters) => {
    const { productName, repoName } = filters;
    if (productName) {
      fetchContacts('product', productName);
    } else if (repoName) {
      fetchContacts('repository', repoName);
    }
  };

  // Filter contacts based on dropdown selections
  useEffect(() => {
    const filtered = contacts.filter(contact =>
      (!locationFilter || contact.location === locationFilter) &&
      (!repoFilter || contact.repoName === repoFilter) &&
      (!productFilter || contact.productName === productFilter)
    );
    setFilteredContacts(filtered);
    setCurrentIndex(0);
  }, [locationFilter, repoFilter, productFilter, contacts]);

  // Extract unique values for dropdown filters
  const uniqueLocations = [...new Set(contacts.map(contact => contact.location))];
  const uniqueRepoNames = [...new Set(contacts.map(contact => contact.repoName))];
  const uniqueProductNames = [...new Set(contacts.map(contact => contact.productName))];

  // Navigation for the carousel
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < filteredContacts.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : filteredContacts.length - 1
    );
  };

  return (
    <div className="main-content relative min-h-screen px-4 sm:px-8 lg:px-16 pt-20">
      <ContactSearchForm onSearch={handleSearch} />

      {contacts.length > 0 && (
        <div className="mt-4 w-full max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="p-2 border border-gray-600 bg-gray-800 text-white rounded w-full sm:w-auto"
            >
              <option value="">Filter by Location</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select
              value={repoFilter}
              onChange={(e) => setRepoFilter(e.target.value)}
              className="p-2 border border-gray-600 bg-gray-800 text-white rounded w-full sm:w-auto"
            >
              <option value="">Filter by Repo Name</option>
              {uniqueRepoNames.map(repo => (
                <option key={repo} value={repo}>{repo}</option>
              ))}
            </select>

            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="p-2 border border-gray-600 bg-gray-800 text-white rounded w-full sm:w-auto"
            >
              <option value="">Filter by Product Name</option>
              {uniqueProductNames.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>

          <div className="relative flex items-center justify-center p-4">
            {filteredContacts.length > 0 && (
              <ContactCard contact={filteredContacts[currentIndex]} />
            )}

            {filteredContacts.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 p-2 bg-gray-800 text-white rounded-full text-xl"
                >
                  &#8592;
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 p-2 bg-gray-800 text-white rounded-full text-xl"
                >
                  &#8594;
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatbotOpen && (
          <div className="absolute bottom-16 right-0 w-96 h-[500px] rounded-lg shadow-xl overflow-hidden">
            <div className="text-white p-4 flex justify-between items-center" style={{ backgroundColor: '#00d1b2' }}>  
              <h3 className="text-lg font-semibold">Chat Assistant</h3>
              <button 
                onClick={() => setIsChatbotOpen(false)}
                className="text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <div className="h-[calc(100%-64px)]">
              <Chatbot />
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          className="w-14 h-14 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ backgroundColor: '#00d1b2' }}
        >
          <svg 
            className="w-6 h-6"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Home;
