# The 6-Second Test™ - Deployment Guide & Phase 2 Implementation Plan

This guide provides detailed instructions for deploying The 6-Second Test™ to production and implementing Phase 2 automation features.

## Part 1: Deployment Process

### Step 1: Choose a Hosting Platform

For a Next.js application, we recommend one of the following platforms:

1. **Vercel** (Recommended)
   - Built by the creators of Next.js
   - Optimized for Next.js applications
   - Seamless deployment from GitHub
   - Free tier available for personal projects

2. **Netlify**
   - Easy deployment from GitHub
   - Good support for Next.js
   - Free tier available

3. **AWS Amplify**
   - Fully managed CI/CD and hosting service
   - Good for enterprise applications
   - Integrates with other AWS services

### Step 2: Prepare Your Repository

1. Ensure your code is in a Git repository (GitHub, GitLab, or Bitbucket)
2. Make sure all environment variables are properly documented but not committed to the repository
3. Verify that all dependencies are listed in package.json
4. Run a final test of the application locally to ensure everything works

### Step 3: Deploy to Vercel (Recommended)

1. Create an account on [Vercel](https://vercel.com)
2. Connect your GitHub/GitLab/Bitbucket account
3. Import your repository
4. Configure the project:
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)
5. Add environment variables:
   ```
   STRIPE_SECRET_KEY=sk_live_...  # Use live keys for production
   STRIPE_PRICE_ID=price_...
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
6. Deploy the project

### Step 4: Set Up Custom Domain

1. In your Vercel dashboard, go to your project settings
2. Navigate to the "Domains" section
3. Add your custom domain (e.g., six-second-test.com)
4. Follow Vercel's instructions to configure DNS settings with your domain registrar
5. Wait for DNS propagation (can take up to 48 hours, but usually much faster)

### Step 5: Configure Stripe for Production

1. Switch to Stripe live mode in your Stripe dashboard
2. Update your Stripe webhook endpoints to point to your production URL
3. Test a live transaction to ensure everything works correctly
4. Update your environment variables in Vercel to use live Stripe keys

### Step 6: Monitor and Test

1. Test the complete user flow on the live site
2. Set up monitoring for your application (Vercel Analytics, Google Analytics, etc.)
3. Create a process for handling customer support inquiries

## Part 2: Phase 2 Implementation Plan

Phase 2 involves moving from manual report generation to partial automation. Here's a detailed implementation plan:

### 1. PDF Text Extraction

#### Technology Options:

1. **pdf.js-extract**
   ```bash
   npm install pdf.js-extract
   ```

2. **pdf-parse**
   ```bash
   npm install pdf-parse
   ```

#### Implementation Steps:

1. Create a new API endpoint for processing uploaded PDFs:

```typescript
// app/api/process-pdf/route.ts
import { createClient } from '@supabase/supabase-js';
import * as pdfParse from 'pdf-parse';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { fileId } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Download the file from Supabase
    const { data, error } = await supabase
      .storage
      .from('resumes')
      .download(fileId);
      
    if (error || !data) {
      return Response.json({ error: 'Failed to download file' }, { status: 400 });
    }
    
    // Extract text from PDF
    const pdfData = await pdfParse(await data.arrayBuffer());
    const extractedText = pdfData.text;
    
    // Store the extracted text in Supabase
    const { error: updateError } = await supabase
      .from('resume_analysis')
      .insert({
        file_id: fileId,
        extracted_text: extractedText,
        status: 'text_extracted'
      });
      
    if (updateError) {
      return Response.json({ error: 'Failed to store extracted text' }, { status: 500 });
    }
    
    return Response.json({ success: true, textLength: extractedText.length });
  } catch (error) {
    console.error('PDF processing error:', error);
    return Response.json({ error: 'Failed to process PDF' }, { status: 500 });
  }
}
```

2. Create a database table in Supabase to store the extracted text and analysis:

```sql
CREATE TABLE resume_analysis (
  id SERIAL PRIMARY KEY,
  file_id TEXT REFERENCES storage.objects(id),
  email TEXT NOT NULL,
  extracted_text TEXT,
  status TEXT NOT NULL,
  credibility_score FLOAT,
  impact_score FLOAT,
  clarity_score FLOAT,
  analysis_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. AI Evaluation Implementation

#### Technology Options:

1. **OpenAI API**
   ```bash
   npm install openai
   ```

2. **Anthropic Claude API**
   ```bash
   npm install @anthropic-ai/sdk
   ```

#### Implementation Steps:

1. Create a new API endpoint for AI analysis:

```typescript
// app/api/analyze-resume/route.ts
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { fileId } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get the extracted text
    const { data, error } = await supabase
      .from('resume_analysis')
      .select('extracted_text, email')
      .eq('file_id', fileId)
      .single();
      
    if (error || !data) {
      return Response.json({ error: 'Failed to retrieve extracted text' }, { status: 400 });
    }
    
    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Prepare the prompt
    const prompt = `
    Analyze the following resume text based on The 6-Second Test™ framework:
    
    1. Credibility Alignment: Does the level of responsibility align with the level of impact claimed?
    2. Impact Compression: Can a recruiter quickly see the value this person created?
    3. Outcome Clarity: What changed because of this person?
    
    For each dimension, provide:
    - A score from 1-10
    - Specific examples from the resume
    - Actionable recommendations for improvement
    
    Resume Text:
    ${data.extracted_text}
    
    Format your response as JSON with the following structure:
    {
      "credibility": {
        "score": number,
        "examples": string[],
        "recommendations": string[]
      },
      "impact": {
        "score": number,
        "examples": string[],
        "recommendations": string[]
      },
      "clarity": {
        "score": number,
        "examples": string[],
        "recommendations": string[]
      },
      "overall_score": number,
      "summary": string
    }
    `;
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert resume analyst for recruiters." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    const analysisResult = JSON.parse(completion.choices[0].message.content);
    
    // Calculate overall score
    const overallScore = (
      analysisResult.credibility.score + 
      analysisResult.impact.score + 
      analysisResult.clarity.score
    ) / 3;
    
    // Update the database with the analysis results
    const { error: updateError } = await supabase
      .from('resume_analysis')
      .update({
        credibility_score: analysisResult.credibility.score,
        impact_score: analysisResult.impact.score,
        clarity_score: analysisResult.clarity.score,
        analysis_json: analysisResult,
        status: 'analyzed'
      })
      .eq('file_id', fileId);
      
    if (updateError) {
      return Response.json({ error: 'Failed to store analysis results' }, { status: 500 });
    }
    
    return Response.json({ 
      success: true, 
      overallScore,
      email: data.email
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    return Response.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}
```

2. Add the OpenAI API key to your environment variables:

```
OPENAI_API_KEY=sk-...
```

### 3. Report Generation

#### Implementation Steps:

1. Create a report generation function:

```typescript
// app/api/generate-report/route.ts
import { createClient } from '@supabase/supabase-js';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import ReportTemplate from '@/components/ReportTemplate';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { fileId } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get the analysis results
    const { data, error } = await supabase
      .from('resume_analysis')
      .select('*')
      .eq('file_id', fileId)
      .single();
      
    if (error || !data) {
      return Response.json({ error: 'Failed to retrieve analysis results' }, { status: 400 });
    }
    
    // Generate HTML report
    const reportHtml = renderToString(
      createElement(ReportTemplate, { 
        analysis: data.analysis_json,
        credibilityScore: data.credibility_score,
        impactScore: data.impact_score,
        clarityScore: data.clarity_score,
        email: data.email
      })
    );
    
    // Store the report in Supabase
    const { error: updateError } = await supabase
      .from('resume_analysis')
      .update({
        report_html: reportHtml,
        status: 'report_generated'
      })
      .eq('file_id', fileId);
      
    if (updateError) {
      return Response.json({ error: 'Failed to store report' }, { status: 500 });
    }
    
    return Response.json({ 
      success: true, 
      email: data.email
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return Response.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
```

2. Create a React component for the report template:

```tsx
// components/ReportTemplate.tsx
import React from 'react';

interface AnalysisSection {
  score: number;
  examples: string[];
  recommendations: string[];
}

interface Analysis {
  credibility: AnalysisSection;
  impact: AnalysisSection;
  clarity: AnalysisSection;
  overall_score: number;
  summary: string;
}

interface ReportTemplateProps {
  analysis: Analysis;
  credibilityScore: number;
  impactScore: number;
  clarityScore: number;
  email: string;
}

const ReportTemplate: React.FC<ReportTemplateProps> = ({
  analysis,
  credibilityScore,
  impactScore,
  clarityScore,
  email
}) => {
  const overallScore = (credibilityScore + impactScore + clarityScore) / 3;
  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>The 6-Second Test™ Results</h1>
        <p>Prepared for: {email}</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Your Recruiter Readiness Score: {overallScore.toFixed(1)}/10</h2>
        <p>{analysis.summary}</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Dimension 1: Credibility Alignment</h2>
        <p><strong>Score: {credibilityScore.toFixed(1)}/10</strong></p>
        <h3>Examples from your resume:</h3>
        <ul>
          {analysis.credibility.examples.map((example, index) => (
            <li key={index}>{example}</li>
          ))}
        </ul>
        <h3>Recommendations:</h3>
        <ul>
          {analysis.credibility.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Dimension 2: Impact Compression</h2>
        <p><strong>Score: {impactScore.toFixed(1)}/10</strong></p>
        <h3>Examples from your resume:</h3>
        <ul>
          {analysis.impact.examples.map((example, index) => (
            <li key={index}>{example}</li>
          ))}
        </ul>
        <h3>Recommendations:</h3>
        <ul>
          {analysis.impact.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Dimension 3: Outcome Clarity</h2>
        <p><strong>Score: {clarityScore.toFixed(1)}/10</strong></p>
        <h3>Examples from your resume:</h3>
        <ul>
          {analysis.clarity.examples.map((example, index) => (
            <li key={index}>{example}</li>
          ))}
        </ul>
        <h3>Recommendations:</h3>
        <ul>
          {analysis.clarity.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginTop: '50px', borderTop: '1px solid #ccc', paddingTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>The 6-Second Test™ is designed to simulate a recruiter's first-pass resume skim and provide actionable feedback.</p>
        <p>© {new Date().getFullYear()} The 6-Second Test. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ReportTemplate;
```

### 4. Workflow Orchestration

Create a workflow orchestration script to automate the entire process:

```typescript
// scripts/process-uploads.js
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function processNewUploads() {
  console.log('Checking for new uploads...');
  
  // Get list of files that haven't been processed
  const { data: files, error } = await supabase
    .from('resume_analysis')
    .select('file_id')
    .eq('status', 'uploaded');
    
  if (error) {
    console.error('Error fetching unprocessed files:', error);
    return;
  }
  
  console.log(`Found ${files.length} unprocessed files`);
  
  // Process each file
  for (const file of files) {
    console.log(`Processing file: ${file.file_id}`);
    
    try {
      // Step 1: Extract text
      const extractResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/process-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: file.file_id })
      });
      
      const extractResult = await extractResponse.json();
      if (!extractResult.success) {
        console.error(`Failed to extract text from ${file.file_id}:`, extractResult.error);
        continue;
      }
      
      console.log(`Text extracted from ${file.file_id}, length: ${extractResult.textLength}`);
      
      // Step 2: Analyze with AI
      const analyzeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analyze-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: file.file_id })
      });
      
      const analyzeResult = await analyzeResponse.json();
      if (!analyzeResult.success) {
        console.error(`Failed to analyze ${file.file_id}:`, analyzeResult.error);
        continue;
      }
      
      console.log(`Analysis completed for ${file.file_id}, score: ${analyzeResult.overallScore}`);
      
      // Step 3: Generate report
      const reportResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: file.file_id })
      });
      
      const reportResult = await reportResponse.json();
      if (!reportResult.success) {
        console.error(`Failed to generate report for ${file.file_id}:`, reportResult.error);
        continue;
      }
      
      console.log(`Report generated for ${file.file_id}, email: ${reportResult.email}`);
      
      // For Phase 2, we'll stop here. In Phase 3, we would add email delivery.
      
    } catch (error) {
      console.error(`Error processing ${file.file_id}:`, error);
    }
  }
}

// Run the process
processNewUploads().catch(console.error);
```

### 5. Setting Up a Cron Job

For automated processing, set up a cron job to run the workflow orchestration script regularly:

1. If using Vercel, you can use Vercel Cron Jobs:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/process-uploads",
      "schedule": "0 */2 * * *"
    }
  ]
}
```

2. Create the cron API endpoint:

```typescript
// app/api/cron/process-uploads/route.ts
import { processNewUploads } from '@/scripts/process-uploads';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // Check for authorization token
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Process uploads
    await processNewUploads();
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Cron job error:', error);
    return Response.json({ error: 'Failed to process uploads' }, { status: 500 });
  }
}
```

3. Add the CRON_SECRET to your environment variables:

```
CRON_SECRET=your-secure-random-string
```

## Part 3: Transition Plan

### Phase 1 to Phase 2 Transition

1. **Development Timeline**:
   - Week 1: Implement PDF text extraction
   - Week 2: Implement AI analysis
   - Week 3: Implement report generation
   - Week 4: Testing and refinement

2. **Testing Strategy**:
   - Test with existing manual reports to compare AI-generated results
   - Conduct A/B testing with a subset of new users
   - Gather feedback on report quality and accuracy

3. **Rollout Strategy**:
   - Start with a small percentage of new uploads (10%)
   - Gradually increase to 50% while monitoring quality
   - Full transition once quality metrics are satisfactory

### Monitoring and Quality Control

1. **Quality Metrics**:
   - Consistency with manual reports (>90% agreement)
   - User satisfaction ratings
   - Report delivery time

2. **Monitoring Tools**:
   - Set up error tracking with Sentry or similar
   - Create a dashboard for processing status
   - Implement automated alerts for failures

## Part 4: Future Enhancements (Phase 3)

1. **Automated Email Delivery**:
   - Integrate with SendGrid or similar email service
   - Create HTML email templates
   - Set up delivery tracking

2. **User Dashboard**:
   - Allow users to view their reports online
   - Provide historical reports and improvement tracking
   - Add option to request follow-up analysis

3. **Analytics Integration**:
   - Track user engagement with reports
   - Analyze common resume issues
   - Create industry-specific benchmarks

4. **Testimonials and Social Proof**:
   - Collect user success stories
   - Create a testimonials page
   - Implement social sharing features

## Conclusion

This deployment guide and Phase 2 implementation plan provides a comprehensive roadmap for taking The 6-Second Test™ from its current manual beta phase to a partially automated service. By following these steps, you'll be able to scale the service beyond the initial 50-user cap while maintaining quality and improving the user experience.

The transition should be approached incrementally, with careful testing at each stage to ensure that the automated analysis maintains the quality standards established during the manual phase. With proper implementation, Phase 2 will significantly reduce the manual workload while preparing the groundwork for the fully automated Phase 3.