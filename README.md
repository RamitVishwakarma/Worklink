# WorkLink - Complete Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Industrial Design System](#industrial-design-system)
4. [User Types & Roles](#user-types--roles)
5. [API Endpoints Documentation](#api-endpoints-documentation)
6. [Frontend Application Structure](#frontend-application-structure)
7. [Features & Functionality](#features--functionality)
8. [Authentication & Authorization](#authentication--authorization)
9. [State Management](#state-management)
10. [Component Library](#component-library)
11. [Routing Structure](#routing-structure)
12. [Installation & Setup](#installation--setup)
13. [Development Guidelines](#development-guidelines)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)

## Project Overview

**WorkLink** is an industrial networking platform that connects three main user types:

- **Workers**: Skilled professionals seeking gig opportunities and machine access
- **Startups**: Companies looking to hire workers and access manufacturing resources
- **Manufacturers**: Equipment owners who rent out machines and manufacturing capabilities

The platform facilitates:

- Gig creation and application management
- Machine rental and access requests
- Industrial networking and collaboration
- Profile management for all user types

### Key Features

- **Multi-User System**: Support for Workers, Startups, and Manufacturers
- **Gig Management**: Create, browse, and apply for industrial gigs
- **Machine Marketplace**: Rent and request access to industrial equipment
- **Application Workflow**: Complete application and approval system
- **Industrial Design**: Professional UI built for industrial environments
- **Real-time Updates**: Live application statuses and notifications

## Architecture & Technology Stack

### Frontend Stack

- **Framework**: Next.js 15.1.8 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Industrial Design System
- **UI Components**: shadcn/ui with custom Industrial components
- **Animations**: Framer Motion
- **State Management**: Zustand with persistence
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Theme**: Next Themes

### Backend Integration

- **API Base URL**: `http://localhost:3000/api` (configurable via environment variables)
- **Authentication**: JWT tokens with Bearer authentication
- **Data Format**: JSON API responses

## Industrial Design System

WorkLink implements a comprehensive Industrial Design System focused on precision, reliability, and professional appearance.

### Design Philosophy

**Theme**: Industrial Precision meets raw human effort

**Core Principles**:

- Clean, functional layouts that prioritize usability
- Strong contrast and readability for industrial environments
- Consistent use of safety colors for important actions
- Metal-inspired UI elements (buttons, cards, borders)
- Grid-based layouts reminiscent of industrial blueprints
- Subtle gear and machinery iconography

### Color Palette

#### Primary Colors

- **Gunmetal Grey**: `#2C3E50` - Primary brand color
- **Navy Blue**: `#1E3A8A` - Secondary brand color
- **Safety Yellow**: `#FDE047` - Accent and call-to-action color

#### Usage Guidelines

```css
/* Primary actions and headers */
bg-industrial-gunmetal-800 text-white

/* Secondary actions and navigation */
bg-industrial-navy-800 text-white

/* Accent actions (Apply, Submit, Confirm) */
bg-industrial-safety-300 text-industrial-gunmetal-900

/* Neutral backgrounds */
bg-industrial-gunmetal-50 text-industrial-gunmetal-800
```

### Typography

- **Headings**: Oswald, Bebas Neue, Arial Black (Bold, condensed fonts)
- **Body Text**: Inter, Roboto, system-ui (Clean, readable fonts)
- **Monospace**: JetBrains Mono, Fira Code, Consolas

### Component Variants

- **Industrial Cards**: Light with metal grid patterns, dark gunmetal, accent gradients
- **Industrial Buttons**: Primary (gunmetal), secondary (navy), accent (safety yellow)
- **Industrial Inputs**: Enhanced form controls with industrial styling
- **Industrial Icons**: Gear, factory, and machinery-themed iconography

## User Types & Roles

### 1. Workers

**Role**: Skilled professionals seeking employment and equipment access

**Capabilities**:

- Browse and apply for gigs
- Request access to manufacturing machines
- Manage skill profiles and portfolios
- Track application statuses
- Update availability and location

**Profile Fields**:

- Full name, email, skills
- Experience level and portfolio
- Location and availability
- Applied gigs and machine requests

### 2. Startups

**Role**: Companies hiring workers and accessing manufacturing resources

**Capabilities**:

- Create and manage gig postings
- Request access to manufacturing equipment
- Review and manage worker applications
- Manage company profiles
- Track hiring metrics

**Profile Fields**:

- Company name, description, industry
- Location, website, contact information
- Founded year, team size
- Posted gigs and hiring statistics

### 3. Manufacturers

**Role**: Equipment owners providing machine access and manufacturing services

**Capabilities**:

- List and manage manufacturing equipment
- Review and approve access requests
- Set pricing and availability schedules
- Manage equipment specifications
- Track utilization metrics

**Profile Fields**:

- Company name, description, industry
- Equipment catalog and specifications
- Location, contact information
- Established year, certifications

## API Endpoints Documentation

### Authentication Endpoints

#### POST `/auth/signup`

Create a new user account

```json
{
  "email": "user@example.com",
  "password": "password123",
  "userType": "worker|startup|manufacturer",
  "name": "Full Name",
  "companyName": "Company Name" // For startup/manufacturer
}
```

#### POST `/auth/signin`

Authenticate user and receive JWT token

```json
{
  "email": "user@example.com",
  "password": "password123",
  "userType": "worker|startup|manufacturer"
}
```

#### GET `/auth/me`

Get current authenticated user information

- **Headers**: `Authorization: Bearer <token>`

### Worker Endpoints

#### GET `/workers/{workerId}/profile`

Get worker profile information

#### PUT `/workers/{workerId}/profile`

Update worker profile

```json
{
  "name": "Updated Name",
  "skills": ["React", "Node.js", "Welding"],
  "experience": "5 years",
  "location": "City, State"
}
```

#### POST `/gigs/{gigId}/apply`

Apply for a gig

```json
{
  "workerId": "worker_id",
  "coverLetter": "Application message",
  "expectedSalary": 50000
}
```

#### GET `/workers/{workerId}/applications`

Get all gig applications for a worker

#### POST `/machines/{machineId}/apply`

Apply for machine access

```json
{
  "applicantId": "worker_id",
  "applicantType": "worker",
  "requestedStartDate": "2025-01-01",
  "requestedEndDate": "2025-01-31",
  "purpose": "Manufacturing project"
}
```

### Startup Endpoints

#### GET `/startups/{startupId}/profile`

Get startup profile information

#### PUT `/startups/{startupId}/profile`

Update startup profile

```json
{
  "companyName": "Tech Startup Inc",
  "description": "Innovative tech solutions",
  "industry": "Technology",
  "location": "San Francisco, CA",
  "website": "https://example.com"
}
```

#### POST `/gigs`

Create a new gig posting

```json
{
  "title": "Senior Developer",
  "description": "Looking for experienced developer",
  "company": "Tech Startup Inc",
  "location": "Remote",
  "salary": 80000,
  "jobType": "full-time",
  "requiredSkills": ["React", "Node.js"]
}
```

#### GET `/startups/{startupId}/gigs`

Get all gigs posted by a startup

#### DELETE `/gigs/{gigId}`

Delete a gig posting

#### POST `/machines/{machineId}/apply`

Apply for machine access as a startup

```json
{
  "applicantId": "startup_id",
  "applicantType": "startup",
  "requestedStartDate": "2025-01-01",
  "requestedEndDate": "2025-03-31",
  "purpose": "Product manufacturing"
}
```

### Manufacturer Endpoints

#### GET `/manufacturers/{manufacturerId}/profile`

Get manufacturer profile information

#### PUT `/manufacturers/{manufacturerId}/profile`

Update manufacturer profile

```json
{
  "companyName": "Industrial Manufacturing Co",
  "description": "Leading manufacturer of industrial equipment",
  "industry": "Manufacturing",
  "location": "Detroit, MI",
  "establishedYear": 1985
}
```

#### POST `/machines`

Add a new machine listing

```json
{
  "name": "CNC Machine Model X",
  "type": "CNC",
  "description": "High-precision CNC machine",
  "location": "Factory Floor A",
  "specifications": {
    "maxSize": "1000x500x300mm",
    "precision": "±0.01mm",
    "materials": ["Aluminum", "Steel", "Plastic"]
  },
  "pricePerHour": 150,
  "availability": true
}
```

#### GET `/manufacturers/{manufacturerId}/machines`

Get all machines owned by a manufacturer

#### DELETE `/machines/{machineId}`

Remove a machine listing

#### PATCH `/machines/{machineId}/availability`

Toggle machine availability

```json
{
  "availability": true
}
```

#### GET `/manufacturers/{manufacturerId}/machines/{machineId}/applications`

Get all applications for a specific machine

#### PATCH `/applications/{applicationId}/status`

Approve or reject a machine application

```json
{
  "status": "approved|rejected"
}
```

### General/Public Endpoints

#### GET `/gigs`

Get all available gigs with optional filtering

- **Query Parameters**: `location`, `jobType`, `skills`, `search`

#### GET `/gigs/{gigId}`

Get detailed information about a specific gig

#### GET `/machines`

Get all available machines with optional filtering

- **Query Parameters**: `type`, `location`, `availability`, `search`

#### GET `/machines/{machineId}`

Get detailed information about a specific machine

## Frontend Application Structure

### Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication pages
│   │   ├── signin/page.tsx       # Sign in page
│   │   └── signup/page.tsx       # Sign up page
│   ├── (dashboard)/              # Protected dashboard pages
│   │   ├── worker/               # Worker-specific pages
│   │   │   ├── dashboard/        # Worker dashboard
│   │   │   ├── machines/         # Browse machines
│   │   │   ├── applied-gigs/     # Applied gigs
│   │   │   └── profile/          # Worker profile
│   │   ├── startup/              # Startup-specific pages
│   │   │   ├── dashboard/        # Startup dashboard
│   │   │   ├── create-gig/       # Create new gig
│   │   │   ├── gigs/             # Manage gigs
│   │   │   ├── machines/         # Browse machines
│   │   │   └── profile/          # Startup profile
│   │   └── manufacturer/         # Manufacturer-specific pages
│   │       ├── dashboard/        # Manufacturer dashboard
│   │       ├── add-machine/      # Add new machine
│   │       ├── machines/         # Manage machines
│   │       └── profile/          # Manufacturer profile
│   ├── gigs/page.tsx            # Public gigs browse
│   ├── machines/page.tsx        # Public machines browse
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable components
│   ├── auth/                    # Authentication components
│   │   ├── SigninForm.tsx       # Sign in form
│   │   ├── SignupForm.tsx       # Sign up form
│   │   ├── withAuth.tsx         # Authentication HOC
│   │   └── index.ts             # Auth exports
│   ├── ui/                      # UI component library
│   │   ├── industrial-*.tsx     # Industrial design components
│   │   ├── card.tsx             # Card components
│   │   ├── button.tsx           # Button components
│   │   ├── form.tsx             # Form components
│   │   └── ...                  # Other UI components
│   ├── homepage/                # Homepage components
│   ├── gigs/                    # Gig-related components
│   └── machines/                # Machine-related components
├── lib/                         # Utility libraries
│   ├── api.ts                   # API client and endpoints
│   ├── types.ts                 # TypeScript type definitions
│   ├── utils.ts                 # Utility functions
│   └── store/                   # State management
│       └── authStore.ts         # Authentication store
└── hooks/                       # Custom React hooks
    └── use-toast.ts             # Toast notification hook
```

### Page Components

#### Authentication Pages

- **Sign In**: Multi-user type authentication with form validation
- **Sign Up**: Registration for all user types with conditional fields

#### Worker Dashboard Pages

- **Dashboard**: Overview of available gigs, applied gigs, and quick actions
- **Machines**: Browse and apply for machine access
- **Applied Gigs**: Track application statuses and manage submissions
- **Profile**: Manage personal information, skills, and portfolio

#### Startup Dashboard Pages

- **Dashboard**: Company overview, posted gigs, and hiring metrics
- **Create Gig**: Form to post new job opportunities
- **Gigs**: Manage posted gigs and view applications
- **Machines**: Browse and request manufacturing equipment access
- **Profile**: Manage company information and details

#### Manufacturer Dashboard Pages

- **Dashboard**: Equipment overview, applications, and business metrics
- **Add Machine**: Form to list new manufacturing equipment
- **Machines**: Manage equipment listings and availability
- **Applications**: Review and approve/reject access requests
- **Profile**: Manage company information and certifications

## Features & Functionality

### Authentication & User Management

#### Multi-Type Authentication

- Support for three distinct user types
- Role-based dashboard routing
- JWT token management with refresh
- Persistent authentication state

#### User Registration

- Dynamic form fields based on user type
- Email validation and password requirements
- Company information for startups/manufacturers
- Skills and experience for workers

#### Profile Management

- User-type specific profile fields
- Image upload capabilities
- Portfolio and document management
- Contact information and preferences

### Gig Management System

#### For Startups (Gig Creators)

- **Create Gigs**: Post new job opportunities with detailed requirements
- **Manage Listings**: Edit, update, or remove gig postings
- **Application Review**: View and manage worker applications
- **Analytics**: Track application rates and hiring metrics

#### For Workers (Gig Seekers)

- **Browse Gigs**: Search and filter available opportunities
- **Apply for Gigs**: Submit applications with cover letters
- **Track Applications**: Monitor application statuses and updates
- **Saved Gigs**: Bookmark interesting opportunities

#### Gig Features

- **Rich Descriptions**: Detailed job requirements and expectations
- **Skill Matching**: Filter by required skills and experience
- **Location Filtering**: Remote, on-site, and hybrid options
- **Salary Information**: Transparent compensation details
- **Application Workflow**: Structured application and review process

### Machine Marketplace

#### For Manufacturers (Equipment Owners)

- **List Machines**: Add detailed equipment specifications
- **Manage Availability**: Set schedules and availability windows
- **Pricing Control**: Set hourly or project-based rates
- **Application Management**: Review and approve access requests
- **Usage Analytics**: Track utilization and revenue

#### For Workers & Startups (Equipment Seekers)

- **Browse Equipment**: Search by type, location, and specifications
- **Request Access**: Submit detailed access requests
- **Scheduling**: Specify required time periods
- **Track Requests**: Monitor application statuses
- **Equipment Details**: View specifications, pricing, and location

#### Machine Features

- **Detailed Specifications**: Technical details and capabilities
- **Real-time Availability**: Live scheduling and booking
- **Image Galleries**: Visual equipment documentation
- **Location Mapping**: Precise facility locations
- **Safety Information**: Operating requirements and certifications

### Dashboard Analytics

#### Worker Dashboard

- **Application Metrics**: Success rates and response times
- **Skill Insights**: In-demand skills and market trends
- **Opportunity Alerts**: New gigs matching preferences
- **Profile Optimization**: Suggestions for profile improvement

#### Startup Dashboard

- **Hiring Metrics**: Application rates and conversion statistics
- **Talent Pool Insights**: Available skills and experience levels
- **Gig Performance**: View and engagement analytics
- **Market Intelligence**: Industry trends and compensation data

#### Manufacturer Dashboard

- **Equipment Utilization**: Usage rates and revenue tracking
- **Demand Analytics**: Popular equipment types and trends
- **Customer Insights**: Repeat customers and usage patterns
- **Revenue Optimization**: Pricing recommendations and insights

### Communication & Notifications

#### Real-time Updates

- **Application Status Changes**: Instant notifications for status updates
- **New Opportunities**: Alerts for matching gigs and equipment
- **System Announcements**: Platform updates and maintenance notices
- **Message Center**: Internal messaging system between users

#### Email Notifications

- **Application Confirmations**: Receipt confirmations for submissions
- **Status Updates**: Email alerts for important changes
- **Weekly Digests**: Summary of activity and opportunities
- **System Alerts**: Security and account notifications

### Search & Discovery

#### Advanced Filtering

- **Location-based Search**: Geographic filtering with radius options
- **Skill-based Matching**: AI-powered skill matching and recommendations
- **Date Range Filtering**: Availability and timeline-based searches
- **Price Range Filtering**: Budget-based equipment and gig filtering

#### Recommendation Engine

- **Personalized Suggestions**: ML-powered content recommendations
- **Similar Opportunities**: Related gigs and equipment suggestions
- **Trending Content**: Popular and high-demand opportunities
- **User Behavior**: Learning from user interactions and preferences

## Authentication & Authorization

### JWT Token Management

#### Token Structure

```javascript
{
  "id": "user_id",
  "email": "user@example.com",
  "userType": "worker|startup|manufacturer",
  "iat": 1234567890,
  "exp": 1234567890
}
```

#### Token Storage

- **Local Storage**: Persistent token storage for authentication
- **Automatic Refresh**: Background token renewal
- **Secure Headers**: Bearer token in Authorization headers
- **Cross-tab Sync**: Synchronized authentication across browser tabs

#### Protected Routes

```typescript
// Higher-Order Component for route protection
const withAuth = (
  Component,
  options?: {
    allowedUserTypes?: UserType[];
  }
) => {
  // Redirect unauthenticated users to sign in
  // Restrict access based on user type
  // Handle loading states during authentication checks
};
```

### Role-Based Access Control

#### Route Protection

- **Public Routes**: Home, gigs browse, machines browse, authentication
- **Worker Routes**: Worker dashboard, applications, profile
- **Startup Routes**: Startup dashboard, gig management, profile
- **Manufacturer Routes**: Manufacturer dashboard, machine management, profile

#### Permission Levels

- **Read Access**: View public content and own data
- **Write Access**: Create and modify own content
- **Admin Access**: Manage applications and approvals (role-specific)

## State Management

### Zustand Store Architecture

#### Authentication Store

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData?: User) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}
```

#### Store Features

- **Persistent Storage**: Local storage integration with Zustand persist
- **Automatic Rehydration**: State restoration on page reload
- **Optimistic Updates**: Immediate UI updates with rollback on failure
- **Loading States**: Centralized loading state management

#### State Synchronization

- **Cross-Component Updates**: Real-time state updates across components
- **API Integration**: Automatic state updates from API responses
- **Error Handling**: Consistent error state management
- **Cache Management**: Intelligent data caching and invalidation

## Component Library

### Industrial Design Components

The WorkLink component library provides a comprehensive set of industrial-themed UI components designed for reliability and usability in manufacturing environments.

#### IndustrialCard

Container component with multiple industrial variants and optional animation support.

```tsx
<IndustrialCard variant="industrial|industrial-dark|industrial-accent|industrial-highlight">
  <IndustrialCardHeader>
    <IndustrialCardTitle>Title</IndustrialCardTitle>
    <IndustrialCardDescription>Description</IndustrialCardDescription>
  </IndustrialCardHeader>
  <IndustrialCardContent>Content</IndustrialCardContent>
  <IndustrialCardFooter>Footer actions</IndustrialCardFooter>
</IndustrialCard>
```

**Variants:** `industrial`, `industrial-dark`, `industrial-accent`, `industrial-highlight`
**Features:** Metal grid backgrounds, industrial shadows, hover animations

#### IndustrialButton

Button component with industrial styling and multiple variants for different actions.

```tsx
<Button
  variant="industrial-primary|industrial-secondary|industrial-accent|industrial-outline|industrial-ghost|industrial-danger"
  size="sm|default|lg|xl"
>
  Action
</Button>
```

**Variants:**

- `industrial-primary` - Gunmetal background for primary actions
- `industrial-secondary` - Navy background for secondary actions
- `industrial-accent` - Safety yellow background for important actions
- `industrial-outline` - Transparent with industrial border
- `industrial-ghost` - Minimal styling with hover effects
- `industrial-danger` - Red background for destructive actions

#### IndustrialInput

Form input component with validation support and industrial styling.

```tsx
<IndustrialInput
  variant="default|steel|dark|accent"
  state="default|success|warning|error"
  placeholder="Enter text"
  icon="search"
  iconPosition="left|right"
  {...field}
/>

// With field wrapper
<IndustrialInputField
  label="Machine Name"
  description="Enter the machine identifier"
  error="This field is required"
>
  <IndustrialInput placeholder="Enter name" />
</IndustrialInputField>
```

**Features:** Icon support, validation states, field wrappers, industrial theming

#### IndustrialSelect

Dropdown select component with search functionality and industrial styling.

```tsx
<IndustrialSelect variant="default|industrial|industrial-dark|industrial-accent">
  <IndustrialSelectTrigger>
    <IndustrialSelectValue placeholder="Choose option" />
  </IndustrialSelectTrigger>
  <IndustrialSelectContent>
    <IndustrialSelectItem value="option1">Option 1</IndustrialSelectItem>
    <IndustrialSelectSeparator />
    <IndustrialSelectItem value="option2">Option 2</IndustrialSelectItem>
  </IndustrialSelectContent>
</IndustrialSelect>
```

**Features:** Search functionality, grouping, separators, industrial theming

#### IndustrialCheckbox

Checkbox component with group support and enhanced field wrappers.

```tsx
<IndustrialCheckbox
  variant="default|industrial|industrial-dark"
  state="default|success|warning|danger"
/>

// With field wrapper
<IndustrialCheckboxField
  label="Accept Terms"
  description="Agree to terms and conditions"
  error="You must accept the terms"
>
  <IndustrialCheckbox />
</IndustrialCheckboxField>

// Checkbox group
<IndustrialCheckboxGroup
  label="Select Skills"
  values={selectedSkills}
  onValueChange={setSelectedSkills}
>
  <IndustrialCheckbox value="welding" label="Welding" />
  <IndustrialCheckbox value="machining" label="Machining" />
</IndustrialCheckboxGroup>
```

**Features:** Group management, validation states, enhanced field components

#### IndustrialRadioGroup

Radio button component with card variants and group management.

```tsx
<IndustrialRadioGroup
  variant="default|industrial|industrial-dark"
  value={selectedValue}
  onValueChange={setSelectedValue}
>
  <IndustrialRadioGroupItem value="option1" />
  <IndustrialRadioGroupItem value="option2" />
</IndustrialRadioGroup>

// Radio cards
<IndustrialRadioCard
  value="premium"
  title="Premium Plan"
  description="Advanced features"
  icon="crown"
/>
```

**Features:** Card variants, group management, icon support, industrial styling

#### IndustrialTextarea

Text area component with character limits and auto-resize functionality.

```tsx
<IndustrialTextarea
  variant="default|industrial|industrial-dark"
  placeholder="Enter description"
  maxLength={500}
  autoResize
  showCharacterCount
/>

// With field wrapper
<IndustrialTextareaField
  label="Description"
  description="Provide detailed information"
  action={<Button size="sm">Format</Button>}
>
  <IndustrialTextarea />
</IndustrialTextareaField>
```

**Features:** Character counting, auto-resize, field wrappers, actions

#### IndustrialTable

Data table component with sorting, filtering, and industrial styling.

```tsx
<IndustrialTable>
  <IndustrialTableHeader>
    <IndustrialTableRow>
      <IndustrialTableHead sortable>Name</IndustrialTableHead>
      <IndustrialTableHead>Status</IndustrialTableHead>
    </IndustrialTableRow>
  </IndustrialTableHeader>
  <IndustrialTableBody>
    <IndustrialTableRow>
      <IndustrialTableCell>Machine 1</IndustrialTableCell>
      <IndustrialTableCell>Active</IndustrialTableCell>
    </IndustrialTableRow>
    <IndustrialTableEmpty colSpan={2} message="No data available" />
  </IndustrialTableBody>
</IndustrialTable>
```

**Features:** Sorting, filtering, empty states, responsive design

#### IndustrialBadge

Status and category indicators with multiple industrial variants.

```tsx
<IndustrialBadge
  variant="industrial-primary|industrial-secondary|industrial-accent|industrial-success|industrial-warning|industrial-danger"
  size="default|sm|lg"
>
  Status
</IndustrialBadge>
```

**Features:** Multiple variants, size options, industrial color schemes

#### IndustrialDialog

Modal dialog component with industrial styling and animations.

```tsx
<IndustrialDialog variant="default|industrial|industrial-dark">
  <IndustrialDialogTrigger asChild>
    <Button>Open Dialog</Button>
  </IndustrialDialogTrigger>
  <IndustrialDialogContent>
    <IndustrialDialogHeader>
      <IndustrialDialogTitle>Title</IndustrialDialogTitle>
      <IndustrialDialogDescription>Description</IndustrialDialogDescription>
    </IndustrialDialogHeader>
    <IndustrialDialogFooter>
      <IndustrialDialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </IndustrialDialogClose>
    </IndustrialDialogFooter>
  </IndustrialDialogContent>
</IndustrialDialog>
```

**Features:** Multiple variants, animations, accessible design

#### IndustrialSkeleton

Loading skeleton component with pre-built layouts for common use cases.

```tsx
// Basic skeleton
<IndustrialSkeleton className="h-4 w-[250px]" />

// Pre-built skeletons
<IndustrialSkeletonCard />
<IndustrialSkeletonTable rows={5} columns={4} />
<IndustrialSkeletonList items={3} />
<IndustrialSkeletonForm fields={4} />
<IndustrialSkeletonPage />
```

**Features:** Shimmer animations, pre-built layouts, industrial theming

#### IndustrialIcon

Icon component with extensive icon library and animation support.

```tsx
<IndustrialIcon
  icon="gear|factory|wrench|hardhat|bolt|circuit|cog|settings"
  size="xs|sm|md|lg|xl"
  animated={true}
  className="text-industrial-accent"
/>
```

**Features:** 20+ industrial icons, size variants, rotation animations

#### IndustrialLayout

Layout components for consistent page structure and responsive design.

```tsx
<IndustrialLayout background="grid|steel|gradient|none" padding="lg" animated>
  <IndustrialContainer size="lg" center>
    <IndustrialHeader level={1} accent>
      Page Title
    </IndustrialHeader>
    <div>Page content</div>
  </IndustrialContainer>
</IndustrialLayout>
```

**Features:** Background patterns, responsive containers, animated transitions

### Form Components

#### React Hook Form Integration

- **Validation**: Zod schema validation with TypeScript support
- **Error Handling**: Consistent error message display
- **Loading States**: Form submission loading indicators
- **File Uploads**: Image and document upload components

#### Form Fields

- **Text Inputs**: Standard text input with industrial styling
- **Select Dropdowns**: Multi-option selection with search
- **Date Pickers**: Date range selection for scheduling
- **File Uploads**: Drag-and-drop file upload components
- **Rich Text Editors**: Description and content editing

### Animation Components

#### Framer Motion Integration

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
```

#### Animation Patterns

- **Page Transitions**: Smooth transitions between routes
- **Card Animations**: Staggered card reveals and interactions
- **Form Animations**: Progressive form field reveals
- **Loading Animations**: Industrial-themed loading indicators
- **Hover Effects**: Subtle interaction feedback

## Routing Structure

### Next.js App Router

#### Route Groups

```
app/
├── (auth)/           # Authentication routes
├── (dashboard)/      # Protected dashboard routes
└── (public)/         # Public marketing routes
```

#### Dynamic Routes

```
manufacturer/machines/[id]/applications/
└── Dynamic machine applications page
```

#### Route Protection

```typescript
// Automatic redirection for authenticated users
middleware.ts -> redirects based on authentication status

// Component-level protection
withAuth(Component, { allowedUserTypes: ['manufacturer'] })
```

### Navigation Structure

#### Public Navigation

- **Home**: Landing page with platform overview
- **Browse Gigs**: Public gig listings
- **Browse Machines**: Public machine catalog
- **Sign In/Sign Up**: Authentication pages

#### User-Specific Navigation

- **Dashboard**: Role-specific overview page
- **Profile**: User profile management
- **Activity**: User-specific activity pages
- **Settings**: Account and preference management

## Installation & Setup

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm/yarn**: Package manager
- **Git**: Version control
- **Backend API**: WorkLink backend service running

### Environment Setup

1. **Clone Repository**

```bash
git clone <repository-url>
cd worklink-frontend
```

2. **Install Dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Configuration**

```bash
# Create .env.local file
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start Development Server**

```bash
npm run dev
# or
yarn dev
```

5. **Build for Production**

```bash
npm run build
npm start
```

### Development Tools

#### Code Quality

```json
{
  "scripts": {
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  }
}
```

#### Testing Setup

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm run test
```

## Development Guidelines

### Code Organization

#### File Naming Conventions

- **Components**: PascalCase (e.g., `WorkerDashboard.tsx`)
- **Pages**: kebab-case (e.g., `worker-dashboard/page.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase interfaces (e.g., `UserProfile.ts`)

#### Import Organization

```typescript
// 1. React and Next.js imports
import React from 'react';
import { NextPage } from 'next';

// 2. Third-party libraries
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

// 3. Internal components
import { IndustrialCard } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store/authStore';

// 4. Types and interfaces
import { User, UserType } from '@/lib/types';
```

#### Component Structure

```typescript
// Props interface
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

// Main component
const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // State and hooks
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    // Side effects
  }, []);

  // Event handlers
  const handleAction = () => {
    // Handler logic
  };

  // Render
  return (
    <div>Component JSX</div>
  );
};

export default Component;
```

### TypeScript Guidelines

#### Type Definitions

```typescript
// Explicit interface definitions
interface User {
  id: string;
  email: string;
  userType: UserType;
}

// Enum for constants
enum UserType {
  WORKER = 'worker',
  STARTUP = 'startup',
  MANUFACTURER = 'manufacturer',
}

// Generic types for API responses
interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}
```

#### API Type Safety

```typescript
// Typed API functions
export const getUser = (id: string): Promise<ApiResponse<User>> => {
  return api.get(`/users/${id}`);
};

// Type-safe error handling
try {
  const response = await getUser(userId);
  setUser(response.data);
} catch (error: AxiosError) {
  console.error('API Error:', error.response?.data);
}
```

### Performance Guidelines

#### Code Splitting

```typescript
// Dynamic imports for route-based code splitting
const WorkerDashboard = dynamic(() => import('./WorkerDashboard'), {
  loading: () => <Skeleton className="h-96" />
});
```

#### Image Optimization

```typescript
// Next.js Image component
import Image from 'next/image';

<Image
  src="/machine-image.jpg"
  alt="CNC Machine"
  width={400}
  height={300}
  priority={false}
  placeholder="blur"
/>
```

#### API Optimization

```typescript
// Request deduplication and caching
const { data, error, isLoading } = useSWR(
  `/api/machines/${machineId}`,
  fetcher,
  { revalidateOnFocus: false }
);
```

## Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

2. **Environment Variables**

```
NEXT_PUBLIC_API_BASE_URL=https://api.worklink.com/api
NEXT_PUBLIC_APP_URL=https://worklink.vercel.app
```

3. **Build Configuration**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### Docker Deployment

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://backend:8000/api
    depends_on:
      - backend
```

### Static Deployment

```bash
# Build static export
npm run build
npm run export

# Deploy to static hosting (Netlify, GitHub Pages, etc.)
```

## Troubleshooting

### Common Issues

#### Authentication Problems

```typescript
// Check token expiration
const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

// Clear corrupted auth state
if (isTokenExpired(token)) {
  authStore.logout();
}
```

#### API Connection Issues

```typescript
// Debug API configuration
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

// Test API connectivity
const testConnection = async () => {
  try {
    const response = await api.get('/health');
    console.log('API Connected:', response.status);
  } catch (error) {
    console.error('API Connection Failed:', error);
  }
};
```

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Type checking
npm run type-check
```

#### Styling Issues

```bash
# Rebuild Tailwind CSS
npx tailwindcss -i ./src/app/globals.css -o ./dist/output.css --watch

# Check Tailwind configuration
npx tailwindcss-config-viewer
```

### Debug Tools

#### Next.js Debug Mode

```bash
DEBUG=* npm run dev
```

#### API Request Logging

```typescript
// Add request interceptor
api.interceptors.request.use((config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});
```

#### State Debug Tools

```typescript
// Zustand devtools
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set, get) => ({
      // Store implementation
    }),
    { name: 'auth-store' }
  )
);
```

### Performance Monitoring

#### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

#### Lighthouse Audit

```bash
# Install lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

#### Core Web Vitals

```typescript
// Monitor performance metrics
export function reportWebVitals(metric) {
  console.log('Web Vital:', metric);
  // Send to analytics service
}
```

---

## Conclusion

WorkLink represents a comprehensive industrial networking platform built with modern web technologies and a focus on user experience, performance, and maintainability. The industrial design system creates a professional interface suitable for manufacturing environments, while the robust architecture supports scalable growth and feature expansion.

For questions, issues, or contributions, please refer to the project repository or contact the development team.

**Last Updated**: June 4, 2025
**Version**: 1.0.0
**License**: [Insert License Information]

## Generated by AI
