# Growth Dashboard

A working commercial data integration MVP that combines simulated CRM, e-commerce, and chatbot data into a unified commercial dashboard.

**Live demo:**
https://growth-dashboard-mvp.onrender.com

## Overview

Business data is often spread across different systems such as CRM, e-commerce platforms, and chatbots.

This project demonstrates how data from multiple sources can be collected, matched to unified customer records, stored in a relational database, and turned into useful commercial metrics.

The external business systems are simulated, while the integration logic, API communication, webhook handling, database relationships, metric calculations, and dashboard are implemented as a working MVP.

## Architecture

```text
Simulated CRM ───── API / polling ────┐
                                      │
Simulated Shop ──── API / polling ────┼──> Integration Layer
                                      │          │
Simulated Chatbot ─── Webhook ────────┘          ↓
                                              Supabase
                                                 │
                                                 ↓
                                           Dashboard API
                                                 │
                                                 ↓
                                           Web Dashboard
```

## Key Features

- CRM contacts and deals integration
- E-commerce customers and orders integration
- Chatbot lead events through a webhook
- Customer matching using normalized email addresses
- Unified relational data model
- Duplicate protection using database uniqueness constraints
- Automatic calculation of commercial metrics
- Public dashboard API
- Automatic dashboard refresh
- Interactive demo actions

## Interactive Demo

The public dashboard includes controls that simulate incoming activity from external systems:

- **Create Demo Order** — creates a new paid e-commerce order
- **Create CRM Deal** — creates a new open CRM deal
- **Send Chatbot Lead** — creates a new chatbot lead event

The actions write real records to the Supabase database and the dashboard metrics update immediately.

## Dashboard Metrics

The MVP currently displays:

- Total revenue
- Total customers
- Total orders
- Average order value
- Total CRM deals
- Won CRM value
- Open CRM value
- Chatbot leads

## Tech Stack

- **Backend:** Node.js
- **Database:** Supabase / PostgreSQL
- **Frontend:** HTML, CSS, JavaScript
- **Integration:** REST APIs, webhooks, polling
- **Deployment:** Render
- **Version control:** GitHub

## Project Structure

```text
growth-dashboard-mvp/
├── dashboard/       # Web dashboard
├── integration/     # API, imports and integration logic
├── fake-crm/        # Simulated CRM
├── fake-shop/       # Simulated e-commerce system
└── fake-chatbot/    # Simulated chatbot events
```

## Running Locally

Install backend dependencies:

```bash
cd integration
npm install
```

Create an `.env` file:

```text
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

Start the API:

```bash
npm start
```

Serve the frontend:

```bash
cd ../dashboard
python3 -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## Project Status

Working MVP.

The public demo includes the deployed dashboard, API, Supabase database, and interactive simulated source events. The repository also contains the local CRM/shop polling integration used to demonstrate source synchronization.

## Links

**Live Demo**
https://growth-dashboard-mvp.onrender.com

**GitHub**
https://github.com/vmekza/growth-dashboard-mvp
