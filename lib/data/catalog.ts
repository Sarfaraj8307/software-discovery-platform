/**
 * Hand-authored catalogue: category taxonomy, vendors, products and their value
 * propositions.
 *
 * Why authored rather than generated: a directory lives or dies on the credibility of
 * its card copy. Repeated templated taglines are immediately visible on a category page
 * and destroy trust. Product names, vendors and websites are real and used descriptively
 * — exactly as a legitimate directory does. Ratings, review bodies, counts and pricing
 * are synthetic; see `seed.ts` and the demo-data disclosure in the footer.
 */

/** [name, vendor, domain, startingPrice|null, tagline] */
export type RawProduct = [
  name: string,
  vendor: string,
  domain: string,
  priceFrom: number | null,
  tagline: string,
];

export interface RawGroup {
  name: string;
  slug: string;
  /** Lucide icon name. */
  icon: string;
  description: string;
  subs: { name: string; slug: string }[];
  products: RawProduct[];
}

export const RAW_GROUPS: RawGroup[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    name: "CRM",
    slug: "crm",
    icon: "Users",
    description:
      "Customer relationship management platforms that hold the account record, the pipeline and the history of every buyer conversation.",
    subs: [
      { name: "Sales CRM", slug: "sales-crm" },
      { name: "Marketing CRM", slug: "marketing-crm" },
      { name: "Customer Success", slug: "customer-success-software" },
    ],
    products: [
      ["Salesforce Sales Cloud", "Salesforce", "salesforce.com", 25, "The reference CRM for enterprise revenue teams."],
      ["HubSpot CRM", "HubSpot", "hubspot.com", 0, "Free-forever CRM that scales into a full customer platform."],
      ["Zoho CRM", "Zoho", "zoho.com", 14, "Broad CRM suite with a strong price-to-capability ratio."],
      ["Pipedrive", "Pipedrive", "pipedrive.com", 14, "Visual pipeline CRM built around the sales conversation."],
      ["Freshsales", "Freshworks", "freshworks.com", 9, "AI-assisted sales CRM with phone and email built in."],
      ["Microsoft Dynamics 365 Sales", "Microsoft", "microsoft.com", 65, "CRM that inherits your Microsoft 365 and Power Platform estate."],
      ["Zendesk Sell", "Zendesk", "zendesk.com", 19, "Sales CRM paired natively with Zendesk support data."],
      ["Insightly", "Insightly", "insightly.com", 29, "CRM and project delivery on a single record."],
      ["Copper", "Copper", "copper.com", 12, "CRM that lives inside Google Workspace."],
      ["Nutshell", "Nutshell", "nutshell.com", 19, "Straightforward CRM for small sales teams."],
      ["SugarCRM", "SugarCRM", "sugarcrm.com", 49, "Highly configurable CRM with an on-premise option."],
      ["Creatio", "Creatio", "creatio.com", 25, "No-code CRM and workflow automation on one platform."],
      ["Close", "Close", "close.com", 29, "Calling-first CRM for high-velocity inside sales."],
    ],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    name: "Project Management",
    slug: "project-management",
    icon: "SquareKanban",
    description:
      "Work management, task tracking and resource planning tools that give teams a shared view of what is in flight and what ships next.",
    subs: [
      { name: "Task Management", slug: "task-management" },
      { name: "Resource Planning", slug: "resource-planning" },
      { name: "Portfolio Management", slug: "portfolio-management" },
    ],
    products: [
      ["Monday.com", "monday.com", "monday.com", 9, "A work OS that adapts to any team's process."],
      ["Asana", "Asana", "asana.com", 10.99, "Work management for cross-functional initiatives."],
      ["Jira", "Atlassian", "atlassian.com", 7.53, "The default tracker for software teams."],
      ["ClickUp", "ClickUp", "clickup.com", 7, "One app intended to replace the tool sprawl."],
      ["Trello", "Atlassian", "trello.com", 5, "Kanban boards anyone can learn in minutes."],
      ["Wrike", "Wrike", "wrike.com", 9.8, "Work management with enterprise-grade resource planning."],
      ["Smartsheet", "Smartsheet", "smartsheet.com", 9, "Spreadsheet-native work execution at scale."],
      ["Notion", "Notion Labs", "notion.so", 10, "Docs, wikis and projects in one connected workspace."],
      ["Basecamp", "37signals", "basecamp.com", 15, "Calm, deliberately opinionated project management."],
      ["Airtable", "Airtable", "airtable.com", 20, "Relational databases behind a spreadsheet interface."],
      ["Teamwork", "Teamwork.com", "teamwork.com", 8.99, "Client-work management built for agencies."],
      ["LiquidPlanner", "LiquidPlanner", "liquidplanner.com", 12, "Predictive scheduling for genuinely complex projects."],
      ["Height", "Height", "height.app", 6.99, "Autonomous project management with AI triage."],
    ],
  },

  /* ------------------------------------------------------------------ 3 */
  {
    name: "Marketing Automation",
    slug: "marketing-automation",
    icon: "Megaphone",
    description:
      "Campaign, lifecycle and lifecycle-messaging platforms that segment an audience, orchestrate journeys and measure what actually converted.",
    subs: [
      { name: "Email Marketing", slug: "email-marketing" },
      { name: "Marketing Analytics", slug: "marketing-analytics" },
      { name: "Account-Based Marketing", slug: "account-based-marketing" },
    ],
    products: [
      ["Mailchimp", "Intuit", "mailchimp.com", 13, "Email marketing that grew into an all-in-one suite."],
      ["Klaviyo", "Klaviyo", "klaviyo.com", 20, "Data-driven email and SMS for commerce brands."],
      ["Braze", "Braze", "braze.com", null, "Cross-channel customer engagement at enterprise scale."],
      ["Marketo Engage", "Adobe", "adobe.com", 1250, "Enterprise B2B marketing orchestration."],
      ["ActiveCampaign", "ActiveCampaign", "activecampaign.com", 29, "Automation-led email marketing for SMBs."],
      ["HubSpot Marketing Hub", "HubSpot", "hubspot.com", 20, "Inbound marketing anchored to the HubSpot CRM record."],
      ["Marketing Cloud Account Engagement", "Salesforce", "salesforce.com", 1250, "B2B marketing automation native to Salesforce."],
      ["Customer.io", "Customer.io", "customer.io", 100, "Behavioural messaging for product-led teams."],
      ["Iterable", "Iterable", "iterable.com", null, "Cross-channel growth messaging with deep personalisation."],
      ["MoEngage", "MoEngage", "moengage.com", null, "Insights-led engagement for mobile-first brands."],
      ["Brevo", "Brevo", "brevo.com", 9, "Email, SMS and CRM in one affordable suite."],
      ["Omnisend", "Omnisend", "omnisend.com", 16, "Ecommerce marketing automation built for conversion."],
      ["Constant Contact", "Constant Contact", "constantcontact.com", 12, "Email marketing with hands-on human support."],
    ],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    name: "Help Desk",
    slug: "help-desk",
    icon: "Headphones",
    description:
      "Customer service and support platforms: ticketing, shared inboxes, live chat and the knowledge base behind them.",
    subs: [
      { name: "Ticketing", slug: "ticketing-software" },
      { name: "Live Chat", slug: "live-chat-software" },
      { name: "Knowledge Base", slug: "knowledge-base-software" },
    ],
    products: [
      ["Zendesk Support", "Zendesk", "zendesk.com", 55, "The benchmark customer service ticketing suite."],
      ["Freshdesk", "Freshworks", "freshworks.com", 15, "Modern ticketing with a genuinely useful free tier."],
      ["Intercom", "Intercom", "intercom.com", 39, "AI-first customer service and support inbox."],
      ["Front", "Front", "front.com", 19, "A shared inbox that turns email into a team workflow."],
      ["Help Scout", "Help Scout", "helpscout.com", 25, "Human-feeling support at volume."],
      ["Gorgias", "Gorgias", "gorgias.com", 10, "Helpdesk built specifically for ecommerce."],
      ["Kayako", "Kayako", "kayako.com", 15, "Unified support across chat, email and social."],
      ["HappyFox", "HappyFox", "happyfox.com", 29, "Help desk with workflow automation and SLA control."],
      ["LiveAgent", "QualityUnit", "liveagent.com", 9, "All-in-one help desk with live chat included."],
      ["Crisp", "Crisp", "crisp.chat", 45, "Conversational support for small teams."],
      ["Zoho Desk", "Zoho", "zoho.com", 7, "Context-aware help desk inside the Zoho suite."],
      ["ServiceNow CSM", "ServiceNow", "servicenow.com", null, "Enterprise service management on the Now Platform."],
    ],
  },

  /* ------------------------------------------------------------------ 5 */
  {
    name: "Human Resources",
    slug: "human-resources",
    icon: "UserRound",
    description:
      "HRIS, payroll, recruiting and engagement software covering the employee record from offer letter through to offboarding.",
    subs: [
      { name: "Core HR", slug: "core-hr" },
      { name: "Recruiting", slug: "recruiting-software" },
      { name: "Employee Engagement", slug: "employee-engagement" },
    ],
    products: [
      ["BambooHR", "BambooHR", "bamboohr.com", null, "An HRIS that small and mid-size teams actually enjoy."],
      ["Workday HCM", "Workday", "workday.com", null, "Enterprise HCM that treats finance and people as one system."],
      ["Gusto", "Gusto", "gusto.com", 40, "Payroll, benefits and HR for US small business."],
      ["Rippling", "Rippling", "rippling.com", 8, "Payroll, devices and apps driven from one employee record."],
      ["Namely", "Namely", "namely.com", null, "HR, payroll and benefits for the mid-market."],
      ["Paylocity", "Paylocity", "paylocity.com", null, "Payroll and HCM with strong employee experience tooling."],
      ["ADP Workforce Now", "ADP", "adp.com", null, "Payroll and compliance at national scale."],
      ["Personio", "Personio", "personio.com", null, "The HR operating system for European SMEs."],
      ["HiBob", "HiBob", "hibob.com", null, "A modern HR platform for fast-growing companies."],
      ["Deel", "Deel", "deel.com", 49, "Hire, pay and manage global contractors and employees."],
      ["Greenhouse", "Greenhouse", "greenhouse.com", null, "Structured hiring and interview intelligence."],
      ["Lever", "Lever", "lever.co", null, "Talent acquisition with CRM-style candidate nurture."],
      ["Workable", "Workable", "workable.com", 189, "Recruiting software with sourcing built in."],
      ["Lattice", "Lattice", "lattice.com", 11, "Performance, goals and engagement in one place."],
      ["15Five", "15Five", "15five.com", 4, "Continuous performance management for managers."],
    ],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    name: "Accounting & Finance",
    slug: "accounting",
    icon: "Calculator",
    description:
      "Bookkeeping, invoicing, expense and spend-management software for finance teams, from sole traders to multi-entity groups.",
    subs: [
      { name: "Accounting", slug: "accounting-software" },
      { name: "Invoicing", slug: "invoicing-software" },
      { name: "Expense Management", slug: "expense-management" },
    ],
    products: [
      ["QuickBooks Online", "Intuit", "quickbooks.intuit.com", 30, "The default small-business accounting ledger."],
      ["Xero", "Xero", "xero.com", 15, "Cloud accounting with a deep app marketplace."],
      ["FreshBooks", "FreshBooks", "freshbooks.com", 19, "Invoicing and accounting for service businesses."],
      ["Zoho Books", "Zoho", "zoho.com", 15, "Accounting that plugs directly into the Zoho suite."],
      ["Wave", "H&R Block", "waveapps.com", 0, "Free accounting and invoicing for freelancers."],
      ["Sage Business Cloud Accounting", "Sage", "sage.com", 12, "Accounting with compliance depth for growing firms."],
      ["Oracle NetSuite", "Oracle", "netsuite.com", null, "Unified ERP and financials for scaling companies."],
      ["BILL", "BILL", "bill.com", null, "Accounts payable and receivable automation."],
      ["Expensify", "Expensify", "expensify.com", 5, "Expense reports that file themselves."],
      ["Ramp", "Ramp", "ramp.com", 0, "Corporate cards with spend control built in."],
      ["Brex", "Brex", "brex.com", null, "Spend management for venture-backed companies."],
      ["Stripe Billing", "Stripe", "stripe.com", null, "Subscription and usage billing on Stripe."],
      ["AvidXchange", "AvidXchange", "avidxchange.com", null, "AP automation for the mid-market."],
    ],
  },

  /* ------------------------------------------------------------------ 7 */
  {
    name: "Business Intelligence",
    slug: "business-intelligence",
    icon: "ChartNoAxesColumn",
    description:
      "Analytics and BI platforms that turn warehouse and product data into dashboards a business can act on.",
    subs: [
      { name: "BI Platforms", slug: "bi-platforms" },
      { name: "Data Visualization", slug: "data-visualization" },
      { name: "Product Analytics", slug: "product-analytics" },
    ],
    products: [
      ["Tableau", "Salesforce", "tableau.com", 15, "Visual analytics that made dashboards mainstream."],
      ["Microsoft Power BI", "Microsoft", "powerbi.microsoft.com", 10, "Analytics embedded across the Microsoft estate."],
      ["Looker", "Google", "looker.com", null, "Governed, modelled BI on top of your warehouse."],
      ["Metabase", "Metabase", "metabase.com", 85, "Self-serve BI that anyone on the team can open."],
      ["Qlik Sense", "Qlik", "qlik.com", null, "Associative analytics for exploratory insight."],
      ["Mode", "Mode", "mode.com", null, "SQL-first analytics with collaborative reports."],
      ["Domo", "Domo", "domo.com", null, "Executive BI with an unusually large connector library."],
      ["Sigma Computing", "Sigma Computing", "sigmacomputing.com", null, "Spreadsheet-speed analytics on cloud warehouses."],
      ["Apache Superset", "Apache Software Foundation", "superset.apache.org", 0, "Open-source BI with an enterprise-ready stack."],
      ["Mixpanel", "Mixpanel", "mixpanel.com", 28, "Product analytics with real retention and funnel depth."],
      ["Amplitude", "Amplitude", "amplitude.com", 61, "Digital analytics for product-led growth."],
      ["Heap", "Heap", "heap.io", null, "Autocapture analytics with no manual tagging."],
      ["Pendo", "Pendo", "pendo.io", null, "Product analytics plus in-app guidance."],
      ["Contentsquare", "Contentsquare", "contentsquare.com", null, "Experience analytics across digital journeys."],
    ],
  },

  /* ------------------------------------------------------------------ 8 */
  {
    name: "E-Commerce",
    slug: "ecommerce",
    icon: "ShoppingCart",
    description:
      "Storefront, checkout and subscription commerce platforms for direct-to-consumer brands and B2B sellers.",
    subs: [
      { name: "Store Builders", slug: "store-builders" },
      { name: "Subscription Commerce", slug: "subscription-commerce" },
      { name: "Marketplace", slug: "marketplace-software" },
    ],
    products: [
      ["Shopify", "Shopify", "shopify.com", 39, "The commerce platform behind millions of stores."],
      ["BigCommerce", "BigCommerce", "bigcommerce.com", 39, "Open SaaS commerce for mid-market and B2B."],
      ["WooCommerce", "Automattic", "woocommerce.com", 0, "Commerce inside WordPress, fully owned."],
      ["Squarespace", "Squarespace", "squarespace.com", 16, "Design-led websites with commerce built in."],
      ["Wix", "Wix", "wix.com", 17, "Drag-and-drop site building with ecommerce."],
      ["Adobe Commerce", "Adobe", "business.adobe.com", null, "Enterprise commerce with deep customisation."],
      ["Salesforce Commerce Cloud", "Salesforce", "salesforce.com", null, "Commerce connected to the customer record."],
      ["Shift4Shop", "Shift4", "shift4shop.com", 0, "Free storefront backed by enterprise payments."],
      ["Volusion", "Volusion", "volusion.com", 35, "All-in-one ecommerce for small retail."],
      ["Recharge", "Recharge", "rechargepayments.com", 99, "Subscription payments for commerce brands."],
      ["Bold Commerce", "Bold Commerce", "boldcommerce.com", null, "Checkout and subscription tooling for Shopify."],
      ["Shogun", "Shogun", "getshogun.com", 39, "Visual page building for storefronts."],
    ],
  },

  /* ------------------------------------------------------------------ 9 */
  {
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    icon: "Server",
    description:
      "Infrastructure, delivery pipelines and observability — the platforms that run and monitor everything else.",
    subs: [
      { name: "Cloud Infrastructure", slug: "cloud-infrastructure" },
      { name: "CI/CD", slug: "ci-cd" },
      { name: "Observability", slug: "observability" },
    ],
    products: [
      ["Amazon Web Services", "Amazon", "aws.amazon.com", null, "The broadest cloud infrastructure catalogue available."],
      ["Microsoft Azure", "Microsoft", "azure.microsoft.com", null, "Cloud platform for the Microsoft ecosystem."],
      ["Google Cloud Platform", "Google", "cloud.google.com", null, "Data and AI-centric cloud infrastructure."],
      ["DigitalOcean", "DigitalOcean", "digitalocean.com", 4, "Cloud infrastructure developers can reason about."],
      ["Vercel", "Vercel", "vercel.com", 20, "The platform for frontend and edge delivery."],
      ["Netlify", "Netlify", "netlify.com", 19, "Build, deploy and scale web projects."],
      ["Heroku", "Salesforce", "heroku.com", 7, "Opinionated platform-as-a-service for fast shipping."],
      ["GitHub Actions", "GitHub", "github.com", 4, "CI/CD native to your repository."],
      ["GitLab CI/CD", "GitLab", "gitlab.com", 29, "The full DevSecOps lifecycle in one tool."],
      ["CircleCI", "CircleCI", "circleci.com", null, "Continuous integration at scale."],
      ["Jenkins", "CloudBees", "jenkins.io", 0, "The extensible open-source automation server."],
      ["Datadog", "Datadog", "datadoghq.com", 15, "Observability across metrics, traces and logs."],
      ["New Relic", "New Relic", "newrelic.com", 49, "Telemetry platform with full-stack visibility."],
      ["Grafana", "Grafana Labs", "grafana.com", 0, "Dashboards and alerting over any data source."],
      ["Sentry", "Sentry", "sentry.io", 26, "Error and performance monitoring for developers."],
      ["PagerDuty", "PagerDuty", "pagerduty.com", 21, "Incident response orchestration."],
    ],
  },

  /* ----------------------------------------------------------------- 10 */
  {
    name: "Security & Compliance",
    slug: "security",
    icon: "ShieldCheck",
    description:
      "Identity, endpoint and compliance automation tooling — the controls that satisfy a security review.",
    subs: [
      { name: "Identity & Access", slug: "identity-access-management" },
      { name: "Endpoint Security", slug: "endpoint-security" },
      { name: "Compliance Automation", slug: "compliance-automation" },
    ],
    products: [
      ["Okta", "Okta", "okta.com", null, "Identity for the enterprise workforce and its customers."],
      ["Auth0", "Okta", "auth0.com", 23, "Authentication and authorisation built for developers."],
      ["JumpCloud", "JumpCloud", "jumpcloud.com", 11, "Directory, device and identity management in one."],
      ["OneLogin", "One Identity", "onelogin.com", null, "Access management with rapid SSO deployment."],
      ["Ping Identity", "Ping Identity", "pingidentity.com", null, "Identity security for hybrid enterprises."],
      ["CrowdStrike Falcon", "CrowdStrike", "crowdstrike.com", null, "Cloud-native endpoint protection."],
      ["SentinelOne", "SentinelOne", "sentinelone.com", null, "Autonomous endpoint detection and response."],
      ["Splunk Enterprise Security", "Cisco", "splunk.com", null, "SIEM built for large security operations centres."],
      ["Microsoft Defender for Endpoint", "Microsoft", "microsoft.com", null, "Endpoint protection integrated with Microsoft 365."],
      ["Vanta", "Vanta", "vanta.com", null, "Automated SOC 2 and ISO 27001 compliance."],
      ["Drata", "Drata", "drata.com", null, "Continuous compliance automation."],
      ["Secureframe", "Secureframe", "secureframe.com", null, "Compliance readiness without the consultancy bill."],
      ["Wiz", "Wiz", "wiz.io", null, "Cloud security posture across every workload."],
    ],
  },

  /* ----------------------------------------------------------------- 11 */
  {
    name: "Communication & Collaboration",
    slug: "collaboration",
    icon: "MessageSquare",
    description:
      "Meetings, messaging and the visual workspaces distributed teams use to think together.",
    subs: [
      { name: "Video Conferencing", slug: "video-conferencing" },
      { name: "Team Chat", slug: "team-chat" },
      { name: "Whiteboard", slug: "whiteboard-software" },
    ],
    products: [
      ["Zoom", "Zoom", "zoom.us", 13.33, "Video meetings that became a verb."],
      ["Microsoft Teams", "Microsoft", "microsoft.com", 4, "Chat, meetings and files inside Microsoft 365."],
      ["Google Meet", "Google", "meet.google.com", 6, "Video calling built into Google Workspace."],
      ["Slack", "Salesforce", "slack.com", 7.25, "Channel-based messaging for technical teams."],
      ["Webex", "Cisco", "webex.com", 11.95, "Enterprise meetings with security depth."],
      ["RingCentral", "RingCentral", "ringcentral.com", 20, "Cloud phone, messaging and video in one."],
      ["GoTo Meeting", "GoTo", "goto.com", 14, "Reliable meetings with a light footprint."],
      ["Miro", "Miro", "miro.com", 8, "The visual workspace for distributed teams."],
      ["Mural", "Mural", "mural.co", 9.99, "Collaborative whiteboarding with facilitation tools."],
      ["FigJam", "Figma", "figma.com", 3, "Whiteboarding alongside your design files."],
      ["Loom", "Atlassian", "loom.com", 12.5, "Async video messaging for busy teams."],
      ["Dialpad", "Dialpad", "dialpad.com", 15, "AI-powered calling and contact centre."],
      ["Discord", "Discord", "discord.com", 0, "Voice and text communities at scale."],
    ],
  },

  /* ----------------------------------------------------------------- 12 */
  {
    name: "Design & Creative",
    slug: "design",
    icon: "Palette",
    description:
      "Interface design, prototyping and brand asset management for product and marketing design teams.",
    subs: [
      { name: "UI Design", slug: "ui-design" },
      { name: "Prototyping", slug: "prototyping" },
      { name: "Digital Asset Management", slug: "digital-asset-management" },
    ],
    products: [
      ["Figma", "Figma", "figma.com", 12, "Collaborative interface design in the browser."],
      ["Adobe XD", "Adobe", "adobe.com", 9.99, "UI and UX design inside Creative Cloud."],
      ["Sketch", "Sketch B.V.", "sketch.com", 9, "The Mac-native design toolkit."],
      ["Framer", "Framer", "framer.com", 5, "Design and publish production sites."],
      ["InVision", "InVision", "invisionapp.com", 0, "Prototyping and design collaboration."],
      ["Marvel", "Marvel", "marvelapp.com", 12, "Rapid prototyping without code."],
      ["Axure RP", "Axure Software", "axure.com", 25, "Advanced interactive prototyping."],
      ["Balsamiq", "Balsamiq", "balsamiq.com", 9, "Deliberately low-fidelity wireframing."],
      ["Canva", "Canva", "canva.com", 15, "Template-driven design for everyone."],
      ["Adobe Creative Cloud", "Adobe", "adobe.com", 22.99, "The professional creative application suite."],
      ["Bynder", "Bynder", "bynder.com", null, "Digital asset management for brand teams."],
      ["Frontify", "Frontify", "frontify.com", null, "Brand guidelines and asset management together."],
      ["Brandfolder", "Brandfolder", "brandfolder.com", null, "A centralised brand asset repository."],
    ],
  },

  /* ----------------------------------------------------------------- 13 */
  {
    name: "Database & Data",
    slug: "database",
    icon: "Database",
    description:
      "Operational databases, warehouses and the integration layer that moves data between them.",
    subs: [
      { name: "Relational Databases", slug: "relational-databases" },
      { name: "Data Warehousing", slug: "data-warehousing" },
      { name: "Data Integration", slug: "data-integration" },
    ],
    products: [
      ["PostgreSQL", "PostgreSQL Global Development Group", "postgresql.org", 0, "The most trusted open-source relational database."],
      ["MySQL", "Oracle", "mysql.com", 0, "The most widely deployed open-source database."],
      ["MongoDB", "MongoDB", "mongodb.com", 0, "Document database for flexible schemas."],
      ["Redis", "Redis", "redis.io", 0, "In-memory data store for caching and queues."],
      ["Snowflake", "Snowflake", "snowflake.com", null, "Cloud data platform with compute and storage separated."],
      ["Databricks", "Databricks", "databricks.com", null, "Lakehouse platform for data and AI workloads."],
      ["Google BigQuery", "Google", "cloud.google.com", null, "Serverless analytics at petabyte scale."],
      ["Amazon Redshift", "Amazon", "aws.amazon.com", null, "Managed data warehouse inside AWS."],
      ["Fivetran", "Fivetran", "fivetran.com", null, "Fully managed ELT connectors."],
      ["dbt", "dbt Labs", "getdbt.com", 100, "Transformations as version-controlled SQL."],
      ["Airbyte", "Airbyte", "airbyte.com", null, "Open-source data integration."],
      ["Stitch", "Talend", "stitchdata.com", 100, "Simple ELT directly into your warehouse."],
      ["Matillion", "Matillion", "matillion.com", null, "ELT built specifically for cloud warehouses."],
      ["Confluent", "Confluent", "confluent.io", null, "Event streaming built on Apache Kafka."],
    ],
  },

  /* ----------------------------------------------------------------- 14 */
  {
    name: "ERP & Operations",
    slug: "erp",
    icon: "Factory",
    description:
      "Enterprise resource planning, inventory and supply chain systems that run the physical side of a business.",
    subs: [
      { name: "Manufacturing ERP", slug: "manufacturing-erp" },
      { name: "Inventory Management", slug: "inventory-management" },
      { name: "Supply Chain", slug: "supply-chain-management" },
    ],
    products: [
      ["SAP S/4HANA", "SAP", "sap.com", null, "In-memory ERP for large enterprise."],
      ["Oracle NetSuite ERP", "Oracle", "netsuite.com", null, "Cloud ERP with financials at the core."],
      ["Dynamics 365 Business Central", "Microsoft", "microsoft.com", 70, "ERP for the SMB inside the Microsoft stack."],
      ["Odoo", "Odoo", "odoo.com", 24.9, "Open-source ERP with 80+ integrated apps."],
      ["Infor CloudSuite", "Infor", "infor.com", null, "Industry-specific cloud ERP."],
      ["Epicor Kinetic", "Epicor", "epicor.com", null, "ERP purpose-built for manufacturing operations."],
      ["Acumatica", "Acumatica", "acumatica.com", null, "Cloud ERP with consumption-based pricing."],
      ["Katana", "Katana", "katanamrp.com", 179, "Manufacturing ERP for small producers."],
      ["Fishbowl Inventory", "Fishbowl", "fishbowlinventory.com", null, "Inventory management for QuickBooks users."],
      ["Cin7", "Cin7", "cin7.com", 349, "Inventory and order management across channels."],
      ["Descartes", "Descartes", "descartes.com", null, "Logistics and supply chain execution."],
      ["ShipBob", "ShipBob", "shipbob.com", null, "Outsourced fulfilment with inventory visibility."],
    ],
  },

  /* ----------------------------------------------------------------- 15 */
  {
    name: "Developer Tools",
    slug: "developer-tools",
    icon: "CodeXml",
    description:
      "Source control, API tooling, backend platforms and the infrastructure primitives engineering teams build on.",
    subs: [
      { name: "Version Control", slug: "version-control" },
      { name: "API Development", slug: "api-development" },
      { name: "Backend Platform", slug: "backend-platform" },
    ],
    products: [
      ["GitHub", "GitHub", "github.com", 4, "Where the world builds software."],
      ["GitLab", "GitLab", "gitlab.com", 29, "The complete DevSecOps platform."],
      ["Bitbucket", "Atlassian", "bitbucket.org", 3, "Git repositories wired directly into Jira."],
      ["Postman", "Postman", "postman.com", 14, "API design, testing and documentation."],
      ["SwaggerHub", "SmartBear", "swagger.io", null, "OpenAPI design and governance at scale."],
      ["Snyk", "Snyk", "snyk.io", 25, "Developer-first security scanning."],
      ["SonarQube", "SonarSource", "sonarsource.com", null, "Continuous code quality and security analysis."],
      ["Retool", "Retool", "retool.com", 10, "Internal tools built in hours, not sprints."],
      ["Supabase", "Supabase", "supabase.com", 25, "Postgres backend with auth, storage and realtime."],
      ["Firebase", "Google", "firebase.google.com", 0, "App development platform for mobile and web."],
      ["Twilio", "Twilio", "twilio.com", null, "Communications APIs for voice, SMS and email."],
      ["Stripe", "Stripe", "stripe.com", null, "Payments infrastructure for the internet."],
      ["Algolia", "Algolia", "algolia.com", null, "Search and discovery APIs."],
    ],
  },

  /* ----------------------------------------------------------------- 16 */
  {
    name: "Content Management",
    slug: "cms",
    icon: "FileText",
    description:
      "Headless and traditional CMS platforms for editorial teams shipping marketing and product content.",
    subs: [
      { name: "Headless CMS", slug: "headless-cms" },
      { name: "Site Builders", slug: "site-builders" },
      { name: "Digital Experience", slug: "digital-experience" },
    ],
    products: [
      ["WordPress", "Automattic", "wordpress.org", 0, "The CMS powering over 40% of the web."],
      ["Contentful", "Contentful", "contentful.com", null, "Composable content platform for digital teams."],
      ["Sanity", "Sanity", "sanity.io", null, "Structured content with real-time collaboration."],
      ["Strapi", "Strapi", "strapi.io", 0, "Open-source headless CMS, fully self-hosted."],
      ["Webflow", "Webflow", "webflow.com", 14, "Visual development for responsive sites."],
      ["Drupal", "Drupal Association", "drupal.org", 0, "Enterprise-grade open-source CMS."],
      ["Ghost", "Ghost Foundation", "ghost.org", 9, "A publishing platform for independent creators."],
      ["Prismic", "Prismic", "prismic.io", null, "Headless page building for marketing sites."],
      ["Storyblok", "Storyblok", "storyblok.com", null, "Headless CMS with a visual editor."],
      ["Optimizely", "Optimizely", "optimizely.com", null, "Content, experimentation and commerce."],
      ["Contentstack", "Contentstack", "contentstack.com", null, "Enterprise headless CMS with automation."],
      ["Adobe Experience Manager", "Adobe", "adobe.com", null, "Enterprise content and digital experience suite."],
    ],
  },

  /* ----------------------------------------------------------------- 17 */
  {
    name: "Customer Data Platforms",
    slug: "cdp",
    icon: "Layers",
    description:
      "Customer data infrastructure that unifies identities, governs event collection and activates audiences.",
    subs: [
      { name: "Customer Data Platform", slug: "customer-data-platform" },
      { name: "Tag Management", slug: "tag-management" },
      { name: "Personalisation", slug: "personalisation" },
    ],
    products: [
      ["Segment", "Twilio", "segment.com", 120, "Customer data infrastructure with 400+ integrations."],
      ["mParticle", "mParticle", "mparticle.com", null, "Customer data platform for mobile-first brands."],
      ["Tealium", "Tealium", "tealium.com", null, "Tag management with real-time audience activation."],
      ["Adobe Experience Platform", "Adobe", "adobe.com", null, "Real-time customer profiles at enterprise scale."],
      ["Treasure Data", "Treasure Data", "treasuredata.com", null, "Enterprise CDP with AI-driven audiences."],
      ["BlueConic", "BlueConic", "blueconic.com", null, "A pure-play CDP for marketing teams."],
      ["Lytics", "Lytics", "lytics.com", null, "A decision engine for customer data."],
      ["RudderStack", "RudderStack", "rudderstack.com", null, "Warehouse-native customer data pipeline."],
      ["Optimizely Data Platform", "Optimizely", "optimizely.com", null, "CDP paired with experimentation."],
    ],
  },

  /* ----------------------------------------------------------------- 18 */
  {
    name: "Field Service",
    slug: "field-service",
    icon: "Wrench",
    description:
      "Dispatch, scheduling and work-order software for teams that deliver service at the customer's location.",
    subs: [
      { name: "Field Service Management", slug: "field-service-management" },
      { name: "Scheduling", slug: "scheduling-software" },
      { name: "Work Orders", slug: "work-order-management" },
    ],
    products: [
      ["ServiceTitan", "ServiceTitan", "servicetitan.com", null, "The operating system for home services."],
      ["Jobber", "Jobber", "getjobber.com", 29, "Scheduling and invoicing for field teams."],
      ["Housecall Pro", "Housecall Pro", "housecallpro.com", 49, "All-in-one field service software for home services."],
      ["ServiceMax", "PTC", "servicemax.com", null, "Asset-centric field service for complex equipment."],
      ["Salesforce Field Service", "Salesforce", "salesforce.com", 25, "Dispatch and scheduling on the Salesforce platform."],
      ["Zoho FSM", "Zoho", "zoho.com", 12, "Field service inside the Zoho suite."],
      ["Fieldwire", "Hilti", "fieldwire.com", 39, "Construction field management and punch lists."],
      ["ProntoForms", "ProntoForms", "prontoforms.com", 12, "Mobile forms for field data collection."],
      ["Kickserv", "Kickserv", "kickserv.com", 47, "Job management for small service businesses."],
      ["Workiz", "Workiz", "workiz.com", 65, "Field service management with calling built in."],
    ],
  },
];
