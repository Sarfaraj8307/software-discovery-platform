/**
 * Feature and integration taxonomy.
 *
 * Features are grouped because the comparison table and the category filter rail both
 * need to present ~100 capabilities without overwhelming the reader. Grouping is what
 * makes the density legible.
 */

export interface RawFeatureGroup {
  name: string;
  slug: string;
  features: string[];
}

export const RAW_FEATURE_GROUPS: RawFeatureGroup[] = [
  {
    name: "Platform & Administration",
    slug: "platform-administration",
    features: [
      "Role-Based Access Control",
      "Audit Log",
      "Custom Fields",
      "Sandbox Environment",
      "Bulk Import / Export",
      "Open API",
      "Webhooks",
      "SSO / SAML",
      "SCIM Provisioning",
      "Custom Branding",
      "Data Residency Options",
      "Uptime SLA",
      "Multi-Entity Support",
      "Custom Objects",
    ],
  },
  {
    name: "Reporting & Analytics",
    slug: "reporting-analytics",
    features: [
      "Dashboards",
      "Custom Report Builder",
      "Scheduled Reports",
      "Real-Time Metrics",
      "Cohort Analysis",
      "Funnel Analysis",
      "Attribution Modelling",
      "Data Export",
      "Anomaly Detection",
      "Benchmarking",
      "Forecast Modelling",
      "Drill-Down Analysis",
      "Pivot Tables",
      "Embedded Analytics",
    ],
  },
  {
    name: "Automation & Workflow",
    slug: "automation-workflow",
    features: [
      "Visual Workflow Builder",
      "Conditional Logic",
      "Scheduled Triggers",
      "Event Triggers",
      "Approval Workflows",
      "Email Sequences",
      "Lead Scoring",
      "Auto-Assignment",
      "Bulk Operations",
      "Template Library",
      "Webhook Actions",
      "AI-Suggested Actions",
    ],
  },
  {
    name: "Integrations & Extensibility",
    slug: "integrations-extensibility",
    features: [
      "Native App Marketplace",
      "Zapier Support",
      "REST API",
      "GraphQL API",
      "Prebuilt CRM Connector",
      "Prebuilt ERP Connector",
      "Bi-Directional Sync",
      "Cloud Storage Sync",
      "Calendar Sync",
      "Email Sync",
      "Payment Gateway",
      "E-Signature",
      "Communication APIs",
      "Custom Webhooks",
    ],
  },
  {
    name: "Security & Compliance",
    slug: "security-compliance",
    features: [
      "Two-Factor Authentication",
      "Encryption at Rest",
      "Encryption in Transit",
      "SOC 2 Type II",
      "ISO 27001",
      "GDPR Tooling",
      "HIPAA Ready",
      "Data Retention Policies",
      "IP Allowlisting",
      "Penetration Testing",
      "Field-Level Security",
      "Access Reviews",
      "Audit Trail Export",
      "DLP Controls",
    ],
  },
  {
    name: "Collaboration",
    slug: "collaboration",
    features: [
      "Comments & Mentions",
      "Shared Views",
      "Real-Time Co-Editing",
      "Activity Feed",
      "Task Assignment",
      "Notification Rules",
      "Guest Access",
      "Team Workspaces",
      "Approval Routing",
      "Version History",
    ],
  },
  {
    name: "Mobile & Accessibility",
    slug: "mobile-accessibility",
    features: [
      "iOS App",
      "Android App",
      "Offline Mode",
      "Push Notifications",
      "Responsive Web App",
      "WCAG 2.2 AA",
      "Screen Reader Support",
      "Keyboard Shortcuts",
      "Localisation",
      "RTL Support",
    ],
  },
  {
    name: "AI & Intelligence",
    slug: "ai-intelligence",
    features: [
      "AI Assistant",
      "Natural Language Search",
      "Predictive Scoring",
      "Auto-Categorisation",
      "Summarisation",
      "Anomaly Detection",
      "Recommendation Engine",
      "Sentiment Analysis",
      "Generative Content",
      "Custom Model Training",
    ],
  },
];

export interface RawIntegration {
  name: string;
  category: string;
}

export const RAW_INTEGRATIONS: RawIntegration[] = [
  /* CRM */
  { name: "HubSpot", category: "CRM" },
  { name: "Salesforce", category: "CRM" },
  { name: "Pipedrive", category: "CRM" },
  { name: "Zoho CRM", category: "CRM" },
  { name: "Microsoft Dynamics 365", category: "CRM" },

  /* Support */
  { name: "Zendesk", category: "Support" },
  { name: "Intercom", category: "Support" },
  { name: "Freshdesk", category: "Support" },
  { name: "Gorgias", category: "Support" },
  { name: "Front", category: "Support" },

  /* Communication */
  { name: "Slack", category: "Communication" },
  { name: "Microsoft Teams", category: "Communication" },
  { name: "Zoom", category: "Communication" },
  { name: "Google Meet", category: "Communication" },
  { name: "Discord", category: "Communication" },
  { name: "Twilio", category: "Communication" },
  { name: "SendGrid", category: "Communication" },
  { name: "Loom", category: "Communication" },
  { name: "RingCentral", category: "Communication" },
  { name: "Webex", category: "Communication" },

  /* Productivity */
  { name: "Google Workspace", category: "Productivity" },
  { name: "Microsoft 365", category: "Productivity" },
  { name: "Notion", category: "Productivity" },
  { name: "Asana", category: "Productivity" },
  { name: "Monday.com", category: "Productivity" },
  { name: "Trello", category: "Productivity" },
  { name: "ClickUp", category: "Productivity" },
  { name: "Jira", category: "Productivity" },
  { name: "Confluence", category: "Productivity" },
  { name: "Airtable", category: "Productivity" },
  { name: "Smartsheet", category: "Productivity" },
  { name: "Calendly", category: "Productivity" },
  { name: "Typeform", category: "Productivity" },
  { name: "SurveyMonkey", category: "Productivity" },

  /* Developer */
  { name: "GitHub", category: "Developer" },
  { name: "GitLab", category: "Developer" },
  { name: "Bitbucket", category: "Developer" },
  { name: "Azure DevOps", category: "Developer" },
  { name: "Jenkins", category: "Developer" },
  { name: "CircleCI", category: "Developer" },
  { name: "Postman", category: "Developer" },
  { name: "Docker", category: "Developer" },
  { name: "Kubernetes", category: "Developer" },
  { name: "Terraform", category: "Developer" },
  { name: "Sentry", category: "Developer" },
  { name: "Snyk", category: "Developer" },
  { name: "SonarQube", category: "Developer" },
  { name: "Supabase", category: "Developer" },
  { name: "Firebase", category: "Developer" },
  { name: "Retool", category: "Developer" },
  { name: "Vercel", category: "Developer" },
  { name: "Netlify", category: "Developer" },

  /* Finance */
  { name: "QuickBooks Online", category: "Finance" },
  { name: "Xero", category: "Finance" },
  { name: "NetSuite", category: "Finance" },
  { name: "Stripe", category: "Finance" },
  { name: "PayPal", category: "Finance" },
  { name: "BILL", category: "Finance" },
  { name: "Expensify", category: "Finance" },
  { name: "Ramp", category: "Finance" },
  { name: "Brex", category: "Finance" },
  { name: "Avalara", category: "Finance" },

  /* Commerce */
  { name: "Shopify", category: "Commerce" },
  { name: "WooCommerce", category: "Commerce" },
  { name: "BigCommerce", category: "Commerce" },
  { name: "Adobe Commerce", category: "Commerce" },
  { name: "Klaviyo", category: "Commerce" },
  { name: "Recharge", category: "Commerce" },

  /* Data */
  { name: "Snowflake", category: "Data" },
  { name: "Google BigQuery", category: "Data" },
  { name: "Databricks", category: "Data" },
  { name: "Amazon Redshift", category: "Data" },
  { name: "PostgreSQL", category: "Data" },
  { name: "MySQL", category: "Data" },
  { name: "MongoDB", category: "Data" },
  { name: "Redis", category: "Data" },
  { name: "Apache Kafka", category: "Data" },
  { name: "Fivetran", category: "Data" },
  { name: "dbt", category: "Data" },
  { name: "Airbyte", category: "Data" },
  { name: "Segment", category: "Data" },
  { name: "Elasticsearch", category: "Data" },
  { name: "Algolia", category: "Data" },
  { name: "Looker", category: "Data" },
  { name: "Tableau", category: "Data" },
  { name: "Power BI", category: "Data" },
  { name: "Metabase", category: "Data" },

  /* Cloud */
  { name: "Amazon Web Services", category: "Cloud" },
  { name: "Microsoft Azure", category: "Cloud" },
  { name: "Google Cloud", category: "Cloud" },
  { name: "Datadog", category: "Cloud" },
  { name: "New Relic", category: "Cloud" },
  { name: "Grafana", category: "Cloud" },
  { name: "PagerDuty", category: "Cloud" },

  /* Identity */
  { name: "Okta", category: "Identity" },
  { name: "Auth0", category: "Identity" },
  { name: "OneLogin", category: "Identity" },
  { name: "JumpCloud", category: "Identity" },
  { name: "Microsoft Entra ID", category: "Identity" },

  /* Marketing */
  { name: "Mailchimp", category: "Marketing" },
  { name: "ActiveCampaign", category: "Marketing" },
  { name: "Braze", category: "Marketing" },
  { name: "Iterable", category: "Marketing" },
  { name: "Marketo Engage", category: "Marketing" },
  { name: "Amplitude", category: "Marketing" },
  { name: "Mixpanel", category: "Marketing" },
  { name: "Google Analytics", category: "Marketing" },

  /* HR */
  { name: "Workday", category: "HR" },
  { name: "BambooHR", category: "HR" },
  { name: "Gusto", category: "HR" },
  { name: "Rippling", category: "HR" },
  { name: "Deel", category: "HR" },
  { name: "Greenhouse", category: "HR" },
  { name: "Lever", category: "HR" },

  /* Automation */
  { name: "Zapier", category: "Automation" },
  { name: "Make", category: "Automation" },
  { name: "Workato", category: "Automation" },
  { name: "Tray.io", category: "Automation" },
  { name: "MuleSoft", category: "Automation" },
  { name: "Boomi", category: "Automation" },

  /* Design */
  { name: "Figma", category: "Design" },
  { name: "Canva", category: "Design" },
  { name: "Adobe Creative Cloud", category: "Design" },
  { name: "InVision", category: "Design" },
  { name: "Miro", category: "Design" },
  { name: "Mural", category: "Design" },
  { name: "Bynder", category: "Design" },

  /* Legal */
  { name: "DocuSign", category: "Legal" },
  { name: "Adobe Acrobat Sign", category: "Legal" },

  /* Storage */
  { name: "Dropbox", category: "Storage" },
  { name: "Google Drive", category: "Storage" },
  { name: "OneDrive", category: "Storage" },
  { name: "Box", category: "Storage" },
  { name: "SharePoint", category: "Storage" },
  { name: "Amazon S3", category: "Storage" },

  /* Data Enrichment */
  { name: "ZoomInfo", category: "Data Enrichment" },
  { name: "Clearbit", category: "Data Enrichment" },
  { name: "Apollo.io", category: "Data Enrichment" },
];
