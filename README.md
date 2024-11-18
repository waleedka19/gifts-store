# Gifts Store 🎁

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Future Improvements](#future-improvements)
- [Contact](#contact)

---

## Overview

Gifts Store is a web application designed for a seamless gift-shopping experience. It allows users to explore products, manage their cart, and purchase gifts online. Additionally, users can request custom gifts, and admins can manage the store efficiently with role-based access control.

---

## Features

- **User Registration**: Upon signing up, users receive a welcome email automatically (powered by MailerSend).
- **Role-Based Access**:
  - **Admin Role**:
    - Add and delete products.
    - View user gift requests and contact them via email.
  - **User Role**:
    - Browse available products.
    - Add products to the cart.
    - Purchase gifts online (powered by Stripe).
    - Submit requests for custom gifts.
- **Secure Transactions**: Online payments are handled using Stripe integration.
- **Gift Requests**: Users can request specific gifts with details.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose for MVC architecture)
- **Frontend**: EJS templates
- **Email Service**: MailerSend
- **Payment Gateway**: Stripe

---

## Installation

### Clone the Repository:

```bash
git clone https://github.com/yourusername/gifts-store.git
```

Create a .env File:
Add the following variables with your own values:

```bash
TABASE_URL=<your-mongodb-connection-string>
STRIPE_PRIVATE_KEY=<your-stripe-private-key>
STRIPE_PUBLIC_KEY=<your-stripe-public-key>
MAILERSEND_API_KEY=<your-mailersend-api-key>
SESSION_SECRET=<your-session-secret>
```

Install Dependencies:

Run the following command in the project directory to install required Node.js modules:

```bash

npm install
```

Start the Project:

Start the server:

```bash

npm start
```

## Usage

Navigate to the project directory.

Ensure the .env file is correctly set up.

Start the project using npm start.

Open your browser and go to http://localhost:3000 (or the specified port) to access the application.

## Future Improvements

Add support for editing and deleting user accounts.

Implement real-time notifications for admins on new gift requests.

Add an option for users to upload images for custom gift requests.

Enhance admin dashboard with analytics and sales reports.

## Contact

Author: Waleed karkosh

Email: waliedka@gmail.com

GitHub: github.com/waleedka19
