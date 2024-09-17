import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import UserPDF from './UserPDF'; // You'll create this component next

const GET_USERS = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

const UserList = () => {
  const { loading, error, data } = useQuery(GET_USERS);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (data) {
      setUsers(data.users);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
      <PDFDownloadLink
        document={<UserPDF users={users} />}
        fileName="user_list.pdf"
      >
        {({ loading }) => (loading ? 'Preparing document...' : 'Export as PDF')}
      </PDFDownloadLink>
    </div>
  );
};

export default UserList;
