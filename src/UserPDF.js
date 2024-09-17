// src/UserPDF.js
import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';

const UserPDF = ({ users }) => (
  <Document>
    <Page size="A4">
      <View>
        <Text>User List</Text>
        {users.map(user => (
          <Text key={user.id}>
            {user.name} - {user.email}
          </Text>
        ))}
      </View>
    </Page>
  </Document>
);

export default UserPDF;
