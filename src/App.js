import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient'; // Use default export directly
import UserList from './UserList';

function App() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage('');

    const formData = new FormData();
    formData.append('file', photo);

    try {
      // Upload the photo
      const uploadResponse = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const photoPath = uploadResponse.data.filePath;

      // Add address to the address book
      const addAddressResponse = await axios.post('http://localhost:4000/graphql', {
        query: `
          mutation {
            addAddressBook(
              name: "${name}",
              address: "${address}",
              email: "${email}",
              phone: "${phone}",
              photo: "${photoPath}"
            ) {
              id
              name
              address
              email
              phone
              photo
            }
          }
        `,
      });

      if (addAddressResponse.data.errors) {
        setResponseMessage('Error adding address!');
      } else {
        setResponseMessage('Address added successfully!');
        // Reset form
        setName('');
        setAddress('');
        setEmail('');
        setPhone('');
        setPhoto(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('An error occurred!');
    }
  };

  return (
    <ApolloProvider client={client}> {/* Moved ApolloProvider to wrap around the entire App */}
      <div className="container">
        <h1>Address Book</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            required
          />
          <button type="submit">Add Address</button>
        </form>
        {responseMessage && <div className="response-message">{responseMessage}</div>}

        <UserList />
      </div>
    </ApolloProvider>
  );
}

export default App;
