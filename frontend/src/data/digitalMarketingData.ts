import type { Module, Flashcard, PlannerDay } from '../types/studyGuide';

export const COURSE_STATS = {
  title: "Digital Marketing Complete Study Guide",
  subtitle: "From Introduction to Freelancing — Master Digital Marketing in 30 Days",
  totalModules: 7,
  totalDays: 30,
  totalTopics: "30+",
  totalTools: "20+",
  totalFlashcards: 42,
};

export const MODULES_DATA: Module[] = [
  {
    id: 1,
    code: "M1",
    title: "Introduction to Digital Marketing",
    subtitle: "What is Digital Marketing? | Core Channels & Key Tools",
    dayRange: "Days 1–4",
    startDay: 1,
    endDay: 4,
    description: "Digital marketing is the promotion of products or services using digital channels and technologies. Unlike traditional marketing, it is measurable, targeted, and interactive.",
    iconName: "Compass",
    color: "from-blue-500 to-indigo-600",
    days: [
      {
        id: 1,
        dayNumber: 1,
        moduleId: 1,
        moduleTitle: "Introduction to Digital Marketing",
        title: "What is Digital Marketing?",
        summary: "Digital marketing is the promotion of products or services using digital channels and technologies. Unlike traditional marketing, it is measurable, targeted, and interactive.",
        contentSections: [
          {
            id: "m1-d1-s1",
            title: "What is Digital Marketing?",
            type: "text",
            content: "Digital marketing is the promotion of products or services using digital channels and technologies.\nUnlike traditional marketing, it is measurable, targeted, and interactive."
          },
          {
            id: "m1-d1-s2",
            title: "Core Channels",
            type: "checklist",
            checklist: [
              {
                label: "Core Channels",
                items: [
                  "SEO: getting found organically on search engines",
                  "Content Marketing: blogs, videos, podcasts, infographics",
                  "Social Media Marketing: Instagram, LinkedIn, TikTok, Twitter/X",
                  "Email Marketing: newsletters, welcome sequences, drip campaigns",
                  "Paid Advertising: Google Ads, Meta Ads, LinkedIn Ads",
                  "Affiliate & Influencer Marketing: partnering with creators and affiliates"
                ]
              }
            ]
          },
          {
            id: "m1-d1-s3",
            title: "Key Tools Every Marketer Needs",
            type: "table",
            table: {
              headers: ["Category", "Tools"],
              rows: [
                ["Analytics", "Google Analytics 4 (GA4), Google Search Console"],
                ["Design", "Canva, Adobe Express, Figma"],
                ["SEO", "Ahrefs Free, Ubersuggest, Google Keyword Planner"],
                ["Social Scheduling", "Buffer, Later, Hootsuite, Meta Business Suite"],
                ["Ads", "Meta Ads Manager, Google Ads"]
              ]
            }
          }
        ],
        practiceTask: {
          title: "",
          description: "",
          actionSteps: []
        },
        referenceLinks: []
      }
    ]
  },
  {
    id: 2,
    code: "M2",
    title: "Personal Branding",
    subtitle: "Identity, Credibility & Visibility Strategy",
    dayRange: "Days 5–9",
    startDay: 5,
    endDay: 9,
    description: "Your personal brand is not what you say — it is what people feel and believe about you when you are not in the room.",
    iconName: "UserCheck",
    color: "from-purple-500 to-pink-600",
    days: [
      {
        id: 5,
        dayNumber: 5,
        moduleId: 2,
        moduleTitle: "Personal Branding",
        title: "Personal Branding",
        summary: "Your personal brand is not what you say — it is what people feel and believe about you when you are not in the room.",
        contentSections: [
          {
            id: "m2-s1",
            title: "Personal Branding",
            type: "text",
            content: "Your personal brand is not what you say — it is what people feel and believe about you when you are not in the room."
          },
          {
            id: "m2-s2",
            title: "3 Pillars of a Strong Personal Brand",
            type: "table",
            table: {
              headers: ["Pillar", "Definition", "Key Action"],
              rows: [
                ["1. Identity (Clarity)", "Who you are, what you stand for, what problem you solve", "Pick ONE clear skill and audience"],
                ["2. Credibility (Trust)", "Show proof that you know your work: results, testimonials, case studies", "Share client work and insights"],
                ["3. Visibility (Consistency)", "Show up daily and stay top of mind", "Post minimum 4–5× per week"]
              ]
            }
          },
          {
            id: "m2-s3",
            title: "Reference Profiles — Identity & Credibility",
            type: "reference_list",
            content: "Study how these creators establish clear positioning around business, growth, practical insights, and authority:",
            referenceLinks: [
              {
                id: "ref-m2-1",
                title: "Dharaneetharan",
                subtitle: "Clear focus on business + mindset + growth content",
                url: "https://www.instagram.com/dharaneetharan/reels/",
                hasLink: true,
                imageUrl: "/assets/images/referencelinkimage1.png"
              },
              {
                id: "ref-m2-2",
                title: "Journey With Sudhan",
                subtitle: "Strong identity around journey + self-growth + consistency",
                url: "https://www.instagram.com/journey_with_sudhan/",
                hasLink: true,
                imageUrl: "/assets/images/referencelinkimage2.png"
              },
              {
                id: "ref-m2-3",
                title: "Sakthivel Pannerselvam",
                subtitle: "Shares knowledge + practical insights + authority content",
                url: "https://www.instagram.com/sakthivelpannerselvam6/",
                hasLink: true,
                imageUrl: "/assets/images/referencelinkimage3.png"
              },
              {
                id: "ref-m2-4",
                title: "Sangeetha Sabishek",
                subtitle: "Builds trust with consistent content + personal authority",
                url: "https://www.instagram.com/sangeethasabishek/",
                hasLink: true,
                imageUrl: "/assets/images/referencelinkimage4.png"
              }
            ]
          },
          {
            id: "m2-s5",
            title: "Your Unique Value Proposition (UVP)",
            type: "calloutText",
            calloutText: "UVP Formula:\n\"I help [TARGET AUDIENCE] achieve [RESULT] through [METHOD]\"\n\nExample: \"I help small business owners get more clients through short-form content.\""
          },
          {
            id: "m2-s6",
            title: "Step-by-Step Personal Brand Setup",
            type: "checklist",
            checklist: [
              {
                label: "1. Be Clear About Your Skill",
                items: [
                  "Pick ONE Strong Skill: Video Editing, Digital Marketing, SEO, Content Creation",
                  "Creator Positioning: All top creators are known for a specific angle"
                ]
              },
              {
                label: "2. Choose Your Audience",
                items: [
                  "Service Business Examples: Video Editing (people who want to learn & clients who need video editing services), Digital Marketing (people who want to learn & businesses needing marketing services)",
                  "Product Business Examples: Paint business (New Home builders), Pet Grooming (Pet owners)"
                ]
              },
              {
                label: "3. Create Content That Works",
                items: [
                  "3 Content Types: Educational (tips & value), Proof (results & case studies), Personal (journey & behind-the-scenes)",
                  "Winning Pattern: Short reels, direct talking, hook in first 3 seconds, clear message"
                ]
              }
            ]
          },
          {
            id: "m2-s7",
            title: "Profile Optimisation Checklist",
            type: "checklist",
            checklist: [
              {
                label: "LinkedIn Profile Checklist",
                items: [
                  "Professional Headshot: High quality (not a selfie)",
                  "Custom Banner: Custom banner with niche/tagline",
                  "Headline: Role + Who you help + Result",
                  "About Section: UVP + story + CTA",
                  "Featured Section: Best posts, case studies, portfolio links"
                ]
              },
              {
                label: "Instagram Profile Checklist",
                items: [
                  "Name Field: Includes searchable keyword (e.g. 'Sarah | Marketing Coach')",
                  "Bio: What you do + who you help + CTA with link",
                  "Link in Bio: Linktree or Stan Store tool"
                ]
              }
            ]
          },
          {
            id: "m2-s8",
            title: "Final Formula & Reality Check",
            type: "calloutText",
            calloutText: "⚡ FINAL FORMULA:\nRight Skill + Right Audience + Right Content = STRONG PERSONAL BRAND\n\n💡 REALITY CHECK:\nIf you follow this:\n• No need to chase clients\n• Your content becomes your salesperson\n• People DM YOU"
          }
        ],
        practiceTask: {
          title: "",
          description: "",
          actionSteps: []
        },
        referenceLinks: []
      }
    ]
  },
  {
    id: 3,
    code: "M3",
    title: "Content Creation",
    subtitle: "Hooks, Video Formats, Canva & CapCut Workflow",
    dayRange: "Days 10–15",
    startDay: 10,
    endDay: 15,
    description: "Master high-converting content creation. Learn the Rule of Thirds content mix, video script architecture, 5 powerful hook types, 10 viral video formats, and design rules.",
    iconName: "Video",
    color: "from-amber-500 to-orange-600",
    days: [
      {
        id: 10,
        dayNumber: 10,
        moduleId: 3,
        moduleTitle: "Content Creation",
        title: "Content Creation",
        summary: "Master short-form video creation, script structures, scroll-stopping hooks, design principles, and editing workflows.",
        contentSections: [
          {
            id: "m3-s1",
            title: "Rule of Thirds — Content Mix",
            type: "table",
            table: {
              headers: ["Ratio", "Content Type", "Description"],
              rows: [
                ["33%", "Education", "Tips, strategies, how-to videos — teach something valuable"],
                ["33%", "Proof", "Client results, case studies, before/after"],
                ["33%", "Personal", "Your journey, behind-the-scenes, storytelling"]
              ]
            },
            calloutText: "This balance builds: Trust + Authority + Connection"
          },
          {
            id: "m3-s2",
            title: "Video Script Structure",
            type: "flow",
            flowSteps: [
              "1. Hook (First 3 Seconds)",
              "2. Problem / Relatable Situation",
              "3. Solution / Value",
              "4. Proof / Example",
              "5. CTA (Call To Action)"
            ]
          },
          {
            id: "m3-s3",
            title: "Hook Types — First 3 Seconds",
            type: "table",
            table: {
              headers: ["Hook Type", "Example"],
              rows: [
                ["Question Hook", "Are you making this mistake?"],
                ["Bold Statement Hook", "Most people get this wrong..."],
                ["Curiosity Hook", "This one trick changed everything..."],
                ["Pain Point Hook", "Struggling to get clients?"],
                ["Story Hook", "Last year I had zero clients..."]
              ]
            }
          },
          {
            id: "m3-s4",
            title: "10 Video Content Formats",
            type: "table",
            table: {
              headers: ["Format", "Description"],
              rows: [
                ["1. Hook-Based Viral Videos", "Fast cuts, strong opening, keep curiosity high"],
                ["2. Storytelling / Emotional", "Show struggle → growth → success"],
                ["3. Hook → Solution Format", "Problem + direct solution"],
                ["4. Authority Building Reels", "Show expertise, share insights & frameworks"],
                ["5. Client Process Videos", "Show HOW you work step by step"],
                ["6. Client Results / Proof Videos", "Before → After, numbers & growth"],
                ["7. Trending / Seasonal Content", "Use trending audio + current topics"],
                ["8. Customer Testimonial Videos", "Real client feedback in their own words"],
                ["9. Educational Content", "Teach something simple & useful"],
                ["10. Behind-The-Scenes Content", "Show real work, build authenticity"]
              ]
            }
          },
          {
            id: "m3-s5",
            title: "Algorithm Growth Tips",
            type: "checklist",
            checklist: [
              {
                label: "Algorithm Growth Tips",
                items: [
                  "First 3 seconds: MOST IMPORTANT",
                  "Keep videos short & engaging",
                  "Use captions + subtitles",
                  "Add pattern interrupts (cuts, zooms, text overlays)",
                  "Post consistently: minimum 4–5 per week",
                  "Reply to comments to boost reach",
                  "Use the trending song",
                  "Repost the video"
                ]
              }
            ]
          },
          {
            id: "m3-s6",
            title: "Content Journey — Audience to Client",
            type: "flow",
            flowSteps: [
              "1. Stranger: Sees content",
              "2. Follows: For value",
              "3. Builds Trust: Engages & watches",
              "4. Engages: Likes, comments, shares",
              "5. Becomes a Lead: Inquires via DM",
              "6. Converts to Client: Hires your services"
            ]
          },
          {
            id: "m3-s7",
            title: "Design Basics for Marketers",
            type: "checklist",
            checklist: [
              {
                label: "Typography Rules",
                items: [
                  "Font Limit: Use max 2 fonts — one display (headline), one body",
                  "Font Hierarchy: Size, weight, and colour create visual flow"
                ]
              },
              {
                label: "Colour Theory",
                items: [
                  "Complementary Colours: (Opposite on wheel) = high contrast, energetic",
                  "Analogous Colours: (Adjacent) = harmonious, calming",
                  "60-30-10 Rule: 60% dominant, 30% secondary, 10% accent"
                ]
              }
            ]
          },
          {
            id: "m3-s8",
            title: "Canva Pro Tips",
            type: "checklist",
            checklist: [
              {
                label: "Canva Pro Tips",
                items: [
                  "Brand Kit: Set up a Brand Kit (logo, fonts, colours)",
                  "Magic Resize: Use Magic Resize to repurpose across platforms",
                  "Lock Background: Lock background layers before editing content layers"
                ]
              }
            ]
          },
          {
            id: "m3-s9",
            title: "CapCut Editing Workflow",
            type: "flow",
            flowSteps: [
              "1. Import clips → trim silence → arrange order",
              "2. Add auto-captions (edit for accuracy)",
              "3. Add B-roll or stock footage",
              "4. Background music at 15–20% volume",
              "5. Add text overlays for key points",
              "6. Colour grade with presets",
              "7. Export at 1080p, 60fps for best quality"
            ]
          },
          {
            id: "m3-s10",
            title: "Key CapCut Features",
            type: "calloutText",
            calloutText: "⚡ KEY CAPCUT FEATURES:\nAuto-captions • Speed ramp • Beat sync • Background removal"
          }
        ],
        practiceTask: {
          title: "",
          description: "",
          actionSteps: []
        },
        referenceLinks: []
      }
    ]
  },
  {
    id: 4,
    code: "M4",
    title: "SEO (Search Engine Optimisation)",
    subtitle: "Crawling, Indexing, Ranking, E-E-A-T & On-Page Checklist",
    dayRange: "Days 16–19",
    startDay: 16,
    endDay: 19,
    description: "Master search engine optimization from search engine mechanics to keyword research, on-page optimization, backlink building, local SEO, and technical site health.",
    iconName: "Search",
    color: "from-emerald-500 to-teal-600",
    days: [
      {
        id: 16,
        dayNumber: 16,
        moduleId: 4,
        moduleTitle: "SEO (Search Engine Optimisation)",
        title: "SEO (Search Engine Optimisation)",
        summary: "Understand how search engines crawl, index, and rank content, keyword intent, on-page checklist, and technical SEO essentials.",
        contentSections: [
          {
            id: "m4-s1",
            title: "How Search Engines Work",
            type: "table",
            table: {
              headers: ["Process", "Description"],
              rows: [
                ["Crawling", "Bots discover pages by following links across the web"],
                ["Indexing", "Pages are stored in the search engine's database"],
                ["Ranking", "Algorithms determine which pages show for a given query"]
              ]
            }
          },
          {
            id: "m4-s2",
            title: "E-E-A-T — Google's Quality Framework",
            type: "calloutText",
            calloutText: "⭐ E-E-A-T Quality Framework:\nExperience • Expertise • Authority • Trustworthiness"
          },
          {
            id: "m4-s3",
            title: "Keyword Research & Search Intent",
            type: "checklist",
            checklist: [
              {
                label: "Types of Keywords",
                items: [
                  "Short-tail: 'SEO' — high volume, high competition",
                  "Long-tail: 'how to do SEO for small business' — lower volume, higher intent",
                  "LSI Keywords: semantically related terms Google expects to see"
                ]
              },
              {
                label: "4 Types of Search Intent",
                items: [
                  "Informational: 'what is SEO'",
                  "Navigational: 'Ahrefs login'",
                  "Commercial: 'best SEO tools 2024'",
                  "Transactional: 'buy SEO course'"
                ]
              }
            ]
          },
          {
            id: "m4-s4",
            title: "On-Page SEO Checklist",
            type: "table",
            table: {
              headers: ["Element", "Requirement"],
              rows: [
                ["Title Tag", "50–60 chars, primary keyword near the front"],
                ["Meta Description", "150–160 chars, keyword + compelling reason to click"],
                ["URL", "Short, keyword-rich, use hyphens not underscores"],
                ["H1", "One per page, contains primary keyword"],
                ["H2/H3", "Use secondary keywords, create scannable structure"],
                ["Images", "Descriptive file names and alt text with keywords"],
                ["Internal Links", "Link to 3–5 related pages with descriptive anchor text"]
              ]
            }
          },
          {
            id: "m4-s5",
            title: "Off-Page & Local SEO",
            type: "checklist",
            imageUrl: "/assets/images/local_seo_backlinks.jpg",
            checklist: [
              {
                label: "Backlink Building Strategies",
                items: [
                  "Guest Posting: Guest posting on industry blogs",
                  "Broken Link Building: Replace dead links with your content"
                ]
              },
              {
                label: "Local SEO",
                items: [
                  "Google Business Profile: Complete every field, add photos weekly, respond to all reviews",
                  "Local Citations: List on Yelp, Yellow Pages, and local directories"
                ]
              }
            ]
          },
          {
            id: "m4-s6",
            title: "Technical SEO",
            type: "checklist",
            checklist: [
              {
                label: "Technical SEO Essentials",
                items: [
                  "Schema Markup: Structured data helps Google understand your content type",
                  "Sitemap: XML sitemap for search engine indexing",
                  "Robots.txt: Directs search bot crawling permissions",
                  "Google Search Console: GSC setup for indexing and search performance",
                  "Google Analytics: GA4 setup for web traffic and user tracking"
                ]
              }
            ]
          }
        ],
        practiceTask: {
          title: "",
          description: "",
          actionSteps: []
        },
        referenceLinks: []
      }
    ]
  },
  {
    id: 5,
    code: "M5",
    title: "Paid Advertising",
    subtitle: "Meta Ads, Copywriting Formulas & Full-Funnel Strategy",
    dayRange: "Days 20–24",
    startDay: 20,
    endDay: 24,
    description: "Run profitable paid campaigns. Master Meta Ads Manager 3-level structure, audience targeting, Meta Pixel tracking, AIDA/PAS copywriting, key ad metrics, and scaling rules.",
    iconName: "DollarSign",
    color: "from-blue-600 to-cyan-500",
    days: [
      {
        id: 20,
        dayNumber: 20,
        moduleId: 5,
        moduleTitle: "Paid Advertising",
        title: "Why Paid Ads?",
        summary: "Organic reach is declining. Paid ads let you reach exactly the right person, at the right time, with the right message — at scale and with measurable ROI.",
        contentSections: [
          {
            id: "m5-s1",
            title: "Why Paid Ads?",
            type: "text",
            content: "Organic reach is declining. Paid ads let you reach exactly the right person, at the right time, with the right message — at scale and with measurable ROI."
          },
          {
            id: "m5-s2",
            title: "Key Ad Platforms",
            type: "table",
            table: {
              headers: ["Platform", "Best For"],
              rows: [
                ["Meta Ads", "B2C, visual products, impulse buys"],
                ["Google Ads", "High-intent buyers actively searching"],
                ["LinkedIn Ads", "B2B and professional services"],
                ["TikTok Ads", "Gen Z/millennial consumer products"]
              ]
            }
          },
          {
            id: "m5-s3",
            title: "Meta Ads Manager — 3-Level Campaign Structure",
            type: "table",
            table: {
              headers: ["Level", "What You Set"],
              rows: [
                ["Campaign", "Objective: Conversions, Traffic, or Awareness"],
                ["Ad Set", "Audience, placement, budget, and schedule"],
                ["Ad", "Creative: image/video, copy, headline, CTA button"]
              ]
            }
          },
          {
            id: "m5-s4",
            title: "Audience Types",
            type: "checklist",
            checklist: [
              {
                label: "Targeting Audience Types",
                items: [
                  "Saved Audience: Demographic + interest targeting",
                  "Custom Audience: Email list, website visitors, video viewers",
                  "Lookalike Audience: Meta finds people similar to your best customers (start with 1%)"
                ]
              }
            ]
          },
          {
            id: "m5-s5",
            title: "Meta Pixel",
            type: "calloutText",
            calloutText: "⚡ META PIXEL:\nA code snippet placed on your website that tracks visitor actions (views, purchases, add-to-cart).\nEssential for conversion tracking and retargeting campaigns."
          },
          {
            id: "m5-s6",
            title: "Ad Creatives & Copywriting",
            type: "checklist",
            checklist: [
              {
                label: "Copywriting Formulas",
                items: [
                  "AIDA: Attention → Interest → Desire → Action",
                  "PAS: Problem → Agitate → Solution"
                ]
              },
              {
                label: "Ad Copy Structure",
                items: [
                  "Primary Text: First 125 chars must compel without truncation",
                  "Headline: 5 words max, bold benefit or number",
                  "Description: Reinforce the offer, add urgency"
                ]
              }
            ]
          },
          {
            id: "m5-s7",
            title: "Key Metrics to Track",
            type: "table",
            table: {
              headers: ["Metric", "Benchmark", "What It Means"],
              rows: [
                ["CTR", "1–3%+ for cold audiences", "Click-through rate on your ad"],
                ["CPA", "Below your target cost", "Cost per acquisition — most important metric"],
                ["ROAS", "3x minimum", "Revenue divided by Ad Spend"],
                ["CPM", "Lower = better", "Cost per 1,000 impressions — shows audience cost"]
              ]
            }
          },
          {
            id: "m5-s8",
            title: "Full-Funnel Strategy",
            type: "flow",
            flowSteps: [
              "1. TOF (Top of Funnel): Awareness — broad audiences, video ads",
              "2. MOF (Middle of Funnel): Consideration — retarget video viewers and website visitors",
              "3. BOF (Bottom of Funnel): Conversion — retarget add-to-carts, email subscribers"
            ]
          },
          {
            id: "m5-s9",
            title: "Scaling Rules",
            type: "calloutText",
            calloutText: "🚀 SCALING RULES:\n• Increase budget by max 20% every 2–3 days\n• Kill ad sets with no conversions after spending 2× your target CPA"
          }
        ],
        practiceTask: {
          title: "",
          description: "",
          actionSteps: []
        },
        referenceLinks: []
      }
    ]
  },
  {
    id: 6,
    code: "M6",
    title: "WordPress",
    subtitle: "Domain, Hosting, Plugins, Pages & Speed Checklist",
    dayRange: "Days 25–27",
    startDay: 25,
    endDay: 27,
    description: "Build high-speed, SEO-friendly websites using WordPress. Learn domain/hosting setup, plugin installation, essential pages, Core Web Vitals, and page speed optimization.",
    iconName: "Globe",
    color: "from-teal-500 to-green-600",
    days: [
      {
        id: 25,
        dayNumber: 25,
        moduleId: 6,
        moduleTitle: "WordPress",
        title: "WordPress Setup & Speed Optimisation",
        summary: "Step-by-step domain purchase, hosting connection, essential plugins, page architecture, and speed optimization.",
        contentSections: [
          {
            id: "m6-s1",
            title: "Domain & Hosting Setup (Simple)",
            type: "table",
            table: {
              headers: ["Step", "Action", "Instructions"],
              rows: [
                ["1. Buy Domain & Hosting", "Domain & Server", "Buy your domain from GoDaddy or Namecheap (.com) and purchase a beginner hosting plan (Hostinger / Bluehost)."],
                ["2. Connect DNS (Simple)", "Update Nameservers", "Go to domain provider DNS settings, replace nameservers with hosting provider's, and wait up to 24 hrs for propagation."],
                ["3. WordPress Setup", "Install & Set URL", "Use 1-click install in hosting panel. In WordPress, go to Settings → General → add domain name in Site Address (URL)."]
              ]
            }
          },
          {
            id: "m6-s2",
            title: "Essential Plugins (Install Immediately)",
            type: "table",
            table: {
              headers: ["Plugin", "Purpose"],
              rows: [
                ["Yoast SEO or Rank Math", "SEO optimisation"],
                ["WP Rocket or W3 Total Cache", "Site speed"],
                ["Wordfence", "Security and firewall"],
                ["WPForms or Contact Form 7", "Contact forms"],
                ["Smush or ShortPixel", "Image compression"],
                ["UpdraftPlus", "Automatic backups"]
              ]
            }
          },
          {
            id: "m6-s3",
            title: "Building Pages & 5 Essential Pages",
            type: "checklist",
            checklist: [
              {
                label: "Page Builders",
                items: [
                  "Gutenberg (built-in): Block editor, improving rapidly, free",
                  "Elementor (plugin): Drag-and-drop, most popular, powerful free version"
                ]
              },
              {
                label: "5 Essential Pages Every Site Needs",
                items: [
                  "Homepage: Clear UVP, social proof, CTA above the fold",
                  "About Page: Your story, credentials, why you",
                  "Services / Products Page: What you offer, pricing if appropriate",
                  "Contact Page: Form + phone + location + hours",
                  "Blog: For SEO content and thought leadership"
                ]
              }
            ]
          },
          {
            id: "m6-s4",
            title: "Core Web Vitals — Google Ranking Factor",
            type: "table",
            table: {
              headers: ["Metric", "Target", "What It Measures"],
              rows: [
                ["LCP (Largest Contentful Paint)", "Under 2.5 seconds", "How fast main content loads"],
                ["INP (Interaction to Next Paint)", "Under 200ms", "Responsiveness to user interaction"],
                ["CLS (Cumulative Layout Shift)", "Under 0.1", "Visual stability of the page"]
              ]
            }
          },
          {
            id: "m6-s5",
            title: "Speed Optimisation Checklist",
            type: "checklist",
            checklist: [
              {
                label: "Speed Optimisation Master Checklist",
                items: [
                  "Lightweight Theme: Use GeneratePress, Kadence, or Astra",
                  "Image Compression: Compress all images before upload (TinyPNG or use Smush plugin)",
                  "Enable Caching: Use WP Rocket or LiteSpeed Cache",
                  "Cloudflare CDN: Enable Cloudflare CDN (free tier)",
                  "Limit Plugins: Only keep what you actively use",
                  "Google PageSpeed: Test with Google PageSpeed Insights and fix identified issues"
                ]
              }
            ]
          }
        ],
        practiceTask: {
          title: "",
          description: "",
          actionSteps: []
        },
        referenceLinks: []
      }
    ]
  },
  {
    id: 7,
    code: "M7",
    title: "Freelancing",
    subtitle: "Contracts, Invoicing, Scope of Work, Reports & Content Calendar",
    dayRange: "Days 28–30",
    startDay: 28,
    endDay: 30,
    description: "Turn your skills into a profitable freelancing business. Master client contracts, invoicing, scope of work clauses, client reporting templates, and content calendars.",
    iconName: "Briefcase",
    color: "from-rose-500 to-red-600",
    days: [
      {
        id: 28,
        dayNumber: 28,
        moduleId: 7,
        moduleTitle: "Freelancing",
        title: "Contracts, Invoicing & Portfolio",
        summary: "Protect your freelance business with solid contracts, clear scope boundaries, client reports, and content calendars.",
        contentSections: [
          {
            id: "m7-s1",
            title: "Contracts, Invoicing & Portfolio",
            type: "checklist",
            checklist: [
              {
                label: "Scope of Work Must Include",
                items: [
                  "Deliverables: Exactly what you will produce",
                  "Timeline: Timeline and milestones",
                  "Revisions: Number of revision rounds",
                  "Payment Terms: 50% upfront is standard",
                  "Out-of-Scope Clause: Extra work = extra charge"
                ]
              }
            ]
          },
          {
            id: "m7-s2",
            title: "1. Meta Ads Report",
            type: "table",
            table: {
              headers: ["Section", "What to Include"],
              rows: [
                ["Campaign Overview", "Date range, total spend, impressions, reach"],
                ["Key Metrics", "CTR, CPA, ROAS, CPM for each campaign/ad set"],
                ["Top Performing Ads", "Creative, copy, and results of best performers"],
                ["Audience Insights", "Demographics, placements, and device breakdown"],
                ["Recommendations", "What to scale, pause, or test next"],
                ["Next Steps", "Action plan for the coming period"]
              ]
            }
          },
          {
            id: "m7-s3",
            title: "2. SEO Report",
            type: "table",
            table: {
              headers: ["Section", "What to Include"],
              rows: [
                ["Traffic Overview", "Organic sessions, users, bounce rate (GA4)"],
                ["Keyword Rankings", "Top keywords, position changes, new rankings"],
                ["Technical Issues", "Crawl errors, Core Web Vitals, broken links"],
                ["Backlink Summary", "New links acquired, domain authority trend"],
                ["On-Page Work Done", "Pages optimised, content updated"],
                ["Recommendations", "Priority fixes and opportunities for next month"]
              ]
            }
          },
          {
            id: "m7-s4",
            title: "3. Content Calendar",
            type: "table",
            content: "Fill one calendar per month. Include: date, platform, content format (Reel/Story/Post/Blog), topic or hook, and the goal (Education/Proof/Personal).",
            table: {
              headers: ["Date", "Platform", "Format", "Topic / Hook", "Goal"],
              rows: [
                ["Week 1", "Instagram", "Reel (15s)", "3 Common Mistakes & Fixes", "Education"],
                ["Week 2", "LinkedIn", "Text + Carousel", "Client Case Study & ROI Breakdown", "Proof"],
                ["Week 3", "TikTok / Reels", "Talking Head", "Behind the scenes of our workflow", "Personal"],
                ["Week 4", "Blog / Newsletter", "Article", "Complete Beginner Strategy Guide", "Education"]
              ]
            }
          }
        ],
        practiceTask: {
          title: "",
          description: "",
          actionSteps: []
        },
        referenceLinks: []
      }
    ]
  }
];

export const FLASHCARDS_DATA: Flashcard[] = [
  // Module 1 (1-6)
  { id: 1, moduleId: 1, moduleCode: "M1", moduleTitle: "Intro to Digital Marketing", question: "What is Digital Marketing?", answer: "Digital marketing is the promotion of products or services using digital channels and technologies. Unlike traditional marketing, it is measurable, targeted, and interactive." },
  { id: 2, moduleId: 1, moduleCode: "M1", moduleTitle: "Intro to Digital Marketing", question: "What are the 6 core channels of digital marketing?", answer: "1. SEO – getting found organically on search engines\n2. Content Marketing – blogs, videos, podcasts, infographics\n3. Social Media Marketing – Instagram, LinkedIn, TikTok, Twitter/X\n4. Email Marketing – newsletters, welcome sequences, drip campaigns\n5. Paid Advertising – Google Ads, Meta Ads, LinkedIn Ads\n6. Affiliate & Influencer Marketing" },
  { id: 3, moduleId: 1, moduleCode: "M1", moduleTitle: "Intro to Digital Marketing", question: "Which primary tools are used for Analytics?", answer: "Google Analytics 4 (GA4), Google Search Console" },
  { id: 4, moduleId: 1, moduleCode: "M1", moduleTitle: "Intro to Digital Marketing", question: "Which essential tools are used for Graphic Design & SEO?", answer: "Design: Canva, Adobe Express, Figma\nSEO: Ahrefs Free, Ubersuggest, Google Keyword Planner" },
  { id: 5, moduleId: 1, moduleCode: "M1", moduleTitle: "Intro to Digital Marketing", question: "Which essential tools are used for Social Scheduling & Ads?", answer: "Social Scheduling: Buffer, Later, Hootsuite, Meta Business Suite\nAds: Meta Ads Manager, Google Ads" },
  { id: 6, moduleId: 1, moduleCode: "M1", moduleTitle: "Intro to Digital Marketing", question: "How does Digital Marketing differ from Traditional Marketing?", answer: "Unlike traditional marketing, digital marketing is measurable, targeted, and interactive." },

  // Module 2 (7-12)
  { id: 7, moduleId: 2, moduleCode: "M2", moduleTitle: "Personal Branding", question: "What are the 3 Pillars of a strong personal brand?", answer: "1. Identity (Clarity - who you help & what problem you solve)\n2. Credibility (Trust - social proof & case studies)\n3. Visibility (Consistency - content output)" },
  { id: 8, moduleId: 2, moduleCode: "M2", moduleTitle: "Personal Branding", question: "Write down the exact Unique Value Proposition (UVP) formula.", answer: 'Formula: "I help [TARGET AUDIENCE] achieve [RESULT] through [METHOD]"' },
  { id: 9, moduleId: 2, moduleCode: "M2", moduleTitle: "Personal Branding", question: "What are the 3 core content buckets for personal branding?", answer: "1. Educational (Demonstrates skill)\n2. Proof / Authority (Builds trust)\n3. Personal / Relatable (Humanizes brand)" },
  { id: 10, moduleId: 2, moduleCode: "M2", moduleTitle: "Personal Branding", question: "What elements are required for an optimized LinkedIn profile?", answer: "Professional headshot, custom banner displaying UVP, keyword-rich headline, compelling About section, and a Featured section highlighting top work." },
  { id: 11, moduleId: 2, moduleCode: "M2", moduleTitle: "Personal Branding", question: "What 3 steps are required to launch a personal brand?", answer: "1. Be clear about your skill\n2. Choose your target audience\n3. Create content that works consistently" },
  { id: 12, moduleId: 2, moduleCode: "M2", moduleTitle: "Personal Branding", question: "Why is a searchable Instagram Name field important?", answer: "Instagram indexes the Name field for search queries. Adding keywords (e.g. 'Alex | SEO Specialist') allows prospective clients to discover your profile organically." },

  // Module 3 (13-18)
  { id: 13, moduleId: 3, moduleCode: "M3", moduleTitle: "Content Creation", question: "Explain the Rule of Thirds content mix.", answer: "33% Educational Content (Value & growth)\n33% Proof Content (Client results & case studies)\n33% Personal Content (Relatability & story)" },
  { id: 14, moduleId: 1, moduleCode: "M3", moduleTitle: "Content Creation", question: "What is the 5-part video script structure?", answer: "1. Hook (First 3 seconds)\n2. Problem / Relatable Situation\n3. Solution / Value\n4. Proof / Example\n5. Call to Action (CTA)" },
  { id: 15, moduleId: 3, moduleCode: "M3", moduleTitle: "Content Creation", question: "List the 5 main hook types for short-form video.", answer: "1. Question Hook\n2. Bold Statement Hook\n3. Curiosity Hook\n4. Pain Point Hook\n5. Story Hook" },
  { id: 16, moduleId: 3, moduleCode: "M3", moduleTitle: "Content Creation", question: "What is the 60-30-10 color rule in graphic design?", answer: "60% Dominant canvas color (White/Dark), 30% Secondary brand accent color, 10% High-contrast highlight color for call-to-action buttons/text." },
  { id: 17, moduleId: 3, moduleCode: "M3", moduleTitle: "Content Creation", question: "Describe the content journey from stranger to client.", answer: "Stranger → Follows for value → Builds trust → Engages → Becomes a lead → Converts to paying client." },
  { id: 18, moduleId: 3, moduleCode: "M3", moduleTitle: "Content Creation", question: "What are typography rules for clean marketing graphics?", answer: "Limit to max 2 font families (1 bold for headlines, 1 readable for body) and maintain 2x font size contrast." },

  // Module 4 (19-24)
  { id: 19, moduleId: 4, moduleCode: "M4", moduleTitle: "SEO", question: "What are the 3 steps of how search engines work?", answer: "1. Crawling (Bot discovers pages via links)\n2. Indexing (Analyzes and stores page content)\n3. Ranking (Algorithmic ordering for queries)" },
  { id: 20, moduleId: 4, moduleCode: "M4", moduleTitle: "SEO", question: "What does Google's E-E-A-T stand for?", answer: "Experience, Expertise, Authoritativeness, and Trustworthiness." },
  { id: 21, moduleId: 4, moduleCode: "M4", moduleTitle: "SEO", question: "What are the 4 types of Search Intent?", answer: "1. Informational (Learning)\n2. Navigational (Finding brand site)\n3. Commercial (Comparing options)\n4. Transactional (Buying now)" },
  { id: 22, moduleId: 4, moduleCode: "M4", moduleTitle: "SEO", question: "What is the optimal character length for Title Tags and Meta Descriptions?", answer: "Title Tag: 50–60 characters.\nMeta Description: 140–160 characters." },
  { id: 23, moduleId: 4, moduleCode: "M4", moduleTitle: "SEO", question: "What is the difference between Short-Tail and Long-Tail keywords?", answer: "Short-Tail (e.g. 'SEO') has high volume and high competition. Long-Tail (e.g. 'SEO agency for dentists in Chennai') has lower volume but higher conversion intent." },
  { id: 24, moduleId: 4, moduleCode: "M4", moduleTitle: "SEO", question: "What technical files help Google crawl a website effectively?", answer: "XML Sitemap (lists all page URLs for indexing) and Robots.txt (defines crawler permissions and blocked folders)." },

  // Module 5 (25-30)
  { id: 25, moduleId: 5, moduleCode: "M5", moduleTitle: "Paid Advertising", question: "What is the 3-level structure of Meta Ads Manager?", answer: "1. Campaign Level (Objective)\n2. Ad Set Level (Budget, Audience, Placement)\n3. Ad Level (Creative, Copy, Link)" },
  { id: 26, moduleId: 5, moduleCode: "M5", moduleTitle: "Paid Advertising", question: "Explain the difference between Custom and Lookalike Audiences.", answer: "Custom Audience retargets people who already interacted with your brand (web visitors, page engagers). Lookalike Audience is a cold audience that algorithmically mirrors your best custom audience." },
  { id: 27, moduleId: 5, moduleCode: "M5", moduleTitle: "Paid Advertising", question: "What is the formula for calculating ROAS (Return On Ad Spend)?", answer: "ROAS = Total Revenue Generated from Ads / Total Ad Spend. (Target > 3x for profitability)." },
  { id: 28, moduleId: 5, moduleCode: "M5", moduleTitle: "Paid Advertising", question: "What do AIDA and PAS copywriting acronyms stand for?", answer: "AIDA: Attention → Interest → Desire → Action.\nPAS: Problem → Agitate → Solution." },
  { id: 29, moduleId: 5, moduleCode: "M5", moduleTitle: "Paid Advertising", question: "What is Meta Pixel and why is it essential?", answer: "Meta Pixel is a tracking code installed on a website to track conversions (purchases, leads) and build retargeting audiences for ad campaigns." },
  { id: 30, moduleId: 5, moduleCode: "M5", moduleTitle: "Paid Advertising", question: "What is Vertical Scaling vs Horizontal Scaling in Meta Ads?", answer: "Vertical Scaling: Increasing ad set budget by 15-20% every 48h. Horizontal Scaling: Duplicating winning creatives into new audience ad sets." },

  // Module 6 (31-36)
  { id: 31, moduleId: 6, moduleCode: "M6", moduleTitle: "WordPress", question: "What are the 4 steps to connect a custom domain to WordPress hosting?", answer: "1. Buy Domain\n2. Buy Hosting\n3. Update Nameservers (NS records)\n4. Install WordPress via 1-Click Installer" },
  { id: 32, moduleId: 6, moduleCode: "M6", moduleTitle: "WordPress", question: "Name 5 essential WordPress plugins and their functions.", answer: "1. Rank Math (SEO)\n2. Elementor (Page Builder)\n3. Wordfence (Security)\n4. WP Rocket / LiteSpeed (Caching & Speed)\n5. WPForms (Contact Forms)" },
  { id: 33, moduleId: 6, moduleCode: "M6", moduleTitle: "WordPress", question: "What are the 5 essential pages every business website needs?", answer: "1. Homepage\n2. About Page\n3. Services/Products Page\n4. Contact Page\n5. Blog" },
  { id: 34, moduleId: 6, moduleCode: "M6", moduleTitle: "WordPress", question: "What are the 3 Core Web Vitals metrics and their targets?", answer: "1. LCP (Largest Contentful Paint) < 2.5s\n2. INP (Interaction to Next Paint) < 200ms\n3. CLS (Cumulative Layout Shift) < 0.1" },
  { id: 35, moduleId: 6, moduleCode: "M6", moduleTitle: "WordPress", question: "What image format should be used for optimal website speed?", answer: "Next-gen WebP format (provides high visual quality with 30-50% smaller file sizes than PNG/JPEG)." },
  { id: 36, moduleId: 6, moduleCode: "M6", moduleTitle: "WordPress", question: "How does a CDN (Content Delivery Network) improve site speed?", answer: "A CDN caches static site files across global servers so visitors load content from the server geographically closest to them." },

  // Module 7 (37-42)
  { id: 37, moduleId: 7, moduleCode: "M7", moduleTitle: "Freelancing", question: "What 6 essential clauses must be in a freelance Scope of Work contract?", answer: "1. Deliverables\n2. Timeline\n3. Milestones / Payments\n4. Revision rounds limit\n5. Payment terms (Net 7/15)\n6. Out-of-scope clause" },
  { id: 38, moduleId: 7, moduleCode: "M7", moduleTitle: "Freelancing", question: "Why is an Out-of-Scope contract clause critical?", answer: "It prevents scope creep by explicitly specifying hourly/fixed billing fees for any work requested outside original deliverables." },
  { id: 39, moduleId: 7, moduleCode: "M7", moduleTitle: "Freelancing", question: "What metrics should be included in a monthly Meta Ads client report?", answer: "Ad Spend, Impressions, Link Clicks, Conversions (Leads/Sales), Cost Per Lead (CPL), and Return On Ad Spend (ROAS)." },
  { id: 40, moduleId: 7, moduleCode: "M7", moduleTitle: "Freelancing", question: "What metrics should be highlighted in an SEO client report?", answer: "Organic Sessions, Top 10 Ranked Keywords, Domain Authority, Organic Inquiries, and Backlinks Acquired." },
  { id: 41, moduleId: 7, moduleCode: "M7", moduleTitle: "Freelancing", question: "What 5 fields are included in a professional Content Calendar?", answer: "1. Date\n2. Platform\n3. Format\n4. Topic / Hook\n5. Goal" },
  { id: 42, moduleId: 7, moduleCode: "M7", moduleTitle: "Freelancing", question: "How does showing client impact in reports help retain clients?", answer: "Translating technical metrics (CTR, impressions) into business impact (more leads, lower acquisition costs) demonstrates clear ROI and justifies ongoing monthly retainers." }
];

export const PLANNER_DATA: PlannerDay[] = Array.from({ length: 30 }, (_, index) => {
  const dayNum = index + 1;
  let modId = 1;
  let modCode = "M1";
  let title = "";
  let study = "";
  let practice = "";

  if (dayNum <= 4) {
    modId = 1; modCode = "M1";
    if (dayNum === 1) { title = "What is Digital Marketing?"; study = "Study digital marketing definition, core channels & key tools"; practice = "Review the 6 core channels"; }
    else if (dayNum === 2) { title = "Core Channels"; study = "Study SEO, Content, Social, Email, Paid Ads & Affiliate channels"; practice = "Review channel applications"; }
    else if (dayNum === 3) { title = "Key Marketing Tools"; study = "Study Analytics, Design, SEO, Social & Ads tools"; practice = "Familiarize with tool stack"; }
    else { title = "Module 1 Review"; study = "Review Module 1 fundamentals"; practice = "Complete knowledge check"; }
  } else if (dayNum <= 9) {
    modId = 2; modCode = "M2";
    if (dayNum === 5) { title = "3 Pillars of Personal Brand"; study = "Study Identity, Credibility & Visibility plus reference profiles"; practice = "Analyze 4 reference profile links"; }
    else if (dayNum === 6) { title = "Your UVP Formula"; study = "Study Unique Value Proposition formula & personal brand setup steps"; practice = "Write 3 variations of your UVP"; }
    else if (dayNum === 7) { title = "3 Types of Content"; study = "Study Educational, Proof, and Personal content buckets"; practice = "Brainstorm 6 content ideas"; }
    else if (dayNum === 8) { title = "Profile Optimisation Checklist"; study = "Study LinkedIn and Instagram optimization checklist"; practice = "Audit and update your social profiles"; }
    else { title = "Module 2 Review"; study = "Review personal branding foundation"; practice = "Complete Flashcards 7–12"; }
  } else if (dayNum <= 15) {
    modId = 3; modCode = "M3";
    if (dayNum === 10) { title = "Rule of Thirds & Video Scripts"; study = "Study 33-33-33 mix & 5-part video script structure"; practice = "Write a 30-second short-form script"; }
    else if (dayNum === 11) { title = "5 Powerful Hook Types"; study = "Study Question, Bold, Curiosity, Pain Point & Story hooks"; practice = "Write 5 hook variations for 1 topic"; }
    else if (dayNum === 12) { title = "10 Video Content Formats"; study = "Study all 10 viral video content formats"; practice = "Select 3 formats for your niche"; }
    else if (dayNum === 13) { title = "Algorithm Growth & Journey Flow"; study = "Study algorithm retention factors & audience-to-client funnel flow"; practice = "Map out your lead magnet DM funnel"; }
    else if (dayNum === 14) { title = "Design Basics for Marketers"; study = "Study typography, color theory, 60-30-10 rule & Canva tips"; practice = "Design 3-slide Canva carousel"; }
    else { title = "CapCut Editing & Module 3 Review"; study = "Study CapCut jump-cut captions & sound FX editing workflow"; practice = "Complete Flashcards 13–18"; }
  } else if (dayNum <= 19) {
    modId = 4; modCode = "M4";
    if (dayNum === 16) { title = "How Search Engines Work & E-E-A-T"; study = "Study Crawling → Indexing → Ranking and E-E-A-T trust signals"; practice = "Perform E-E-A-T site audit"; }
    else if (dayNum === 17) { title = "Keyword Research & Search Intent"; study = "Study Short-tail, Long-tail, LSI keywords & 4 intent categories"; practice = "Find 5 long-tail keywords"; }
    else if (dayNum === 18) { title = "On-Page SEO & Backlinks"; study = "Study On-page checklist table & backlink building strategies"; practice = "Write Title Tag & Meta Description"; }
    else { title = "Technical SEO & Module 4 Review"; study = "Study Schema, Sitemap, Robots.txt, GSC & GA4"; practice = "Complete Flashcards 19–24"; }
  } else if (dayNum <= 24) {
    modId = 5; modCode = "M5";
    if (dayNum === 20) { title = "Why Paid Ads & Meta Architecture"; study = "Study ad platform selection & Meta 3-level campaign structure"; practice = "Map out campaign objective & ad sets"; }
    else if (dayNum === 21) { title = "Audience Targeting & Meta Pixel"; study = "Study Saved, Custom, Lookalike audiences & Pixel setup"; practice = "Write targeting parameters"; }
    else if (dayNum === 22) { title = "Ad Copywriting Formulas"; study = "Study AIDA & PAS copywriting frameworks"; practice = "Write 2 ad copy variations"; }
    else if (dayNum === 23) { title = "Ad Metrics & Full-Funnel Strategy"; study = "Study CTR, CPA, ROAS, CPM formulas & TOF/MOF/BOF funnel"; practice = "Calculate ROAS and CPA"; }
    else { title = "Scaling Rules & Module 5 Review"; study = "Study Vertical vs Horizontal scaling rules"; practice = "Complete Flashcards 25–30"; }
  } else if (dayNum <= 27) {
    modId = 6; modCode = "M6";
    if (dayNum === 25) { title = "Domain & Hosting Setup"; study = "Study domain registration, hosting & 1-click WP installation"; practice = "Audit DNS nameservers"; }
    else if (dayNum === 26) { title = "Plugins & 5 Essential Pages"; study = "Study essential plugins table & 5-page site architecture"; practice = "Sketch homepage sitemap"; }
    else { title = "Core Web Vitals & Speed Checklist"; study = "Study LCP, INP, CLS & speed optimization checklist"; practice = "Run Google PageSpeed Insights test"; }
  } else {
    modId = 7; modCode = "M7";
    if (dayNum === 28) { title = "Contracts & Scope of Work"; study = "Study 6 mandatory contract clauses & out-of-scope protection"; practice = "Draft revision & out-of-scope clause"; }
    else if (dayNum === 29) { title = "Client Reports Templates"; study = "Study Meta Ads and SEO monthly client report tables"; practice = "Write executive summary email"; }
    else { title = "Master Content Calendar & Graduation"; study = "Study content calendar template & finalize study guide review"; practice = "Complete Flashcards 31–42 & celebrate completion!"; }
  }

  return {
    dayNumber: dayNum,
    moduleId: modId,
    moduleCode: modCode,
    title,
    studyTask: study,
    practiceTask: practice
  };
});
