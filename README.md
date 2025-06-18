# CollabConnect  

CollabConnect is a platform that helps companies quickly find point of contact across teams using `product` or `repository names`. It streamlines collaboration by providing detailed contact information, reducing delays, and fostering efficient teamwork in a growing, distributed organization.

## Table of Contents  
- [Demo & Documentation](#demo-and-documentation) 
- [Frontend](#frontend)  
- [Backend](#backend)  
- [Getting Started](#getting-started)  
- [Features](#features) 


## Demo and Documentation

- [Documentation](https://documenter.getpostman.com/view/19308263/2sAYBPnF2Q)
- [Demo Video](https://drive.google.com/drive/folders/1rSpiJ5yflS7NoVa8KpWBDrW8AxjvjMbF?usp=sharing)


## Frontend  
The frontend of CollabConnect is built using React.  

### Repository  
[Frontend Repository](https://github.com/kparekh21/poc-contact-app)  

### Prerequisites  
- Node.js (v16.x or later)  
- npm or yarn  

### Setup  
1. Clone the repository:  
   ```bash  
   git clone <INSERT_FRONTEND_REPO_LINK>  
   cd collabconnect-frontend  
   ```  

2. Install dependencies:  
   ```bash  
   npm install  
   ```  

3. Configure environment variables:  
   - Create a `.env` file in the root directory.  
   - Add the following variables:  
     ```env  
     REACT_APP_GEMINI_API_KEY=AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxk
     REACT_APP_BASE_URL=https://example.com/api/ 
     ```  

4. Start the development server:  
   ```bash  
   npm start  
   ```  

5. Access the application at `http://localhost:3000`.  

## Backend  
The backend of CollabConnect is built using Node.js.  

### Repository  
[Backend Repository](https://github.com/nisarg0606/CollabConnect)  

### Prerequisites  
- Node.js (v16.x or later)  
- npm  

### Setup  
1. Clone the repository:  
   ```bash  
   git clone <INSERT_BACKEND_REPO_LINK>  
   cd collabconnect-backend  
   ```  

2. Install dependencies:  
   ```bash  
   npm install  
   ```  

3. Configure environment variables:  
   - Create a `.env` file in the root directory.  
   - Add the following variables:  
     ```env  
     DATABASE_URL=postgresql://postgres.xxxxxxxxxxxxxx/postgres
     JWT_SECRET=xxxxx
     ```  

4. Run the backend server:  
   ```bash  
   npm start  
   ```  

5. The API will be available at `http://localhost:5000`.  

## Getting Started  

### Running the Application Locally  
1. Follow the setup instructions for both the frontend and backend.  
2. Ensure the backend is running before starting the frontend.  
3. Navigate to `http://localhost:3000` in your browser to use the application.  

### API Usage  
The API supports querying points of contact using:  
- **Product Name**  
- **Repository Name**  

#### Example Response:  
```json  
[
  {
    "employee_id": 7,
    "first_name": "Grace",
    "last_name": "Martinez",
    "chat_username": "grace.martinez",
    "title": "Sales Director - Europe",
    "phone": "01-555-2678",
    "email_id": "grace.martinez@servicenow.com",
    "description": "Leads sales for Europe region.",
    "is_team_lead": true,
    "is_poc": true,
    "team_id": 3,
    "team_name": "Customer Success",
    "team_desc": "Focuses on driving customer satisfaction and success.",
    "location_id": 1,
    "country": "US",
    "state": "California",
    "city": "Santa Clara",
    "zipcode": "95054",
    "repository_id": 3,
    "repository_name": "UI Framework",
    "created_date": "2024-09-10T00:00:00.000Z",
    "product_id": 1,
    "product_name": "ServiceNow Platform",
    "product_description": "A comprehensive suite of enterprise IT service management solutions that enable businesses to automate and streamline workflows."
  }
]
```  

#### Error Handling  
Invalid queries will return a structured error response:  
```json  
{
  "message": "No repository or product found"
} 
```  

## Features  

- **Search for Points of Contact (POC):**  
  Users can easily search for a point of contact using either the `product_name` or `repository_name`.  

- **AI-Powered Assistance:**  
  The platform includes an interactive AI Agent to help users find the right POC efficiently, making searches intuitive and conversational.  

- **POC Availability Check:**  
  Users can view the availability status of the POC, ensuring that they connect at the right time for seamless collaboration.  

- **Detailed Contact Information:**  
  Each POC includes comprehensive details such as name, email, chat username, phone number, title, team information, and location.  

- **Streamlined Collaboration:**  
  Designed to enhance productivity by reducing delays and improving communication across distributed teams.  


## Contributing  
Contributions are welcome! Please fork the repositories and submit a pull request with your changes.  
