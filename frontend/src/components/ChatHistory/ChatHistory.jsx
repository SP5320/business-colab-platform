
import React from 'react';

const ChatHistory = ({ history }) => {
  return (
    <div className="chat-history">
      <h2>Chat History</h2>
      {history.map((contact, index) => (
        <div key={index} className="chat-item">
          <p>{contact.firstName} {contact.lastName}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
