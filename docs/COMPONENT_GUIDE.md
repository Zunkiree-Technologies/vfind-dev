# V-Find Component Guide

This document provides a comprehensive overview of all UI components, their usage patterns, and the page structure of the V-Find application.

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT HIERARCHY                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layout Components                                               │
│  ├── Root Layout (src/app/layout.tsx)                           │
│  │   ├── AuthProvider                                            │
│  │   └── ThemeWrapper                                            │
│  │                                                               │
│  ├── Navbar (various per section)                                │
│  └── Footer (various per section)                                │
│                                                                  │
│  Page Components                                                 │
│  ├── Landing Pages                                               │
│  ├── Authentication Pages                                        │
│  ├── Nurse Dashboard Pages                                       │
│  ├── Employer Dashboard Pages                                    │
│  └── Admin Dashboard Pages                                       │
│                                                                  │
│  UI Components (src/components/ui/)                              │
│  ├── Form Components (Input, Select, Checkbox, etc.)             │
│  ├── Display Components (Card, Badge, etc.)                      │
│  └── Feedback Components (Toast, Loading, etc.)                  │
│                                                                  │
│  Feature Components                                              │
│  ├── Signup Wizard Steps                                         │
│  ├── Job Components                                              │
│  ├── Profile Components                                          │
│  └── Dashboard Components                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## UI Component Library (Shadcn/ui)

Located in `src/components/ui/`

### Form Components

#### Button (`button.tsx`)

Versatile button component with variants.

```tsx
import { Button } from "@/components/ui/button";

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// States
<Button disabled>Disabled</Button>
<Button className="w-full">Full Width</Button>
```

---

#### MainButton (`MainButton.tsx`)

Custom primary button with V-Find styling.

```tsx
import MainButton from "@/components/ui/MainButton";

<MainButton onClick={handleClick}>
  Click Me
</MainButton>

<MainButton disabled={isLoading}>
  {isLoading ? "Loading..." : "Submit"}
</MainButton>
```

**Styling:** Uses primary blue (#61A6FA) with hover effects.

---

#### Input (`input.tsx`)

Text input component.

```tsx
import { Input } from "@/components/ui/input";

<Input
  type="text"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="Age" />
```

---

#### Textarea (`textarea.tsx`)

Multi-line text input.

```tsx
import { Textarea } from "@/components/ui/textarea";

<Textarea
  placeholder="Enter description..."
  rows={4}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

---

#### Select (`select.tsx`)

Dropdown select component (Radix UI based).

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

---

#### Checkbox (`checkbox.tsx`)

Checkbox input (Radix UI based).

```tsx
import { Checkbox } from "@/components/ui/checkbox";

<div className="flex items-center space-x-2">
  <Checkbox
    id="terms"
    checked={accepted}
    onCheckedChange={setAccepted}
  />
  <label htmlFor="terms">Accept terms</label>
</div>
```

---

#### Radio Group (`radio-group.tsx`)

Radio button group (Radix UI based).

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

<RadioGroup value={selected} onValueChange={setSelected}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <label htmlFor="option1">Option 1</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="option2" />
    <label htmlFor="option2">Option 2</label>
  </div>
</RadioGroup>
```

---

#### Label (`label.tsx`)

Form label component.

```tsx
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>
```

---

#### Form (`form.tsx`)

Form wrapper with React Hook Form integration.

```tsx
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const form = useForm();

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

### Display Components

#### Card (`card.tsx`)

Card container component.

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

#### Badge (`Badge.tsx`)

Status badge component.

```tsx
import { Badge } from "@/components/ui/Badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

---

#### InfoCard (`InfoCard.tsx`)

Information display card.

```tsx
import InfoCard from "@/components/ui/InfoCard";

<InfoCard
  title="Total Jobs"
  value="42"
  icon={<BriefcaseIcon />}
/>
```

---

#### Separator (`Separator.tsx`)

Horizontal or vertical divider.

```tsx
import { Separator } from "@/components/ui/Separator";

<Separator />
<Separator orientation="vertical" />
```

---

### Feedback Components

#### Toast (`toast.tsx`, `toaster.tsx`)

Toast notification system.

```tsx
// In component
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
  title: "Success",
  description: "Your action was completed",
});

toast({
  title: "Error",
  description: "Something went wrong",
  variant: "destructive",
});

// In layout (add Toaster)
import { Toaster } from "@/components/ui/toaster";

<Toaster />
```

---

#### Loading (`loading.tsx`)

Loading spinner component.

```tsx
import Loading from "@/components/loading";

if (isLoading) return <Loading />;
```

---

#### Toggle (`toggle.tsx`)

Toggle switch component.

```tsx
import { Toggle } from "@/components/ui/toggle";

<Toggle pressed={isPressed} onPressedChange={setIsPressed}>
  Toggle Option
</Toggle>
```

---

### Utility Components

#### Search Bar (`search-bar.tsx`)

Search input with icon.

```tsx
import { SearchBar } from "@/components/ui/search-bar";

<SearchBar
  placeholder="Search jobs..."
  value={searchTerm}
  onChange={setSearchTerm}
/>
```

---

## Landing Page Components

Located in `components/` (root level)

### Navbar (`navbar.tsx`)

Main navigation bar.

```tsx
import Navbar from "@/components/navbar";

<Navbar />
```

**Features:**
- Logo with link to home
- Navigation links
- Auth buttons (Login/Register)
- Mobile responsive menu
- Theme toggle

---

### HeroSection (`hero-section.tsx`)

Main hero banner with CTA.

```tsx
import { HeroSection } from "@/components/hero-section";

<HeroSection />
```

**Contains:**
- Headline and subheadline
- Search functionality
- CTA buttons
- Hero image/illustration

---

### FeaturedCompanies (`FeaturedCompanies.tsx`)

Company logos carousel.

```tsx
import { FeaturedCompanies } from "@/components/FeaturedCompanies";

<FeaturedCompanies />
```

---

### FeaturedJobs (`FeaturedJobs.tsx`)

Job listings preview on homepage.

```tsx
import FeaturedJobs from "@/components/FeaturedJobs";

<FeaturedJobs />
```

---

### HowItWorksSection (`how-it-works-section.tsx`)

Process explanation section.

```tsx
import { HowItWorksSection } from "@/components/how-it-works-section";

<HowItWorksSection />
```

**Steps displayed:**
1. Create Profile
2. Search Jobs
3. Apply
4. Get Hired

---

### BenefitsSection (`benefits-section.tsx`)

Platform benefits display.

```tsx
import { BenefitsSection } from "@/components/benefits-section";

<BenefitsSection />
```

---

### TestimonialsSection (`testimonials-sections.tsx`)

User testimonials carousel.

```tsx
import { TestimonialsSection } from "@/components/testimonials-sections";

<TestimonialsSection />
```

---

### Footer (`footer-section.tsx`)

Site footer with links.

```tsx
import Footer from "@/components/footer-section";

<Footer />
```

**Contains:**
- Logo
- Navigation links
- Social media links
- Copyright info

---

## Signup Wizard Components

Located in `src/app/signup/components/`

### Step Components

Each step handles a specific part of the registration:

#### 1. JobTypesStep

```tsx
import { JobTypesStep } from "./components/JobTypesStep";

<JobTypesStep
  formData={formData}
  handleChange={handleChange}
  handleCheckboxChange={handleCheckboxChange}
/>
```

**Captures:** Job types interested in (RN, EN, etc.)

---

#### 2. ShiftPreferenceStep

```tsx
import { ShiftPreferenceStep } from "./components/ShiftPreferanceStep";

<ShiftPreferenceStep {...stepProps} />
```

**Captures:** Preferred shift times (Day, Afternoon, Night, etc.)

---

#### 3. StartTimeStep

```tsx
import { StartTimeStep } from "./components/StartTimeStep";

<StartTimeStep {...stepProps} />
```

**Captures:** When they can start (Immediately, specific date)

---

#### 4. JobSearchStatusStep

```tsx
import { JobSearchStatusStep } from "./components/JobSearchStatusStep";

<JobSearchStatusStep {...stepProps} />
```

**Captures:** Current job search status

---

#### 5. QualificationStep

```tsx
import { QualificationStep } from "./components/QualificationStep";

<QualificationStep {...stepProps} />
```

**Captures:** Nursing qualifications

---

#### 6. WorkingInHealthcareStep

```tsx
import { WorkingInHealthcareStep } from "./components/WorkingInHealthcareStep";

<WorkingInHealthcareStep {...stepProps} />
```

**Captures:** Work experience details

---

#### 7. LocationPreferenceStep

```tsx
import { LocationPreferenceStep } from "./components/LocationPreferenceStep";

<LocationPreferenceStep {...stepProps} />
```

**Captures:** Preferred work locations

---

#### 8. CertificationsStep

```tsx
import { CertificationsStep } from "./components/CertificationsStep";

<CertificationsStep {...stepProps} />
```

**Captures:** Professional certifications

---

#### 9. ResidencyVisaStep

```tsx
import { ResidencyVisaStep } from "./components/ResidencyVisaStep";

<ResidencyVisaStep {...stepProps} />
```

**Captures:** Residency/visa status and work restrictions

---

#### 10. ContactPasswordStep

```tsx
import { ContactPasswordStep } from "./components/ContactPasswordStep";

<ContactPasswordStep
  formData={formData}
  handleChange={handleChange}
/>
```

**Captures:** Contact details, location, password

---

### Form Data Type

```typescript
// src/app/signup/types/FormTypes.ts
interface FormDataType {
  jobTypes: string;
  openToOtherTypes: string;
  startTime: string;
  startDate: string;
  jobSearchStatus: string;
  qualification: string;
  shiftPreferences: string[];
  otherQualification: string;
  workingInHealthcare: string;
  experience: string;
  organisation: string;
  locationPreference: string;
  preferredLocations: string[];
  certifications: string[];
  residencyStatus: string;
  visaType: string;
  visaDuration: string;
  workHoursRestricted: string;
  maxWorkHours: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  postcode: string;
  currentResidentialLocation: string;
  termsAccepted: boolean;
  visibilityStatus: string;
  photoIdFile: File | null;
}
```

---

## Dashboard Components

### Nurse Dashboard (`src/app/nurseProfile/components/`)

#### Navbar

```tsx
import { Navbar } from "./components/Navbar";

<Navbar />
```

**Features:**
- User greeting
- Navigation links
- Logout button
- Profile access

---

#### Jobdata

```tsx
import Jobdata from "./components/Jobdata";

<Jobdata />
```

**Features:**
- Job listings grid
- Filtering options
- Pagination

---

#### JobFilters

```tsx
import JobFilters from "./components/JobFilters";

<JobFilters
  filters={filters}
  onFilterChange={setFilters}
/>
```

---

#### NotificationSidebar

```tsx
import NotificationSidebar from "./components/NotificationSidebar";

<NotificationSidebar />
```

---

### Employer Dashboard (`src/app/EmployerDashboard/components/`)

#### EmployerNavbar

```tsx
import EmployerNavbar from "./components/EmployerNavbar";

<EmployerNavbar />
```

---

#### RichTextEditor (TipTap)

```tsx
import RichTextEditor from "./components/RichTextEditor";

<RichTextEditor
  content={description}
  onChange={setDescription}
/>
```

**Features:**
- Bold, italic, underline
- Lists (ordered, unordered)
- Links
- Headings

---

#### CandidateFilters

```tsx
import CandidateFilters from "./components/CandidateFilters";

<CandidateFilters
  filters={filters}
  onFilterChange={setFilters}
/>
```

---

### Admin Dashboard (`src/app/Admin/components/`)

#### Layout Components

```tsx
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import LeftSidebar from "./layout/LeftSidebar";
import RightContent from "./layout/RightContent";

<div className="admin-layout">
  <Header />
  <LeftSidebar />
  <RightContent>
    {children}
  </RightContent>
  <Footer />
</div>
```

---

#### View Components

```tsx
import Dashboard from "./views/Dashboard";
import Employers from "./views/Employers";
import Nurses from "./views/Nurses";
import Connections from "./views/Connections";

// Dashboard with view switching
{currentView === 'dashboard' && <Dashboard />}
{currentView === 'employers' && <Employers />}
{currentView === 'nurses' && <Nurses />}
```

---

#### Navigation Components

```tsx
import Navigation from "./navigation/Navigation";
import SidebarItem from "./navigation/SidebarItem";

<Navigation>
  <SidebarItem
    icon={<DashboardIcon />}
    label="Dashboard"
    active={isActive}
    onClick={handleClick}
  />
</Navigation>
```

---

#### Delete Modal

```tsx
import DeleteModal from "./deleteModal";

<DeleteModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleDelete}
  title="Delete User"
  message="Are you sure you want to delete this user?"
/>
```

---

## Page Structure

### Homepage (`src/app/page.tsx`)

```tsx
<main>
  <Navbar />
  <HeroSection />
  <FeaturedCompanies />
  <HowItWorksSection />
  <BenefitsSection />
  <FeaturedJobs />
  <TestimonialsSection />
  <Footer />
</main>
```

---

### Nurse Signup (`src/app/signup/page.tsx`)

```tsx
<div className="min-h-screen">
  <Navbar />

  <div className="flex">
    {/* Left: Benefits Card */}
    <aside className="hidden lg:block">
      <BenefitsCard />
      <LoginLink />
    </aside>

    {/* Right: Form */}
    <main>
      <ProgressBar steps={10} current={currentStep} />
      <FormContainer>
        {renderStep(currentStep)}
        <NavigationButtons />
      </FormContainer>
    </main>
  </div>

  <Footer />
</div>
```

---

### Nurse Dashboard (`src/app/nurseProfile/page.tsx`)

```tsx
<>
  <Navbar />
  <Suspense fallback={<Loading />}>
    <Jobdata />
  </Suspense>
  <Footer />
</>
```

---

### Employer Dashboard (`src/app/EmployerDashboard/page.tsx`)

```tsx
<div className="bg-gray-50 min-h-screen">
  <EmployerNavbar />

  <main className="container mx-auto">
    <div className="flex gap-6">
      {/* Left Column */}
      <div className="flex-1">
        <CompanyProfileCard />
        <ActionCards /> {/* Talent Pool, Post Job */}
      </div>

      {/* Right Column */}
      <aside className="hidden lg:block">
        <HelpCard />
      </aside>
    </div>

    <JobPostingsTable />
  </main>

  <Footer />
</div>
```

---

## Styling Patterns

### Tailwind CSS Conventions

```tsx
// Responsive design
<div className="px-4 md:px-6 lg:px-8">

// Dark mode support
<div className="bg-white dark:bg-gray-900">

// Flexbox layouts
<div className="flex items-center justify-between gap-4">

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Card styling
<div className="bg-white rounded-lg shadow-sm p-6">

// Button styling
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
```

---

### Color Palette

```css
/* Primary Colors */
--primary: #61A6FA;
--primary-hover: #58A6F9;
--primary-dark: #1F3C88;

/* Neutral Colors */
--background: #F5F6FA;
--card: #FFFFFF;
--text: #1F2937;
--text-muted: #6B7280;

/* Status Colors */
--success: #10B981;
--error: #EF4444;
--warning: #F59E0B;
```

---

### Animation Classes

```tsx
// From tw-animate-css
<div className="animate-slide-in-left">
<div className="animate-slide-in-right">
<div className="animate-fade-in">

// Custom loading animation
<svg className="animate-dash">
```

---

## Theme Provider

### ThemeWrapper (`src/app/ThemeWrapper.tsx`)

```tsx
import { ThemeProvider } from "next-themes";

export default function ThemeWrapper({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  );
}
```

### ThemeToggle (`src/components/ThemeToggle.tsx`)

```tsx
import ThemeToggle from "@/components/ThemeToggle";

<ThemeToggle />
```

---

## Icon Libraries

### Lucide React (Primary)

```tsx
import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  User,
  Settings,
  LogOut,
  ChevronRight,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

<Search className="w-5 h-5" />
```

---

### Heroicons

```tsx
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSolid } from "@heroicons/react/24/solid";

<HomeIcon className="h-6 w-6" />
```

---

### React Icons

```tsx
import { FaGoogle, FaLinkedin } from "react-icons/fa";

<FaGoogle className="w-5 h-5" />
```

---

## Best Practices

### Component Organization

1. **One component per file** - Keep components focused
2. **Colocation** - Place related components together
3. **Index exports** - Use index.ts for cleaner imports

### Props Pattern

```tsx
interface ComponentProps {
  title: string;
  description?: string;
  onAction: () => void;
  children?: React.ReactNode;
}

export function Component({
  title,
  description,
  onAction,
  children,
}: ComponentProps) {
  // ...
}
```

### State Management

```tsx
// Local state for UI
const [isOpen, setIsOpen] = useState(false);

// Form state with React Hook Form
const form = useForm<FormData>();

// Auth state from context
const { isAuthenticated, user, logout } = useAuth();
```

---

**Document Version:** 1.0
**Last Updated:** December 2025
