export interface Tool {
  name: string;
  description: string;
  category: 'Coding' | 'Business' | 'Design' | 'Productivity';
  tags: string[];
  link: string;
  featured?: boolean;
}

export const freeTools: Tool[] = [
  // Coding & AI (Featured)
  {
    name: 'Cursor AI',
    description: 'The best AI code editor. Free tier available for everyone, free Pro for students. Features multi-line autocomplete and Chat.',
    category: 'Coding',
    tags: ['AI Editor', 'Autocomplete', 'Privacy Mode'],
    link: 'https://cursor.sh',
    featured: true,
  },
  {
    name: 'Anti-gravity',
    description: 'Powerful AI agentic coding tool setup. The alternative to manual coding. Get the free IDE setup guide.',
    category: 'Coding',
    tags: ['AI Agent', 'IDE', 'Automation'],
    link: '#signup', // Leads to signup
    featured: true,
  },
  {
    name: 'n8n Workflows',
    description: 'Access 4,343+ automation workflows for Shopify, Social Media, and Lead Gen. Self-hostable and powerful.',
    category: 'Business',
    tags: ['Automation', 'Workflows', 'No-Code'],
    link: 'https://n8n.io',
    featured: true,
  },

  // Business & Finance
  {
    name: 'Wave',
    description: 'Truly free accounting software for small businesses. Send unlimited invoices and track expenses.',
    category: 'Business',
    tags: ['Accounting', 'Invoicing', 'Finance'],
    link: 'https://waveapps.com',
  },
  {
    name: 'Zoho Books',
    description: 'Robust accounting for businesses under $50k revenue. Great features for free.',
    category: 'Business',
    tags: ['Accounting', 'Finance', 'Invoicing'],
    link: 'https://zoho.com/books',
  },
  {
    name: 'Stripe',
    description: 'The standard for collecting payments online. No monthly fees, just pay per transaction.',
    category: 'Business',
    tags: ['Payments', 'E-commerce'],
    link: 'https://stripe.com',
  },

  // Design & Creative
  {
    name: 'Figma',
    description: 'Professional interface design tool. Free for up to 3 projects. Industry standard.',
    category: 'Design',
    tags: ['UI/UX', 'Design', 'Prototyping'],
    link: 'https://figma.com',
  },
  {
    name: 'Canva',
    description: 'Easy graphic design with thousands of free templates for social media and marketing.',
    category: 'Design',
    tags: ['Graphics', 'Social Media', 'Templates'],
    link: 'https://canva.com',
  },

  // Productivity & Operations
  {
    name: 'Airtable',
    description: 'Part spreadsheet, part database. Organize anything with powerful views and automations.',
    category: 'Productivity',
    tags: ['Database', 'Organization', 'No-Code'],
    link: 'https://airtable.com',
  },
  {
    name: 'Mailchimp',
    description: 'Email marketing platform free for up to 500 contacts. Great for starting newsletters.',
    category: 'Business',
    tags: ['Email', 'Marketing', 'CRM'],
    link: 'https://mailchimp.com',
  },
  {
    name: 'Google Workspace',
    description: 'Docs, Sheets, Slides, and Drive. The essential cloud office suite for everyone.',
    category: 'Productivity',
    tags: ['Office', 'Cloud', 'Collaboration'],
    link: 'https://workspace.google.com',
  },
  {
    name: 'Zapier',
    description: 'Connect your apps and automate workflows. Free tier for basic automation tasks.',
    category: 'Productivity',
    tags: ['Automation', 'Integrations'],
    link: 'https://zapier.com',
  },
  {
    name: 'Make.com',
    description: 'Visual automation builder. Generous free tier for complex workflows.',
    category: 'Productivity',
    tags: ['Automation', 'Visual Builder'],
    link: 'https://make.com',
  },
];
