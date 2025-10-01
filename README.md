# forbes-burton-ai-system

Next-generation CRM frontend for Forbes Burton, leveraging Zoho CRM integration and AI-powered workflow automation.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Zoho CRM OAuth Setup](#zoho-crm-oauth-setup)
- [Environment Configuration](#environment-configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)

## Overview

This project provides a modern, AI-powered CRM frontend designed specifically for Forbes Burton. It integrates seamlessly with Zoho CRM to provide enhanced workflow automation, intelligent data analysis, and streamlined customer relationship management.

## Features

- 🔐 **Zoho CRM Integration**: Full OAuth 2.0 authentication with Zoho CRM
- 📊 **Lead Management**: Fetch, search, and manage leads from Zoho CRM
- 🤖 **AI-Powered Automation**: Intelligent workflow suggestions and automation
- 📱 **Responsive Design**: Modern, mobile-friendly interface
- 🔄 **Real-time Sync**: Keep data synchronized with Zoho CRM

## Prerequisites

Before setting up this project, ensure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- A Zoho CRM account with API access
- Zoho API Console credentials (Client ID, Client Secret)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RianPatelVeda/forbes-burton-ai-system.git
   cd forbes-burton-ai-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables** (see [Environment Configuration](#environment-configuration) below)

## Zoho CRM OAuth Setup

To connect this application with Zoho CRM, you need to set up OAuth credentials. Follow these steps:

### Step 1: Register Your Application in Zoho API Console

1. Visit the [Zoho API Console](https://api-console.zoho.com/)
2. Sign in with your Zoho account
3. Click **"Add Client"** or **"Create a New Client"**
4. Choose **"Server-based Applications"** as the client type
5. Fill in the following details:
   - **Client Name**: Forbes Burton AI System (or your preferred name)
   - **Homepage URL**: Your application's URL (e.g., `http://localhost:3000`)
   - **Authorized Redirect URIs**: Add your callback URL (e.g., `http://localhost:3000/auth/callback`)
6. Click **"Create"**
7. You will receive:
   - **Client ID**
   - **Client Secret**
   
   ⚠️ **Important**: Keep these credentials secure and never commit them to version control!

### Step 2: Configure OAuth Scopes

Ensure your application has the following Zoho CRM scopes:
- `ZohoCRM.modules.leads.READ`
- `ZohoCRM.modules.leads.WRITE`
- `ZohoCRM.modules.ALL` (optional, for full access)

### Step 3: Generate Access Token

You have two options to obtain an access token:

#### Option A: Using Zoho's OAuth Flow (Recommended)

1. Implement the OAuth 2.0 authorization code flow in your application
2. Redirect users to Zoho's authorization endpoint:
   ```
   https://accounts.zoho.com/oauth/v2/auth?scope={scopes}&client_id={client_id}&response_type=code&access_type=offline&redirect_uri={redirect_uri}
   ```
3. Exchange the authorization code for an access token at:
   ```
   https://accounts.zoho.com/oauth/v2/token
   ```
4. Store the access token securely

#### Option B: Generate a Self-Client Token (For Development)

1. In the Zoho API Console, click on your client
2. Go to the **"Generate Code"** tab
3. Select the required scopes
4. Set the time duration
5. Click **"Generate"**
6. Copy the generated code
7. Use this code to generate an access token via:
   ```bash
   curl -X POST https://accounts.zoho.com/oauth/v2/token \
     -d "grant_type=authorization_code" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "redirect_uri=YOUR_REDIRECT_URI" \
     -d "code=GENERATED_CODE"
   ```

### Step 4: Handle Token Refresh

Zoho access tokens expire after 1 hour. Implement token refresh logic using the refresh token:

```javascript
const refreshAccessToken = async (refreshToken) => {
  const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      refresh_token: refreshToken
    })
  });
  return await response.json();
};
```

## Environment Configuration

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** and fill in your credentials:
   ```env
   # Zoho OAuth Client ID (from Zoho API Console)
   ZOHO_CLIENT_ID=your_actual_client_id_here

   # Zoho OAuth Client Secret (from Zoho API Console)
   ZOHO_CLIENT_SECRET=your_actual_client_secret_here

   # Zoho OAuth Redirect URI (must match the one configured in Zoho API Console)
   ZOHO_REDIRECT_URI=http://localhost:3000/auth/callback

   # Zoho API Base URL (select based on your data center)
   # US: https://www.zohoapis.com
   # EU: https://www.zohoapis.eu
   # IN: https://www.zohoapis.in
   # AU: https://www.zohoapis.com.au
   # JP: https://www.zohoapis.jp
   ZOHO_API_BASE=https://www.zohoapis.com

   # Zoho Access Token (obtained via OAuth flow)
   ZOHO_ACCESS_TOKEN=your_access_token_here
   ```

3. **Verify your configuration** by checking that:
   - All required fields are filled in
   - The redirect URI matches what you configured in Zoho API Console
   - The API base URL matches your Zoho data center location

## Usage

### Starting the Development Server

```bash
npm start
```

The application will start at `http://localhost:3000` (or your configured port).

### Using the Zoho API Service

The `src/services/zohoApi.js` module provides functions to interact with Zoho CRM:

```javascript
import { fetchLeads, fetchLeadById, searchLeads } from './services/zohoApi';

// Fetch all leads with pagination
const leads = await fetchLeads({ page: 1, perPage: 200 });

// Fetch a specific lead by ID
const lead = await fetchLeadById('lead_id_here');

// Search leads with criteria
const results = await searchLeads('(Email:equals:example@email.com)');
```

## Project Structure

```
forbes-burton-ai-system/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   │   └── zohoApi.js   # Zoho CRM API integration
│   └── utils/            # Utility functions
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## API Documentation

### `zohoApi.js` Functions

#### `fetchLeads(options)`

Fetches leads from Zoho CRM with pagination and sorting.

**Parameters:**
- `options.page` (number): Page number (default: 1)
- `options.perPage` (number): Results per page (default: 200, max: 200)
- `options.sortBy` (string): Field to sort by (default: 'Modified_Time')
- `options.sortOrder` (string): Sort order 'asc' or 'desc' (default: 'desc')

**Returns:** Promise<Object> - Response containing leads data

**Example:**
```javascript
const leads = await fetchLeads({ page: 1, perPage: 50, sortBy: 'Email', sortOrder: 'asc' });
```

#### `fetchLeadById(leadId)`

Fetches a single lead by ID.

**Parameters:**
- `leadId` (string): The ID of the lead to fetch

**Returns:** Promise<Object> - Response containing lead data

**Example:**
```javascript
const lead = await fetchLeadById('4876876000000123456');
```

#### `searchLeads(criteria)`

Searches leads using COQL (CRM Object Query Language).

**Parameters:**
- `criteria` (string): COQL query criteria

**Returns:** Promise<Object> - Response containing search results

**Example:**
```javascript
const results = await searchLeads('(Last_Name:equals:Smith)');
```

## Security Best Practices

1. **Never commit credentials**: Always use `.env` files and add them to `.gitignore`
2. **Rotate tokens regularly**: Implement automatic token refresh
3. **Use HTTPS**: Always use secure connections in production
4. **Validate data**: Sanitize all user inputs before sending to Zoho CRM
5. **Monitor API usage**: Keep track of API call limits and quotas

## Troubleshooting

### Common Issues

**Issue**: "ZOHO_ACCESS_TOKEN is not configured"
- **Solution**: Ensure your `.env` file exists and contains a valid access token

**Issue**: "Zoho API Error: 401 Unauthorized"
- **Solution**: Your access token may have expired. Generate a new one or implement token refresh

**Issue**: "Invalid redirect URI"
- **Solution**: Ensure the redirect URI in your `.env` file exactly matches the one configured in Zoho API Console

**Issue**: "CORS errors"
- **Solution**: Configure your server to handle CORS properly or use a proxy for API requests

## Resources

- [Zoho CRM API Documentation](https://www.zoho.com/crm/developer/docs/api/v3/)
- [Zoho OAuth 2.0 Guide](https://www.zoho.com/crm/developer/docs/api/v3/oauth-overview.html)
- [Zoho API Console](https://api-console.zoho.com/)

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Support

For issues or questions, please contact the development team or open an issue in the repository.
