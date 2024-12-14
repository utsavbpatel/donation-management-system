# Donation Management System

The **Donation Management System** is a web application built using **React**, **PHP**, and **MySQL** to help organizations or individuals manage donations effectively. The system provides functionalities such as user authentication, category management, donation tracking, and reporting.

## Features

### 1. Signup and Signin
- Users can register and log in to the system.
- Authentication is done using an email and password.

### 2. My Account
- Users can update their account details, including:
  - Organization Name
  - Mobile Number
  - Email ID
  - Address

### 3. Categories
- Users can:
  - Add donation categories (e.g., Education, Health, Disaster Relief, etc.).
  - View donation categories in a tabular format.

### 4. Add Donation
- Users can:
  - Add donation details, including:
    - Donor Name
    - Mobile Number
    - Email ID
    - Donation Category
    - Donation Amount
    - Date and Time (automatically captured).
  - View all donations in a table and apply filters based on:
    - Receipt Number
    - Donation Category
    - Time Period.
  - User can download:
    - Receipt in PDF
    - Report in PDF

### 5. Dashboard
- Users can view summarized data such as:
  - Total Donations
  - Donations categorized by category.

## Technologies Used
- **Frontend**: React.js
- **Backend**: PHP
- **Database**: MySQL

## Installation and Setup
To run this project locally, follow these steps:

### Prerequisites
- Node.js installed on your system
- XAMPP or any PHP development environment
- MySQL database setup

## Setup Process

Follow the steps below to set up and run the **Donation Management System** on your local machine:

1. **Download and Extract Files**:
   - Go to the [GitHub repository](https://github.com/utsavbpatel/donation-management-system).
   - Click on the **Code** button and select **Download ZIP**.
   - Extract the downloaded ZIP file to your desired location.

2. **Frontend Setup**:
   - Open the `frontend` directory in your code editor (e.g., VS Code).
   - Start the React development server:
     ```bash
     npm run dev
     ```

3. **Backend Setup**:
   - Place the `backend` directory inside the `htdocs` folder of your XAMPP setup.
   - Start the PHP server by launching Apache and MySQL services in XAMPP.

4. **Update Base API URL**:
   - In the `frontend` directory, locate the `.env` file.
   - Replace the `VITE_BASE_API_URL` with the appropriate URL pointing to your backend server (e.g., `http://localhost/backend`).

5. **Database Setup**:
   - Open phpMyAdmin and create a new database (e.g., `donation_db`).
   - Import the provided `.sql` file located in the `database` directory to create the necessary tables.

6. **Configure Database Credentials**:
   - In the `backend` directory, locate the `.env` file.
   - Replace the placeholders for database credentials (e.g., DB_NAME, DB_USER, DB_PASS) with your local database details.

7. **Run the Application**:
   - Open your browser and navigate to the frontend server (e.g., `http://localhost:3000`).
   - The website is now ready to use!

---

## Features Demonstration

### 1. Signup and Signin
![Signup Page](./images/signup.jpg "Signup Page")
![Signin Page](./images/signin.jpg "Signup Page")

### 2. Dashboard
![Dashboard_Page](./images/dashboard.jpg "Dashboard Overview")

### 3. Categories
![Categories_Page](./images/categories.jpg "Categories_Page")

### 4. Add Donation
![Add_Donation_1](./images/adddonation1.jpg "Add_Donation_1")
![Add_Donation_2](./images/adddonation2.jpg "Add_Donation_2")

### 5. My Account
![My_Account](./images/myaccount.jpg "My_Account")

### 6. Download Receipt and Report
![Receipt](./images/printreceipt.jpg "Receipt")
![Report](./images/printreport.jpg "Report")

## Contact

For any queries or feedback, feel free to contact:
  - Email : contact.utsavbpatel@gmail.com
  - GitHub : [utsavbpatel](https://github.com/utsavbpatel)

