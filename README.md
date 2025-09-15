# Buyer Lead Intake App

A comprehensive Next.js application for managing buyer leads and property inquiries. Built with TypeScript, Drizzle ORM, and Tailwind CSS.

## Features

### Core Functionality
- **Lead Management**: Create, view, edit, and delete buyer leads
- **Advanced Filtering**: Search and filter by city, property type, status, timeline
- **Pagination**: Server-side pagination for efficient data loading
- **History Tracking**: Complete audit trail of all changes with user attribution
- **Concurrency Control**: Prevents data conflicts with optimistic locking

### Import/Export
- **CSV Import**: Bulk import up to 200 leads with validation and error reporting
- **CSV Export**: Export filtered results with current search criteria
- **Template Download**: Pre-formatted CSV template for easy data entry

### Authentication & Authorization
- **Magic Link Authentication**: Passwordless login via email
- **Demo Login**: Quick access for testing and demonstrations
- **Role-based Access**: User and admin roles with appropriate permissions
- **Ownership Control**: Users can only edit their own leads (admins can edit all)

### User Experience
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: Status quick-actions for rapid lead management
- **Tag System**: Intelligent tag input with suggestions and autocomplete
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Smooth loading indicators throughout the app

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with email provider
- **Styling**: Tailwind CSS with custom components
- **Validation**: Zod schemas for client and server-side validation
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `name` (String, Optional)
- `role` (String, Default: 'user')
- `created_at`, `updated_at` (Timestamps)

### Buyers Table
- `id` (UUID, Primary Key)
- `full_name` (String, 2-80 chars)
- `email` (String, Optional)
- `phone` (String, 10-15 chars, Required)
- `city` (Enum: Chandigarh|Mohali|Zirakpur|Panchkula|Other)
- `property_type` (Enum: Apartment|Villa|Plot|Office|Retail)
- `bhk` (Enum: 1|2|3|4|Studio, Optional for non-residential)
- `purpose` (Enum: Buy|Rent)
- `budget_min`, `budget_max` (Integer, Optional)
- `timeline` (Enum: 0-3m|3-6m|>6m|Exploring)
- `source` (Enum: Website|Referral|Walk-in|Call|Other)
- `status` (Enum: New|Qualified|Contacted|Visited|Negotiation|Converted|Dropped)
- `notes` (Text, ≤1000 chars)
- `tags` (JSON Array)
- `owner_id` (UUID, Foreign Key to Users)
- `created_at`, `updated_at` (Timestamps)

### Buyer History Table
- `id` (UUID, Primary Key)
- `buyer_id` (UUID, Foreign Key)
- `changed_by` (UUID, Foreign Key to Users)
- `changed_at` (Timestamp)
- `diff` (JSON, Changed fields with before/after values)

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- SMTP server for email authentication (optional for demo)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd buyer-lead-intake
   npm install
   ```

2. **Environment Configuration**
   
   Copy `.env.local` and update with your credentials:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/buyer_leads"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Email (for magic links)
   EMAIL_SERVER_USER="your-email@example.com"
   EMAIL_SERVER_PASSWORD="your-password"
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT=587
   EMAIL_FROM="noreply@example.com"
   ```

3. **Database Setup**
   ```bash
   npm run setup
   ```
   This will:
   - Generate migration files
   - Run database migrations
   - Create initial schema with demo user

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Visit `http://localhost:3000`

### Production Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Environment Variables**
   - Set all environment variables in your hosting platform
   - Ensure `NEXTAUTH_URL` points to your production domain
   - Configure email server for magic link authentication

3. **Database Migration**
   ```bash
   npm run db:migrate
   ```

## Usage Guide

### Getting Started
1. **Sign In**: Use magic link authentication or demo login
2. **Create Leads**: Navigate to "New Lead" to add buyer information
3. **Manage Leads**: View, edit, and update lead status from the main list
4. **Import Data**: Use CSV import for bulk lead creation
5. **Export Data**: Download filtered results as CSV

### Lead Management Workflow
1. **New**: Initial lead entry
2. **Qualified**: Lead meets basic criteria
3. **Contacted**: Initial contact made
4. **Visited**: Property viewing scheduled/completed
5. **Negotiation**: Active price/terms discussion
6. **Converted**: Deal closed successfully
7. **Dropped**: Lead no longer viable

### CSV Import Format
Required columns: Full Name, Phone, City, Property Type, Purpose, Timeline, Source
Optional columns: Email, BHK, Budget Min, Budget Max, Status, Notes, Tags

Example:
```csv
Full Name,Email,Phone,City,Property Type,BHK,Purpose,Budget Min,Budget Max,Timeline,Source,Status,Notes,Tags
John Doe,john@example.com,9876543210,Chandigarh,Apartment,2,Buy,5000000,7000000,0-3m,Website,New,"Looking for 2BHK","urgent,first-time-buyer"
```

### Permissions
- **Users**: Can create, view, edit, and delete their own leads
- **Admins**: Can manage all leads and access all features
- **Ownership**: Leads are tied to the creating user

## API Endpoints

### Buyers
- `GET /api/buyers` - List buyers with filters and pagination
- `POST /api/buyers` - Create new buyer
- `GET /api/buyers/[id]` - Get buyer details with history
- `PUT /api/buyers/[id]` - Update buyer (with concurrency control)
- `DELETE /api/buyers/[id]` - Delete buyer
- `PATCH /api/buyers/[id]/status` - Quick status update

### Import/Export
- `POST /api/buyers/import` - Import buyers from CSV
- `GET /api/buyers/export` - Export buyers to CSV

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

## Development

### Database Commands
```bash
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

### Code Structure
```
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── lib/                 # Utilities and configurations
│   ├── db/             # Database schema and connection
│   ├── services/       # Business logic
│   └── validations/    # Zod schemas
├── scripts/            # Setup and utility scripts
└── public/             # Static assets
```

### Key Features Implementation
- **Server-Side Rendering**: All pages use SSR for better SEO and performance
- **Form Validation**: Client and server-side validation with Zod
- **Error Boundaries**: Comprehensive error handling with user-friendly messages
- **Optimistic Updates**: Status changes update immediately with rollback on failure
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation for common solutions
- Review the error logs for debugging information
