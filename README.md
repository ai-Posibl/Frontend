# Posibl Voice - AI Campaign Management Frontend

A modern Next.js frontend application for managing AI-powered voice campaigns with real-time analytics, call processing, and intelligent transcript analysis.

## 🌟 Overview

This frontend provides a comprehensive dashboard for:
- Creating and managing voice campaigns with AI agents
- Viewing real-time call analytics and performance metrics
- Analyzing call transcripts with AI-extracted insights
- Managing contacts through CSV imports and bulk operations
- Monitoring campaign progress with detailed reporting

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend Application                        │
├─────────────────────────────────────────────────────────────────┤
│  App Router (Next.js 14)    │    Component Library (shadcn/ui)  │
│  ├── Authentication         │    ├── Form Components            │
│  ├── Campaign Management    │    ├── Data Tables                │
│  ├── Call Analytics         │    ├── Charts & Visualizations    │
│  └── Agent Configuration    │    └── UI Primitives              │
├─────────────────────────────────────────────────────────────────┤
│  State Management (React)   │    API Integration (Custom)       │
│  ├── React Hooks           │    ├── Authentication Client       │
│  ├── Form Validation       │    ├── Campaign API                │
│  └── Real-time Updates     │    └── Call Management API         │
├─────────────────────────────────────────────────────────────────┤
│  Styling (Tailwind CSS)    │    Animations (Framer Motion)     │
│  ├── Responsive Design     │    ├── Page Transitions           │
│  ├── Dark/Light Themes     │    ├── Interactive Elements       │
│  └── Component Styling     │    └── Loading States             │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                      ┌─────────────────────────┐
                      │    Backend API          │
                      │  (Node.js + Express)    │
                      └─────────────────────────┘
```

## 🚀 Features

### Dashboard & Analytics
- **Real-time Metrics**: Live campaign performance tracking
- **Call Analytics**: Success rates, duration statistics, sentiment analysis
- **Visual Charts**: Interactive graphs for campaign insights
- **Export Capabilities**: Download reports and call data

### Campaign Management
- **Campaign Creation**: Step-by-step campaign setup wizard
- **AI Agent Selection**: Choose from configured AI agents with voice samples
- **Scheduling**: Set date/time for campaign execution
- **Contact Import**: CSV upload with template download
- **Bulk Operations**: Create multiple calls from contact lists

### Call Processing & Analysis
- **Call History**: Detailed view of all campaign calls
- **Transcript Viewer**: Real-time display of call conversations
- **AI Insights**: Extracted information from Gemini AI processing
- **Sentiment Analysis**: Visual sentiment scoring and trends
- **Smart Highlights**: Auto-generated call highlights and key points

### Contact Management
- **CSV Import**: Bulk contact upload with validation
- **Contact Profiles**: Detailed contact information and history
- **Custom Fields**: Support for additional contact metadata
- **Do-Not-Call Lists**: Compliance management features

### AI Agent Configuration
- **Agent Profiles**: Configure AI agents with custom prompts
- **Voice Settings**: Select voice types and languages
- **Behavior Customization**: Define agent responses and objectives
- **Version Control**: Manage agent updates and rollbacks

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **UI Components**: shadcn/ui component library
- **Animations**: Framer Motion for smooth interactions
- **Forms**: React Hook Form with validation
- **Charts**: Custom chart components with D3.js
- **Authentication**: JWT-based auth with secure storage
- **State Management**: React hooks and context
- **HTTP Client**: Custom API client with error handling

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running on localhost:3000
- Modern web browser (Chrome, Firefox, Safari, Edge)

## ⚡ Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd Frontend-master
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Setup
Create a `.env.local` file:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Posibl Voice

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3001

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### 3. Start Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

## 📱 Application Structure

```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── campaigns/
│   ├── [id]/
│   │   ├── info/
│   │   │   ├── call-history/
│   │   │   │   └── [callId]/     # Individual call details
│   │   │   ├── page.tsx          # Campaign overview
│   │   │   └── components/       # Campaign-specific components
│   │   └── page.tsx              # Campaign details
│   └── page.tsx                  # Campaign list
├── create-campaign/
│   └── page.tsx                  # Campaign creation wizard
├── agents/
│   └── page.tsx                  # AI agent management
├── contacts/
│   └── page.tsx                  # Contact management
├── dashboard/
│   └── page.tsx                  # Main dashboard
├── layout.tsx                    # Root layout
└── page.tsx                      # Landing page

components/
├── ui/                           # shadcn/ui components
├── dashboard-layout.tsx          # Main app layout
├── campaign-wizard/              # Campaign creation components
├── call-analytics/               # Analytics components
└── charts/                       # Custom chart components

lib/
├── api.ts                        # API client and endpoints
├── auth.ts                       # Authentication utilities
├── utils.ts                      # General utilities
└── validations.ts                # Form validation schemas

hooks/
├── use-auth.ts                   # Authentication hook
├── use-api.ts                    # API integration hook
└── use-analytics.ts              # Analytics hooks
```

## 🔐 Authentication Flow

### Login Process
1. User enters credentials on login page
2. Frontend sends request to `/api/auth/login`
3. Backend validates and returns JWT token
4. Token stored securely in localStorage/cookies
5. Subsequent requests include Authorization header
6. Protected routes check authentication status

### Route Protection
```typescript
// Example of protected route
function ProtectedPage() {
  return withAuth(MyComponent)
}

// Authentication wrapper
export const withAuth = (Component: React.ComponentType) => {
  return function AuthenticatedComponent(props: any) {
    const { user, loading } = useAuth()
    
    if (loading) return <LoadingSpinner />
    if (!user) return <LoginRedirect />
    
    return <Component {...props} />
  }
}
```

## 📊 API Integration

### Custom API Client
```typescript
// lib/api.ts
class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL
  
  async request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...options?.headers
      },
      ...options
    })
    
    if (!response.ok) {
      throw new ApiError(response.status, await response.json())
    }
    
    return response.json()
  }
}
```

### API Endpoints Integration
```typescript
// Campaign Management
export const campaignApi = {
  getAll: () => apiClient.get<Campaign[]>('/campaigns'),
  getById: (id: string) => apiClient.get<Campaign>(`/campaigns/${id}`),
  create: (data: CreateCampaignDto) => apiClient.post<Campaign>('/campaigns', data),
  update: (id: string, data: UpdateCampaignDto) => apiClient.put<Campaign>(`/campaigns/${id}`, data)
}

// Call Management
export const callApi = {
  getAll: (params?: CallQueryParams) => apiClient.get<Call[]>('/calls', { params }),
  getById: (id: string) => apiClient.get<CallDetail>(`/calls/${id}`),
  bulkCreate: (data: BulkCreateCallsDto) => apiClient.post<BulkCreateResponse>('/calls/bulk', data)
}

// Agent Management
export const agentApi = {
  getAll: () => apiClient.get<Agent[]>('/agents'),
  create: (data: CreateAgentDto) => apiClient.post<Agent>('/agents', data)
}
```

## 🎨 UI Components & Design System

### shadcn/ui Integration
```bash
# Install new components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
```

### Custom Components
```typescript
// components/campaign-wizard/step-one.tsx
export function StepOne({ onNext, onBack }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <FormField
        control={control}
        name="campaignName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Campaign Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter campaign name" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </motion.div>
  )
}
```

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions for mobile devices
- Adaptive layouts for different screen sizes

## 📈 Data Visualization

### Call Analytics Charts
```typescript
// components/charts/call-performance-chart.tsx
export function CallPerformanceChart({ data }: { data: CallMetrics[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="successRate" 
          stroke="#b5d333" 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

### Real-time Updates
```typescript
// hooks/use-real-time-metrics.ts
export function useRealTimeMetrics(campaignId: string) {
  const [metrics, setMetrics] = useState<Metrics>()
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await campaignApi.getMetrics(campaignId)
      setMetrics(data)
    }, 5000) // Update every 5 seconds
    
    return () => clearInterval(interval)
  }, [campaignId])
  
  return metrics
}
```

## 🎯 Key Features Deep Dive

### Campaign Creation Wizard

**Step 1: Basic Information**
- Campaign name input with validation
- AI agent selection with voice previews
- Agent description and capabilities display

**Step 2: Configuration**
- Date and time scheduling with date picker
- CSV contact upload with template download
- Concurrent call limits configuration
- Campaign settings and preferences

### Call Details Page

**Transcript Display**
- Real-time conversation view with role-based formatting
- Speaker identification (Agent vs Customer)
- Timestamp display for each message
- Fallback for raw transcript data

**AI-Generated Insights**
- Summary from Gemini AI processing
- Sentiment analysis with visual indicators
- Structured data extraction display
- Dynamic highlights generation

**Contact Information**
- Extracted contact details from AI processing
- Custom fields and additional information
- Contact history and interaction timeline

### Dashboard Analytics

**Campaign Overview**
- Active campaigns with status indicators
- Performance metrics and success rates
- Recent activity feed and notifications

**Call Metrics**
- Total calls, success rates, average duration
- Sentiment trends over time
- Geographic distribution of calls
- Agent performance comparisons

## 🔧 Configuration & Customization

### Theme Configuration
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#b5d333',
        secondary: '#000000',
        accent: '#f3f4f6',
        background: '#ffffff',
        foreground: '#000000'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  }
}
```

### Environment Variables
```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional
NEXT_PUBLIC_APP_NAME=Posibl Voice
NEXT_PUBLIC_COMPANY_NAME=Your Company
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourcompany.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## 🧪 Testing

### Component Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### E2E Testing
```bash
# Run Cypress tests
npm run cypress:open

# Run headless tests
npm run cypress:run
```

### Manual Testing Checklist
- [ ] User authentication (login/logout)
- [ ] Campaign creation wizard flow
- [ ] CSV upload and contact import
- [ ] Call details and transcript viewing
- [ ] Agent selection and configuration
- [ ] Dashboard analytics display
- [ ] Responsive design on mobile
- [ ] Error handling and edge cases

## 🚀 Deployment

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t posibl-voice-frontend .
docker run -p 3001:3000 posibl-voice-frontend
```

### Environment-Specific Builds
```json
// package.json
{
  "scripts": {
    "build:staging": "NEXT_PUBLIC_API_URL=https://api-staging.yourapp.com npm run build",
    "build:production": "NEXT_PUBLIC_API_URL=https://api.yourapp.com npm run build"
  }
}
```

## 🔍 Performance Optimization

### Next.js Optimizations
- **Static Generation**: Pre-render pages at build time
- **Image Optimization**: Automatic WebP conversion and lazy loading
- **Bundle Analysis**: Monitor and optimize bundle size
- **Code Splitting**: Automatic route-based code splitting

### Performance Monitoring
```typescript
// lib/analytics.ts
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

export function trackEvent(action: string, category: string, label?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    })
  }
}
```

## 🔒 Security Best Practices

### Authentication Security
- JWT tokens stored securely (httpOnly cookies preferred)
- Automatic token refresh before expiration
- Logout on token invalidation
- CSRF protection for forms

### Data Validation
```typescript
// lib/validations.ts
export const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(100),
  agentId: z.string().uuid('Invalid agent ID'),
  scheduledAt: z.date().min(new Date(), 'Date must be in the future'),
  contacts: z.array(contactSchema).min(1, 'At least one contact required')
})
```

### Content Security Policy
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ]
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Clear all caches
rm -rf .next node_modules package-lock.json
npm install
```

**API Connection Issues**
```typescript
// Check API connectivity
const healthCheck = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
    console.log('API Status:', response.ok ? 'Connected' : 'Disconnected')
  } catch (error) {
    console.error('API Connection Error:', error)
  }
}
```

**Authentication Problems**
- Check JWT token expiration
- Verify API_URL environment variable
- Clear browser localStorage/cookies
- Check backend CORS configuration

**Performance Issues**
```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
npm run build && npm run start
# Monitor in browser dev tools
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Follow code style guidelines (ESLint + Prettier)
4. Write tests for new functionality
5. Update documentation as needed
6. Submit pull request with detailed description

### Code Style
```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check
```

### Component Guidelines
- Use TypeScript for all components
- Implement proper error boundaries
- Add loading states for async operations
- Ensure accessibility (ARIA labels, keyboard navigation)
- Follow naming conventions (PascalCase for components)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the backend README for API-related issues

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for modern AI-powered campaign management
