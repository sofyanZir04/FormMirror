# FormMirror - Privacy-friendly Form Analytics

FormMirror is a micro-SaaS application that helps website owners optimize their forms by analyzing user behavior at the field level. It shows time spent on each field, tracks where users abandon the form, and provides suggestions to improve conversions — without video recordings or invasive tracking.

## Features

- **Field-level Analytics**: Track time spent on each field, skip rates, and drop-off points
- **Privacy-first**: No video recordings or session replays; cookie-free by design
- **Simple Setup**: One JavaScript snippet to install, no configuration required
- **Real-time Dashboard**: Beautiful charts and statistics for form optimization
- **Project Management**: Create and manage multiple form tracking projects
- **Session Tracking**: Monitor user sessions and form completion rates

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Icons**: Lucide React

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd formmirror
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  form_selector TEXT DEFAULT 'form',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_events table
CREATE TABLE form_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  field_name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('focus', 'blur', 'input', 'submit', 'abandon')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER, -- in milliseconds
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_form_events_project_id ON form_events(project_id);
CREATE INDEX idx_form_events_created_at ON form_events(created_at);
CREATE INDEX idx_form_events_session_id ON form_events(session_id);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view events for own projects" ON form_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = form_events.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert form events" ON form_events
  FOR INSERT WITH CHECK (true);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### 1. Sign Up and Create a Project

1. Visit the application and sign up with your email
2. Create a new project and specify your form selector
3. Copy the generated tracking snippet

### 2. Install the Tracking Snippet

Add the tracking snippet to your website's `<head>` section:

```html
<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://your-domain.com/track.js';
  script.setAttribute('data-project-id', 'your-project-id');
  script.setAttribute('data-form-selector', 'form');
  document.head.appendChild(script);
})();
</script>
```

### 3. View Analytics

1. Go to your dashboard to see project overview
2. Click on a project to view detailed analytics
3. Analyze field-level statistics, time spent, and drop-off rates

## API Endpoints

### POST /api/track

Receives form tracking events from the JavaScript snippet.

**Request Body:**
```json
{
  "project_id": "uuid",
  "field_name": "email",
  "event_type": "focus|blur|input|submit|abandon",
  "timestamp": "2024-01-01T00:00:00Z",
  "duration": 1500,
  "session_id": "session_123"
}
```

## JavaScript Tracking Snippet

The tracking snippet (`/public/track.js`) automatically:

- Monitors form field interactions (focus, blur, input)
- Tracks form submissions and abandonments
- Calculates time spent on each field
- Sends data to the API endpoint
- Handles dynamically added forms
- Uses `navigator.sendBeacon` for reliable data transmission

## Privacy Features

- **No Video Recording**: Only tracks form interactions, not full sessions
- **Cookie-free**: No cookies or local storage used
- **Minimal Data**: Only collects necessary form interaction data
- **Session-based**: Data is tied to individual form sessions
- **User Control**: Users can easily remove the tracking script

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, email support@formmirror.com or create an issue in the repository.
