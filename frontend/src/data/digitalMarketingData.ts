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
    subtitle: "Fundamentals, Core Channels & Essential Tools",
    dayRange: "Days 1–4",
    startDay: 1,
    endDay: 4,
    description: "Build a strong foundation in digital marketing concepts, understand the difference between organic and paid marketing, and master essential tools used by top industry professionals.",
    iconName: "Compass",
    color: "from-blue-500 to-indigo-600",
    days: [
      {
        id: 1,
        dayNumber: 1,
        moduleId: 1,
        moduleTitle: "Introduction to Digital Marketing",
        title: "What is Digital Marketing?",
        summary: "Understand the core concepts of digital marketing, organic vs paid reach, and traditional vs digital channels.",
        contentSections: [
          {
            id: "m1-d1-s1",
            title: "What is Digital Marketing?",
            type: "text",
            content: "Digital marketing encompasses all marketing efforts that use an electronic device or the internet. Businesses leverage digital channels such as search engines, social media, email, and websites to connect with current and prospective customers."
          },
          {
            id: "m1-d1-s2",
            title: "Core Channels",
            type: "checklist",
            checklist: [
              {
                label: "The 6 Essential Digital Marketing Channels",
                items: [
                  "SEO (Search Engine Optimization): Organic search engine visibility and ranking",
                  "Content Marketing: Creating valuable articles, videos, and guides to attract leads",
                  "Social Media Marketing: Building brand authority and community on Instagram, LinkedIn, YouTube",
                  "Email Marketing: Nurturing direct subscriber relationships and automating customer journeys",
                  "Paid Advertising: PPC and social ads on Meta Ads Manager and Google Ads",
                  "Affiliate & Influencer Marketing: Partnering with content creators and affiliates to expand reach"
                ]
              }
            ]
          },
          {
            id: "m1-d1-s3",
            title: "Key Differences: Traditional vs Digital",
            type: "table",
            table: {
              headers: ["Feature", "Traditional Marketing", "Digital Marketing"],
              rows: [
                ["Channels", "TV, Newspapers, Billboards, Radio", "Social Media, Search Engines, Email, Websites"],
                ["Targeting", "Broad / Regional demographic", "Hyper-targeted (Behavior, Interests, Intent)"],
                ["Measurability", "Difficult to calculate exact ROI", "Real-time tracking (CTR, Conversion Rate, ROAS)"],
                ["Cost", "High initial investment required", "Flexible budgets starting from minimal spend"],
                ["Interaction", "One-way broadcast communication", "Two-way interactive engagement"]
              ]
            }
          }
        ],
        practiceTask: {
          title: "Channel Audit Task",
          description: "Select 1 business of your choice (e.g. your favorite local restaurant or brand) and analyze their presence across digital channels.",
          actionSteps: [
            "Identify which 3 core digital channels they rely on most.",
            "Write down 2 areas where their digital presence can be improved.",
            "Save your notes below for your portfolio."
          ]
        },
        referenceLinks: [
          {
            id: "ref-m1-d1-1",
            title: "Google Digital Marketing Fundamentals",
            subtitle: "Google Skillshop Certification Guide",
            hasLink: false
          }
        ]
      },
      {
        id: 2,
        dayNumber: 2,
        moduleId: 1,
        moduleTitle: "Introduction to Digital Marketing",
        title: "Key Marketing Tools",
        summary: "Discover the must-have software tools for analytics, design, SEO, social scheduling, and paid ads.",
        contentSections: [
          {
            id: "m1-d2-s1",
            title: "Key Tools Every Marketer Needs",
            type: "table",
            table: {
              headers: ["Category", "Tools", "Primary Use Case"],
              rows: [
                ["Analytics", "Google Analytics 4 (GA4), Google Search Console", "Traffic analysis, user behavior tracking, and search impression indexing"],
                ["Design", "Canva, Adobe Express, Figma", "Visual graphic design, reel templates, UI mocks, and brand assets"],
                ["SEO", "Ahrefs Free, Ubersuggest, Google Keyword Planner", "Keyword research, backlink checking, and search volume estimation"],
                ["Social Scheduling", "Buffer, Later, Hootsuite, Meta Business Suite", "Content calendar scheduling, auto-publishing, and inbox management"],
                ["Paid Ads", "Meta Ads Manager, Google Ads", "Targeted ad creation, campaign optimization, and pixel tracking"]
              ]
            }
          },
          {
            id: "m1-d2-s2",
            title: "Tool Stack Strategy",
            type: "calloutText",
            calloutText: "Pro Tip: As a beginner or freelancer, start with free-tier tools (Canva Free, Meta Business Suite, Google Keyword Planner, GA4). Only upgrade to paid tools (Ahrefs Pro, Canva Pro) once you onboard paying clients."
          }
        ],
        practiceTask: {
          title: "Tool Setup Assignment",
          description: "Set up free accounts for Google Analytics 4 (or setup demo account), Canva, and Meta Business Suite.",
          actionSteps: [
            "Create your free Canva account and explore templates.",
            "Access Meta Business Suite for your business page.",
            "Note down the primary function of each tool."
          ]
        },
        referenceLinks: [
          {
            id: "ref-m1-d2-1",
            title: "Google Analytics 4 Official Demo Account",
            hasLink: false
          }
        ]
      },
      {
        id: 3,
        dayNumber: 3,
        moduleId: 1,
        moduleTitle: "Introduction to Digital Marketing",
        title: "Ad Platforms Overview",
        summary: "Learn how major ad platforms operate, intent-based vs interest-based advertising.",
        contentSections: [
          {
            id: "m1-d3-s1",
            title: "Intent vs Interest Advertising",
            type: "table",
            table: {
              headers: ["Platform", "Type", "User Mindset"],
              rows: [
                ["Google Search Ads", "Intent-Based", "User is actively searching for a solution right now (e.g. 'best digital marketing agency in Chennai')"],
                ["Meta Ads (FB/IG)", "Interest-Based", "User is scrolling for entertainment; ads interrupt with compelling visuals"],
                ["LinkedIn Ads", "B2B Intent / Professional", "User is networking or researching industry solutions"],
                ["TikTok Ads", "Short-Form Attention", "User is looking for entertaining content and quick product discoveries"]
              ]
            }
          }
        ],
        practiceTask: {
          title: "Ad Analysis Task",
          description: "Find 2 sponsored ads on your Instagram feed and 2 sponsored ads on Google Search.",
          actionSteps: [
            "Screenshot the ads.",
            "Identify the headline, offer, and call-to-action (CTA).",
            "Write down why you think the ad targeted you."
          ]
        },
        referenceLinks: []
      },
      {
        id: 4,
        dayNumber: 4,
        moduleId: 1,
        moduleTitle: "Introduction to Digital Marketing",
        title: "Module 1 Review & Knowledge Check",
        summary: "Consolidate your learning from Module 1 and test your understanding of core concepts.",
        contentSections: [
          {
            id: "m1-d4-s1",
            title: "Key Takeaways — Module 1",
            type: "checklist",
            checklist: [
              {
                label: "Checklist for Module 1 Mastery",
                items: [
                  "Understood the 6 primary digital marketing channels",
                  "Memorized the core marketing tools across Analytics, Design, SEO, Social, and Ads",
                  "Differentiated between Search Intent vs Social Interest advertising",
                  "Completed Day 1–3 practical tasks and audit exercises"
                ]
              }
            ]
          }
        ],
        practiceTask: {
          title: "Module 1 Assessment Task",
          description: "Review all Module 1 flashcards (Cards 1–6) and achieve 100% 'I Know' status.",
          actionSteps: [
            "Go to the Flashcards tab.",
            "Filter by Module 1.",
            "Review each card until comfortable."
          ]
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
    description: "Position yourself as an authority in your niche. Master the 3 pillars of personal branding, establish clarity and trust, and optimize your LinkedIn and Instagram profiles.",
    iconName: "UserCheck",
    color: "from-purple-500 to-pink-600",
    days: [
      {
        id: 5,
        dayNumber: 5,
        moduleId: 2,
        moduleTitle: "Personal Branding",
        title: "3 Pillars of a Strong Personal Brand",
        summary: "Learn Identity (Clarity), Credibility (Trust), and Visibility (Consistency) with real-world reference profiles.",
        contentSections: [
          {
            id: "m2-d5-s1",
            title: "3 Pillars of a Strong Personal Brand",
            type: "checklist",
            checklist: [
              {
                label: "The 3 Foundational Pillars",
                items: [
                  "1. Identity (Clarity): Who are you? Who do you serve? What exact problem do you solve?",
                  "2. Credibility (Trust): Social proof, testimonials, case studies, and demonstrated expertise.",
                  "3. Visibility (Consistency): Consistently producing high-quality content across chosen platforms."
                ]
              }
            ]
          },
          {
            id: "m2-d5-s2",
            title: "Reference Profiles — Identity (Clarity)",
            type: "reference_list",
            content: "Study these reference profiles to see how leading creators establish absolute clarity in their identity and content positioning:",
            referenceLinks: [
              {
                id: "ref-m2-d5-1",
                title: "Dharaneetharan Instagram Reels",
                subtitle: "Clarity in short-form business & strategy content",
                url: "https://www.instagram.com/dharaneetharan/reels/",
                hasLink: true
              },
              {
                id: "ref-m2-d5-2",
                title: "Journey With Sudhan",
                subtitle: "Clarity in practical career & entrepreneurship advice",
                url: "https://www.instagram.com/journey_with_sudhan/",
                hasLink: true
              }
            ]
          },
          {
            id: "m2-d5-s3",
            title: "Reference Profiles — Credibility (Trust)",
            type: "reference_list",
            content: "Examine how these experts build trust through consistent value and authority:",
            referenceLinks: [
              {
                id: "ref-m2-d5-3",
                title: "Sakthivel Pannerselvam",
                subtitle: "Credibility and business growth consulting",
                url: "https://www.instagram.com/sakthivelpannerselvam6/",
                hasLink: true
              },
              {
                id: "ref-m2-d5-4",
                title: "Sangeetha Sabish",
                subtitle: "Credibility in branding & marketing education",
                url: "https://www.instagram.com/sangeethasabishek/",
                hasLink: true
              }
            ]
          }
        ],
        practiceTask: {
          title: "Reference Profile Study",
          description: "Open the 4 reference links above and analyze their bio statements, bio CTAs, and top 3 pinned reels/posts.",
          actionSteps: [
            "Click each [ View Reference ↗ ] link.",
            "Write down what makes their bio instantly clear.",
            "Identify their target audience."
          ]
        },
        referenceLinks: [
          {
            id: "ref-m2-d5-1",
            title: "Dharaneetharan Instagram Reels",
            url: "https://www.instagram.com/dharaneetharan/reels/",
            hasLink: true
          },
          {
            id: "ref-m2-d5-2",
            title: "Journey With Sudhan",
            url: "https://www.instagram.com/journey_with_sudhan/",
            hasLink: true
          },
          {
            id: "ref-m2-d5-3",
            title: "Sakthivel Pannerselvam",
            url: "https://www.instagram.com/sakthivelpannerselvam6/",
            hasLink: true
          },
          {
            id: "ref-m2-d5-4",
            title: "Sangeetha Sabish",
            url: "https://www.instagram.com/sangeethasabishek/",
            hasLink: true
          }
        ]
      },
      {
        id: 6,
        dayNumber: 6,
        moduleId: 2,
        moduleTitle: "Personal Branding",
        title: "Your Unique Value Proposition (UVP)",
        summary: "Formulate your clear UVP statement using the proven positioning formula.",
        contentSections: [
          {
            id: "m2-d6-s1",
            title: "The UVP Formula",
            type: "calloutText",
            calloutText: 'Formula: "I help [TARGET AUDIENCE] achieve [RESULT] through [METHOD]"\n\nExample from the guide: "I help small business owners get more clients through short-form content."'
          },
          {
            id: "m2-d6-s2",
            title: "Step-by-Step Personal Brand Setup",
            type: "checklist",
            checklist: [
              {
                label: "3 Steps to Launch Your Brand",
                items: [
                  "1. Be clear about your skill: Pick 1 core service (e.g., SEO, Short-Form Video, Meta Ads).",
                  "2. Choose your audience: Focus on a specific niche (e.g. real estate agents, e-commerce stores, coaches).",
                  "3. Create content that works: Educate, show proof, and share your journey."
                ]
              }
            ]
          }
        ],
        practiceTask: {
          title: "Write Your UVP",
          description: "Draft 3 variations of your Unique Value Proposition using the UVP formula.",
          actionSteps: [
            "Identify your primary skill.",
            "Define your specific target audience.",
            "Write down your final UVP in your student notes below."
          ]
        },
        referenceLinks: []
      },
      {
        id: 7,
        dayNumber: 7,
        moduleId: 2,
        moduleTitle: "Personal Branding",
        title: "3 Types of Content",
        summary: "Understand Educational, Proof, and Personal content buckets for authority building.",
        contentSections: [
          {
            id: "m2-d7-s1",
            title: "The 3 Content Buckets",
            type: "table",
            table: {
              headers: ["Content Bucket", "Purpose", "Example Ideas"],
              rows: [
                ["Educational", "Demonstrates technical expertise and solves immediate problems", "'5 Canva tricks for high-converting reels', 'How to write an ad script'"],
                ["Proof / Authority", "Builds trust and shows real client transformations", "Before vs After case studies, client review screenshots, campaign metrics"],
                ["Personal / Relatable", "Humanizes your brand and builds deep connection", "Behind-the-scenes work setup, lessons learned from failures, personal milestones"]
              ]
            }
          }
        ],
        practiceTask: {
          title: "Content Bucket Brainstorming",
          description: "Brainstorm 2 content ideas for each of the 3 buckets (6 total ideas).",
          actionSteps: [
            "Write 2 Educational topics.",
            "Write 2 Proof ideas.",
            "Write 2 Personal story ideas."
          ]
        },
        referenceLinks: []
      },
      {
        id: 8,
        dayNumber: 8,
        moduleId: 2,
        moduleTitle: "Personal Branding",
        title: "Profile Optimisation Checklist",
        summary: "Optimize your LinkedIn and Instagram profiles step-by-step for lead generation.",
        contentSections: [
          {
            id: "m2-d8-s1",
            title: "LinkedIn Profile Checklist",
            type: "checklist",
            checklist: [
              {
                label: "LinkedIn Optimisation Steps",
                items: [
                  "Professional Headshot: High quality, clear background, smiling face",
                  "Custom Banner: Displays your UVP statement and branding elements",
                  "Headline: Includes UVP + primary keyword (e.g. 'Digital Marketer | Helping E-com Brands Scale')",
                  "About Section: Hook story + problem solved + service details + call to action",
                  "Featured Section: Highlight top posts, case studies, or lead magnets"
                ]
              },
              {
                label: "Instagram Profile Checklist",
                items: [
                  "Name Field: Searchable keywords (e.g. 'Alex | Digital Marketing')",
                  "Bio: UVP + Key Achievement + Clear CTA",
                  "CTA (Call to Action): 'Book a call 👇' or 'Download free guide'",
                  "Link in Bio: Linktree / website booking link"
                ]
              }
            ]
          }
        ],
        practiceTask: {
          title: "Profile Audit & Update",
          description: "Audit your current Instagram or LinkedIn profile against the checklist above.",
          actionSteps: [
            "Update your profile photo and banner.",
            "Rewrite your bio using your new UVP.",
            "Add a clear call to action link."
          ]
        },
        referenceLinks: []
      },
      {
        id: 9,
        dayNumber: 9,
        moduleId: 2,
        moduleTitle: "Personal Branding",
        title: "Module 2 Review & Portfolio Launch",
        summary: "Review personal branding principles and prepare your personal profile for client outreach.",
        contentSections: [
          {
            id: "m2-d9-s1",
            title: "Module 2 Summary",
            type: "text",
            content: "You now have a clear identity, a defined target audience, a compelling UVP statement, and optimized profiles. This foundation will drive all your content creation efforts in Module 3."
          }
        ],
        practiceTask: {
          title: "Flashcard Review M2",
          description: "Complete all Module 2 flashcards (Cards 7–12) to solidify branding concepts.",
          actionSteps: [
            "Open Flashcards tab.",
            "Filter by Module 2.",
            "Mark mastered cards as 'I Know'."
          ]
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
        title: "Rule of Thirds — Content Mix & Video Script Structure",
        summary: "Balance your content calendar using the 33-33-33 rule and write winning short-form video scripts.",
        contentSections: [
          {
            id: "m3-d10-s1",
            title: "Rule of Thirds — Content Mix",
            type: "table",
            table: {
              headers: ["Ratio", "Content Type", "Goal"],
              rows: [
                ["33%", "Education", "Attract new followers, position authority, provide free value"],
                ["33%", "Proof", "Build client trust, display case studies and testimonials"],
                ["33%", "Personal", "Create emotional connection and relatable brand personality"]
              ]
            }
          },
          {
            id: "m3-d10-s2",
            title: "Video Script Structure",
            type: "flow",
            flowSteps: [
              "1. Hook (First 3 seconds: Grab attention immediately)",
              "2. Problem / Relatable Situation (State pain point clearly)",
              "3. Solution / Value (Provide actionable advice/step)",
              "4. Proof / Example (Show case study or live demo)",
              "5. CTA (Clear directive: Follow, Save, Comment, or DM)"
            ]
          }
        ],
        practiceTask: {
          title: "Write a 30-Second Reel Script",
          description: "Write a full 30-second short-form video script using the 5-part structure.",
          actionSteps: [
            "Write a strong opening hook.",
            "State a relatable problem.",
            "Provide a 2-step solution.",
            "End with a clear CTA in your student notes."
          ]
        },
        referenceLinks: []
      },
      {
        id: 11,
        dayNumber: 11,
        moduleId: 3,
        moduleTitle: "Content Creation",
        title: "5 Powerful Hook Types",
        summary: "Master hooks that stop the scroll and dramatically boost reel retention.",
        contentSections: [
          {
            id: "m3-d11-s1",
            title: "The 5 Scroll-Stopping Hook Types",
            type: "table",
            table: {
              headers: ["Hook Type", "Concept", "Example Template"],
              rows: [
                ["Question Hook", "Challenges user curiosity", "'Are you still making this mistake in your ads?'"],
                ["Bold Statement Hook", "Contrarian / Surprising claim", "'SEO is NOT dead, but you are doing it wrong.'"],
                ["Curiosity Hook", "Creates an open loop", "'The exact 3-step strategy I used to get 10k views...'"],
                ["Pain Point Hook", "Targets immediate frustration", "'Tired of posting reels with zero client inquiries?'"],
                ["Story Hook", "Personal narrative entry", "'3 months ago I had 0 clients. Here is what changed...'" ]
              ]
            }
          }
        ],
        practiceTask: {
          title: "Hook Variation Writing",
          description: "Pick 1 topic (e.g., 'Canva Tips') and write 5 different hooks using all 5 hook types.",
          actionSteps: [
            "Write Question Hook.",
            "Write Bold Statement Hook.",
            "Write Curiosity, Pain Point, and Story hooks."
          ]
        },
        referenceLinks: []
      },
      {
        id: 12,
        dayNumber: 12,
        moduleId: 3,
        moduleTitle: "Content Creation",
        title: "10 Video Content Formats",
        summary: "Explore all 10 video content formats from the source guide.",
        contentSections: [
          {
            id: "m3-d12-s1",
            title: "10 Video Content Formats",
            type: "checklist",
            checklist: [
              {
                label: "All 10 Proven Video Formats",
                items: [
                  "1. Hook-Based Viral Videos: Short 7-15s clips with strong text overlay and trending audio",
                  "2. Storytelling / Emotional: Personal journeys, overcoming obstacles, relatable lessons",
                  "3. Hook → Solution Format: Quick tip breakdown addressing a specific technical problem",
                  "4. Authority Building Reels: Screen-recording teardowns, expert insights, deep breakdowns",
                  "5. Client Process Videos: Behind-the-scenes showing your actual campaign setup or workflow",
                  "6. Client Results / Proof Videos: Dashboard metrics, revenue growth numbers, case studies",
                  "7. Trending / Seasonal Content: Adapting viral audios/memes to your specific niche",
                  "8. Customer Testimonial Videos: Video reviews or screenshot commentary from happy clients",
                  "9. Educational Content: Step-by-step tutorials, tool recommendations, resource lists",
                  "10. Behind-The-Scenes Content: A day in the life of a digital marketer/freelancer"
                ]
              }
            ]
          },
          {
            id: "m3-d12-s2",
            title: "Format Examples Note",
            type: "reference_list",
            content: "Note on source example references:",
            referenceLinks: [
              {
                id: "ref-m3-d12-note",
                title: "View Example References",
                subtitle: "Where source guide contained specific video format links, clickable buttons are available. Otherwise, links are omitted per source truth guidelines.",
                hasLink: false
              }
            ]
          }
        ],
        practiceTask: {
          title: "Format Selection Exercise",
          description: "Choose 3 video formats from the 10 listed above that best fit your brand.",
          actionSteps: [
            "Select 3 formats.",
            "Draft a 1-sentence content concept for each format."
          ]
        },
        referenceLinks: []
      },
      {
        id: 13,
        dayNumber: 13,
        moduleId: 3,
        moduleTitle: "Content Creation",
        title: "Algorithm Growth & Content Journey Flow",
        summary: "Understand how platform algorithms process content and convert strangers into paying clients.",
        contentSections: [
          {
            id: "m3-d13-s1",
            title: "Algorithm Growth Tips",
            type: "text",
            content: "Algorithms prioritize watch time, completion rate, saves, and shares. Focus on high-retention hooks, concise value, and clear saveable graphics to boost organic distribution."
          },
          {
            id: "m3-d13-s2",
            title: "Content Journey — Audience to Client",
            type: "flow",
            flowSteps: [
              "Stranger (Discovers reel via explore page / algorithm)",
              "↓",
              "Follows for value (Consistent educational content)",
              "↓",
              "Builds trust (Sees client proof & authority reels)",
              "↓",
              "Engages (Comments or DMs for advice)",
              "↓",
              "Becomes a lead (Inquires about services)",
              "↓",
              "Converts to client (Signs contract & pays retainer)"
            ]
          }
        ],
        practiceTask: {
          title: "Funnel Mapping Task",
          description: "Map out your lead magnet or call to action that moves followers from 'Trust' to 'Lead'.",
          actionSteps: [
            "Define your free offer (e.g. Free Audit, PDF checklist).",
            "Write the DM script to send interested leads."
          ]
        },
        referenceLinks: []
      },
      {
        id: 14,
        dayNumber: 14,
        moduleId: 3,
        moduleTitle: "Content Creation",
        title: "Design Basics for Marketers",
        summary: "Master typography rules, color theory, and the 60-30-10 color rule.",
        contentSections: [
          {
            id: "m3-d14-s1",
            title: "Typography Rules & Colour Theory",
            type: "table",
            table: {
              headers: ["Design Element", "Golden Rule", "Best Practice"],
              rows: [
                ["Typography", "Max 2 Font Families", "Use 1 bold font for headlines (e.g. Outfit, Montserrat) and 1 readable sans-serif for body (e.g. Inter, Roboto)"],
                ["Hierarchy", "Size Contrast", "Headlines must be 2x larger than body text. Maintain clear line spacing (1.2 - 1.4)"],
                ["Colour Theory", "60-30-10 Rule", "60% Dominant Background (White/Dark), 30% Secondary Brand Accent, 10% High-Contrast CTA Highlight"]
              ]
            }
          },
          {
            id: "m3-d14-s2",
            title: "Canva Pro Tips",
            type: "checklist",
            checklist: [
              {
                label: "Canva Productivity Hacks",
                items: [
                  "Use Brand Kit to save exact brand HEX colors and font pairs",
                  "Use Magic Resize for multi-platform formats (Story -> Square Post -> Thumbnail)",
                  "Use Background Remover for crisp headshot elements",
                  "Maintain margin safety zones (keep text 10% away from edges for phone screens)"
                ]
              }
            ]
          }
        ],
        practiceTask: {
          title: "Canva Carousel Design",
          description: "Create a 3-slide educational carousel graphic in Canva applying the 60-30-10 rule.",
          actionSteps: [
            "Set slide dimensions (1080x1350).",
            "Apply 2 font families.",
            "Export images and save link in notes."
          ]
        },
        referenceLinks: []
      },
      {
        id: 15,
        dayNumber: 15,
        moduleId: 3,
        moduleTitle: "Content Creation",
        title: "CapCut Editing Workflow & Module 3 Review",
        summary: "Learn the step-by-step CapCut editing workflow for fast, viral short-form video production.",
        contentSections: [
          {
            id: "m3-d15-s1",
            title: "CapCut Short-Form Video Editing Workflow",
            type: "flow",
            flowSteps: [
              "1. Import raw footage and trim silent gaps (jump-cuts for fast pacing)",
              "2. Add Auto-Captions and highlight key keywords in yellow/green",
              "3. Insert subtle sound effects (whoosh, pop, click) at transitions and text pops",
              "4. Add B-roll overlays or stock clips every 3-5 seconds to maintain visual interest",
              "5. Export in 1080p, 60fps with high bitrate"
            ]
          }
        ],
        practiceTask: {
          title: "Flashcards Review M3",
          description: "Review all Module 3 flashcards (Cards 13–18).",
          actionSteps: [
            "Open Flashcards tab.",
            "Filter by Module 3.",
            "Test knowledge on scripts, hooks, and design rules."
          ]
        },
        referenceLinks: []
      }
    ]
  },
  {
    id: 4,
    code: "M4",
    title: "SEO (Search Engine Optimization)",
    subtitle: "Crawling, Indexing, Ranking, E-E-A-T & On-Page Checklist",
    dayRange: "Days 16–19",
    startDay: 16,
    endDay: 19,
    description: "Master search engine optimization from search engine mechanics to advanced keyword research, on-page optimization, backlink building, local SEO, and technical site health.",
    iconName: "Search",
    color: "from-emerald-500 to-teal-600",
    days: [
      {
        id: 16,
        dayNumber: 16,
        moduleId: 4,
        moduleTitle: "SEO",
        title: "How Search Engines Work & E-E-A-T",
        summary: "Understand the Crawling -> Indexing -> Ranking flow and Google's E-E-A-T guidelines.",
        contentSections: [
          {
            id: "m4-d16-s1",
            title: "How Search Engines Work",
            type: "flow",
            flowSteps: [
              "1. Crawling (Discovery): Search bots (Googlebot) scan pages across the web via links",
              "2. Indexing (Storage): Analyzes and stores site content in Google's massive index database",
              "3. Ranking (Serving): Algorithm orders indexed pages based on 200+ ranking signals for user queries"
            ]
          },
          {
            id: "m4-d16-s2",
            title: "E-E-A-T Quality Framework",
            type: "table",
            table: {
              headers: ["Pillar", "Meaning", "How to Demonstrate On-Site"],
              rows: [
                ["Experience", "First-hand personal experience", "Real product photos, original test results, hands-on client stories"],
                ["Expertise", "Technical knowledge and skill", "Author bios, credentials, industry certifications"],
                ["Authoritativeness", "Industry recognition", "Mentions on news sites, external backlinks, guest posts"],
                ["Trustworthiness", "Accuracy and security", "HTTPS SSL encryption, clear privacy policy, contact details, accurate facts"]
              ]
            }
          }
        ],
        practiceTask: {
          title: "E-E-A-T Site Audit",
          description: "Inspect any website homepage and evaluate its E-E-A-T signals.",
          actionSteps: [
            "Check for author bios and credentials.",
            "Verify SSL certificate (HTTPS).",
            "Identify 1 trust element missing."
          ]
        },
        referenceLinks: []
      },
      {
        id: 17,
        dayNumber: 17,
        moduleId: 4,
        moduleTitle: "SEO",
        title: "Keyword Research & 4 Search Intent Types",
        summary: "Identify high-value keywords and match search intent accurately.",
        contentSections: [
          {
            id: "m4-d17-s1",
            title: "Keyword Types",
            type: "checklist",
            checklist: [
              {
                label: "3 Keyword Categories",
                items: [
                  "Short-Tail (Head): High search volume, high competition (e.g., 'Digital Marketing')",
                  "Long-Tail: Specific intent, lower volume, higher conversion (e.g., 'freelance digital marketer for dental clinics in Chennai')",
                  "LSI Keywords (Latent Semantic Indexing): Contextual terms related to your main topic (e.g., 'campaign', 'analytics', 'conversion rate')"
                ]
              }
            ]
          },
          {
            id: "m4-d17-s2",
            title: "4 Types of Search Intent",
            type: "table",
            table: {
              headers: ["Intent Category", "User Goal", "Example Query", "Target Page Type"],
              rows: [
                ["Informational", "Learn or understand something", "'What is SEO marketing?'", "Blog Article / Guide"],
                ["Navigational", "Find a specific website or brand", "'Google Search Console login'", "Homepage / Login Page"],
                ["Commercial", "Research products before buying", "'Ahrefs vs Semrush review'", "Comparison Article / Review"],
                ["Transactional", "Ready to purchase right now", "'Buy domain hosting package'", "Product / Service Landing Page"]
              ]
            }
          }
        ],
        practiceTask: {
          title: "Keyword List Building",
          description: "Use Google Keyword Planner or Ubersuggest to find 5 long-tail keywords for your niche.",
          actionSteps: [
            "Find 5 long-tail keywords.",
            "Classify each keyword by Search Intent.",
            "Record keywords in your notes."
          ]
        },
        referenceLinks: []
      },
      {
        id: 18,
        dayNumber: 18,
        moduleId: 4,
        moduleTitle: "SEO",
        title: "On-Page SEO Checklist & Off-Page Backlinks",
        summary: "Master on-page html elements and link-building strategies.",
        contentSections: [
          {
            id: "m4-d18-s1",
            title: "On-Page SEO Checklist Table",
            type: "table",
            table: {
              headers: ["On-Page Element", "Optimal Spec / Format", "Why It Matters"],
              rows: [
                ["Title Tag", "50-60 characters, includes primary keyword near front", "Primary click signal in Google SERP results"],
                ["Meta Description", "140-160 characters, compelling offer + CTA", "Improves organic Click-Through-Rate (CTR)"],
                ["H1 Heading", "Single H1 per page, contains main target keyword", "Tells search engines the primary page topic"],
                ["Subheadings (H2/H3)", "Logical hierarchy containing secondary/LSI keywords", "Improves readability and featured snippet eligibility"],
                ["URL Structure", "Short, clean, lowercase, hyphen-separated (e.g. /seo-guide)", "User-friendly and keyword-relevant"],
                ["Image Alt Text", "Descriptive text including relevant keyword", "Accessibility and Google Image Search ranking"],
                ["Internal Links", "2-4 contextual links to related internal articles", "Distributes page rank authority across site"]
              ]
            }
          },
          {
            id: "m4-d18-s2",
            title: "Off-Page SEO & Backlinks",
            type: "checklist",
            checklist: [
              {
                label: "Backlink Strategies",
                items: [
                  "Guest Blogging: Writing articles for established industry publications",
                  "HARO / Help a Reporter Out: Providing expert quotes for news articles",
                  "Broken Link Building: Finding broken links on competitor sites and offering your resource",
                  "Directory Submissions: Submitting local business details to trustworthy directories"
                ]
              }
            ]
          }
        ],
        practiceTask: {
          title: "On-Page Metadata Writing",
          description: "Write an optimized Title Tag, Meta Description, and H1 heading for a blog post titled '10 SEO Tips for Beginners'.",
          actionSteps: [
            "Write Title Tag (< 60 chars).",
            "Write Meta Description (< 160 chars).",
            "Write H1 Tag."
          ]
        },
        referenceLinks: []
      },
      {
        id: 19,
        dayNumber: 19,
        moduleId: 4,
        moduleTitle: "SEO",
        title: "Local SEO, Technical SEO & Module 4 Review",
        summary: "Set up Google Business Profile and master Technical SEO basics.",
        contentSections: [
          {
            id: "m4-d19-s1",
            title: "Technical SEO Elements",
            type: "checklist",
            checklist: [
              {
                label: "Technical Essentials",
                items: [
                  "Schema Markup: Structured data (JSON-LD) helping Google understand entity details",
                  "XML Sitemap: Comprehensive map submitted to Google Search Console for efficient crawling",
                  "Robots.txt: Directs search bot permissions and blocks sensitive site directories",
                  "Google Search Console (GSC): Tracks indexing issues, impressions, CTR, and search queries",
                  "Google Analytics 4 (GA4): Tracks user sessions, conversions, bounce rates, and traffic sources"
                ]
              }
            ]
          }
        ],
        practiceTask: {
          title: "Flashcards Review M4",
          description: "Review all Module 4 flashcards (Cards 19–24).",
          actionSteps: [
            "Open Flashcards tab.",
            "Filter by Module 4.",
            "Master SEO terms."
          ]
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
        title: "Why Paid Ads? Platforms & Campaign Architecture",
        summary: "Understand the paid advertising landscape and Meta Ads Manager 3-level structure.",
        contentSections: [
          {
            id: "m5-d20-s1",
            title: "Key Ad Platforms",
            type: "table",
            table: {
              headers: ["Platform", "Best For", "Primary Ad Formats"],
              rows: [
                ["Meta Ads (FB/IG)", "E-commerce, B2C, Local Businesses, Lead Gen", "Reels Video Ads, Carousel, Single Image, Lead Form Ads"],
                ["Google Ads", "High-intent search, e-com product sales", "Search Text Ads, Shopping Ads, YouTube Video Ads, Performance Max"],
                ["LinkedIn Ads", "High-ticket B2B, corporate SaaS, high-value consulting", "Sponsored Content, Message Ads, Dynamic Jobs Ads"],
                ["TikTok Ads", "Gen-Z demographic, impulse e-commerce buys", "In-Feed Video Ads, Spark Ads"]
              ]
            }
          },
          {
            id: "m5-d20-s2",
            title: "Meta Ads Manager 3-Level Campaign Structure",
            type: "flow",
            flowSteps: [
              "1. Campaign Level (Choose Objective: Sales, Leads, Traffic, Awareness, Engagement)",
              "↓",
              "2. Ad Set Level (Choose Budget, Schedule, Audience Targeting, Placements, Optimization)",
              "↓",
              "3. Ad Level (Choose Ad Format, Visual Creative, Headlines, Primary Copy, CTA Link)"
            ]
          }
        ],
        practiceTask: {
          title: "Campaign Structure Mapping",
          description: "Map out a Meta Ad campaign for an e-commerce brand launching a new sneaker line.",
          actionSteps: [
            "Select Campaign Objective.",
            "Define Ad Set targeting.",
            "Describe 2 Ad creatives."
          ]
        },
        referenceLinks: []
      },
      {
        id: 21,
        dayNumber: 21,
        moduleId: 5,
        moduleTitle: "Paid Advertising",
        title: "Audience Targeting & Meta Pixel",
        summary: "Master Saved, Custom, and Lookalike audiences plus Pixel tracking setup.",
        contentSections: [
          {
            id: "m5-d21-s1",
            title: "3 Meta Audience Types",
            type: "table",
            table: {
              headers: ["Audience Type", "Definition", "Data Source"],
              rows: [
                ["Saved Audience", "Cold targeting based on demographics, interests, and behaviors", "Meta interest categories (e.g. 'Interested in Digital Marketing')"],
                ["Custom Audience", "Warm targeting of people who already interacted with your brand", "Website visitors (via Pixel), Instagram engaged users, customer email list"],
                ["Lookalike Audience (LAL)", "Cold audience resembling your best existing customers", "Algorithmic mirror of a source Custom Audience (e.g. Top 1% purchasers)"]
              ]
            }
          },
          {
            id: "m5-d21-s2",
            title: "Meta Pixel Essentials",
            type: "calloutText",
            calloutText: "Meta Pixel is a snippet of tracking code placed on a website. It tracks visitor actions (PageView, ViewContent, AddToCart, Purchase) to measure ad ROI and build powerful Custom Retargeting Audiences."
          }
        ],
        practiceTask: {
          title: "Audience Selection Task",
          description: "Write down the targeting parameters for a cold campaign selling an online marketing course.",
          actionSteps: [
            "List 3 interest keywords for Saved Audience.",
            "Describe how to create a 1% Lookalike audience."
          ]
        },
        referenceLinks: []
      },
      {
        id: 22,
        dayNumber: 22,
        moduleId: 5,
        moduleTitle: "Paid Advertising",
        title: "Ad Copywriting Formulas (AIDA & PAS)",
        summary: "Write compelling ad copy using proven psychological frameworks.",
        contentSections: [
          {
            id: "m5-d22-s1",
            title: "AIDA vs PAS Formulas",
            type: "table",
            table: {
              headers: ["Framework", "Steps", "Example Application"],
              rows: [
                ["AIDA", "Attention → Interest → Desire → Action", "Attention: 'Struggling to get clients?' Interest: 'Most freelancers fail because of weak positioning.' Desire: 'Our 30-day framework guarantees client inquiries.' Action: 'Click link to enroll today!'"],
                ["PAS", "Problem → Agitate → Solution", "Problem: 'Wasting money on Meta ads with zero sales?' Agitate: 'Ad costs are rising and pixel data is incomplete.' Solution: 'Our proven full-funnel strategy lowers CPA by 40%.'"]
              ]
            }
          }
        ],
        practiceTask: {
          title: "Ad Copywriting Challenge",
          description: "Write 1 Meta Ad text using AIDA formula and 1 Meta Ad text using PAS formula.",
          actionSteps: [
            "Draft AIDA ad copy.",
            "Draft PAS ad copy.",
            "Include strong headline and CTA."
          ]
        },
        referenceLinks: []
      },
      {
        id: 23,
        dayNumber: 23,
        moduleId: 5,
        moduleTitle: "Paid Advertising",
        title: "Key Ad Metrics & Full-Funnel Strategy",
        summary: "Calculate CTR, CPA, ROAS, CPM and implement TOF/MOF/BOF funnels.",
        contentSections: [
          {
            id: "m5-d23-s1",
            title: "Key Ad Performance Metrics",
            type: "table",
            table: {
              headers: ["Metric", "Full Name", "Formula / Benchmark", "Significance"],
              rows: [
                ["CTR", "Click-Through Rate", "(Clicks / Impressions) × 100 (Target > 1.5%)", "Measures ad creative hook and copy engagement"],
                ["CPA / CPL", "Cost Per Acquisition / Lead", "Total Ad Spend / Total Conversions", "Measures cost efficiency of generating a lead/sale"],
                ["ROAS", "Return On Ad Spend", "Total Revenue Generated / Total Ad Spend (Target > 3x)", "Measures campaign profitability"],
                ["CPM", "Cost Per Mille (1,000 Impressions)", "(Total Spend / Total Impressions) × 1,000", "Measures cost of reaching audience"]
              ]
            }
          },
          {
            id: "m5-d23-s2",
            title: "Full-Funnel Advertising Strategy",
            type: "flow",
            flowSteps: [
              "1. TOF (Top of Funnel - Cold): Educational video reels targeting Saved & Lookalike Audiences",
              "↓",
              "2. MOF (Middle of Funnel - Warm): Retargeting video viewers & IG engagers with case studies & lead magnets",
              "↓",
              "3. BOF (Bottom of Funnel - Hot): Retargeting website add-to-carts / lead form abandoners with discount offers & testimonials"
            ]
          }
        ],
        practiceTask: {
          title: "ROAS Calculation Exercise",
          description: "If an ad campaign spend is $500 and generates $2,000 in revenue with 25 purchases:",
          actionSteps: [
            "Calculate ROAS ($2,000 / $500 = 4.0x).",
            "Calculate Cost Per Acquisition ($500 / 25 = $20 CPA).",
            "Write answers in notes."
          ]
        },
        referenceLinks: []
      },
      {
        id: 24,
        dayNumber: 24,
        moduleId: 5,
        moduleTitle: "Paid Advertising",
        title: "Scaling Rules & Module 5 Review",
        summary: "Learn vertical and horizontal budget scaling rules.",
        contentSections: [
          {
            id: "m5-d24-s1",
            title: "Ad Campaign Scaling Rules",
            type: "checklist",
            checklist: [
              {
                label: "Vertical vs Horizontal Scaling",
                items: [
                  "Vertical Scaling: Increase budget on winning ad sets by 15-20% every 48 hours (prevents resetting learning phase)",
                  "Horizontal Scaling: Duplicate winning ad creatives into new lookalike or broader interest ad sets",
                  "Creative Fatigue Rule: Refresh ad visual/headline when CTR drops below 1% or frequency exceeds 3.5"
                ]
              }
            ]
          }
        ],
        practiceTask: {
          title: "Flashcards Review M5",
          description: "Review all Module 5 flashcards (Cards 25–30).",
          actionSteps: [
            "Open Flashcards tab.",
            "Filter by Module 5.",
            "Check metrics formulas."
          ]
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
        title: "Domain & Hosting Setup",
        summary: "Step-by-step domain purchase, hosting connection, and WordPress installation.",
        contentSections: [
          {
            id: "m6-d25-s1",
            title: "Domain & Hosting Connection Steps",
            type: "flow",
            flowSteps: [
              "1. Buy a Domain (GoDaddy, Namecheap, Google Domains)",
              "2. Buy Hosting (Hostinger, SiteGround, Bluehost)",
              "3. Connect Domain to Hosting via Nameservers (NS1/NS2 update in registrar DNS)",
              "4. Install WordPress via 1-Click Installer in Hosting Control Panel (cPanel / hPanel)"
            ]
          }
        ],
        practiceTask: {
          title: "DNS & Nameserver Audit",
          description: "Inspect how DNS nameservers point a domain to a hosting server.",
          actionSteps: [
            "Search for domain availability on Namecheap/Hostinger.",
            "Write down the step to update NS records."
          ]
        },
        referenceLinks: []
      },
      {
        id: 26,
        dayNumber: 26,
        moduleId: 6,
        moduleTitle: "WordPress",
        title: "Essential Plugins & 5 Essential Pages",
        summary: "Must-have WordPress plugin table and key page architecture.",
        contentSections: [
          {
            id: "m6-d26-s1",
            title: "Essential Plugins Table",
            type: "table",
            table: {
              headers: ["Plugin Category", "Recommended Plugins", "Function"],
              rows: [
                ["SEO", "Rank Math SEO, Yoast SEO", "Sitemap generation, meta title/description editor, schema builder"],
                ["Page Builder", "Elementor, Spectra, Gutenberg", "Drag-and-drop page layout design"],
                ["Security", "Wordfence Security, Solid Security", "Firewall protection, malware scanner, brute force protection"],
                ["Performance / Cache", "WP Rocket, LiteSpeed Cache, WP Optimize", "Caching, CSS/JS minification, database cleanup"],
                ["Forms", "WPForms, Contact Form 7", "Lead capture forms, contact submission emails"],
                ["Image Compression", "Smush, ShortPixel", "WebP image conversion and lossy image compression"]
              ]
            }
          },
          {
            id: "m6-d26-s2",
            title: "5 Essential Website Pages",
            type: "checklist",
            checklist: [
              {
                label: "Core Website Architecture",
                items: [
                  "1. Homepage: High-converting hero banner, value proposition, services, social proof",
                  "2. About Page: Founder story, team credentials, mission statement",
                  "3. Services / Products Page: Detailed service packages, pricing tables, clear CTA",
                  "4. Contact Page: Embedded form, phone number, address, Google Map widget",
                  "5. Blog: Informational SEO content Hub for organic keyword traffic"
                ]
              }
            ]
          }
        ],
        practiceTask: {
          title: "Homepage Sitemap Wireframe",
          description: "Sketch or list out the 5 sections of a high-converting Homepage for your agency.",
          actionSteps: [
            "Hero Section (H1 + CTA button).",
            "Services Grid.",
            "Testimonial Slider.",
            "About snippet.",
            "Footer."
          ]
        },
        referenceLinks: []
      },
      {
        id: 27,
        dayNumber: 27,
        moduleId: 6,
        moduleTitle: "WordPress",
        title: "Core Web Vitals & Speed Optimisation Checklist",
        summary: "Optimize site performance for LCP, INP, CLS, and page speed.",
        contentSections: [
          {
            id: "m6-d27-s1",
            title: "Core Web Vitals Breakdown",
            type: "table",
            table: {
              headers: ["Metric", "Full Name", "Good Benchmark", "What It Measures"],
              rows: [
                ["LCP", "Largest Contentful Paint", "< 2.5 seconds", "Perceived loading speed of main visual banner/element"],
                ["INP", "Interaction to Next Paint", "< 200 milliseconds", "Visual responsiveness when a user clicks/taps an element"],
                ["CLS", "Cumulative Layout Shift", "< 0.1 score", "Visual stability (elements jumping around while loading)"]
              ]
            }
          },
          {
            id: "m6-d27-s2",
            title: "Speed Optimisation Checklist",
            type: "checklist",
            checklist: [
              {
                label: "Site Speed Master List",
                items: [
                  "Convert all uploaded images to next-gen WebP format",
                  "Enable Gzip / Brotli server compression",
                  "Minify HTML, CSS, and JavaScript files",
                  "Implement Lazy Loading on below-the-fold images and videos",
                  "Use Cloudflare Free CDN for global caching and DNS protection"
                ]
              }
            ]
          }
        ],
        practiceTask: {
          title: "PageSpeed Insights Test",
          description: "Run any website URL through Google PageSpeed Insights (pagespeed.web.dev).",
          actionSteps: [
            "Note Mobile Performance score.",
            "Check LCP, INP, and CLS scores.",
            "Identify top 2 speed recommendations."
          ]
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
        title: "Contracts, Invoicing & Scope of Work",
        summary: "Protect your freelance business with solid contracts and clear scope boundaries.",
        contentSections: [
          {
            id: "m7-d28-s1",
            title: "Scope of Work (SOW) Essentials",
            type: "checklist",
            checklist: [
              {
                label: "6 Must-Have Contract Clauses",
                items: [
                  "1. Deliverables: Exact list of work (e.g., 12 Reels, 4 Blog Posts, Meta Ad management)",
                  "2. Timeline: Project start date, submission deadlines, client approval windows",
                  "3. Milestones: Phased payment schedules (e.g. 50% upfront deposit, 50% upon completion)",
                  "4. Revision Rounds: Limit free edits (e.g. Maximum 2 rounds of minor revisions per asset)",
                  "5. Payment Terms: Invoice payment window (Net 7 / Net 15 days, late fee policy)",
                  "6. Out-of-Scope Clause: Explicit fee for additional requests ($50/hr for extra work)"
                ]
              }
            ]
          }
        ],
        practiceTask: {
          title: "Contract Template Drafting",
          description: "Draft an Out-of-Scope clause and Revision clause for a $500/month social media management client.",
          actionSteps: [
            "Write the revision policy.",
            "Write the late payment terms.",
            "Store in notes."
          ]
        },
        referenceLinks: []
      },
      {
        id: 29,
        dayNumber: 29,
        moduleId: 7,
        moduleTitle: "Freelancing",
        title: "Client Reports (Meta Ads & SEO Templates)",
        summary: "Render clean client performance reports that justify retainer renewals.",
        contentSections: [
          {
            id: "m7-d29-s1",
            title: "Meta Ads Monthly Client Report Template",
            type: "table",
            table: {
              headers: ["Metric", "Previous Month", "Current Month", "Change / Growth", "Client Impact"],
              rows: [
                ["Total Spend", "$1,000", "$1,200", "+20%", "Scaled budget on top winning ad sets"],
                ["Total Impressions", "120,000", "165,000", "+37.5%", "Expanded brand awareness"],
                ["Link Clicks", "2,400", "3,800", "+58.3%", "Improved ad hook & creative CTR"],
                ["Conversions (Leads)", "80", "140", "+75.0%", "Generated 60 additional qualified leads"],
                ["Cost Per Lead (CPL)", "$12.50", "$8.57", "-31.4% Improvement", "Lowered cost per lead by optimizing pixel audiences"]
              ]
            }
          },
          {
            id: "m7-d29-s2",
            title: "SEO Monthly Client Report Template",
            type: "table",
            table: {
              headers: ["SEO Metric", "Baseline", "Current Month", "Key Drivers"],
              rows: [
                ["Organic Sessions", "3,200", "5,800", "+81% increase driven by new blog posts"],
                ["Indexed Keywords (Top 10)", "12 keywords", "28 keywords", "Published 4 targeted long-tail articles"],
                ["Domain Authority (DA)", "18", "22", "Acquired 5 high-quality backlinks via HARO"],
                ["Organic Lead Inquiries", "14", "31", "Added clear CTA banners to top 3 articles"]
              ]
            }
          }
        ],
        practiceTask: {
          title: "Report Summary Writing",
          description: "Write a 3-sentence executive summary email explaining the Meta Ads report above to a non-technical client.",
          actionSteps: [
            "Highlight the 75% increase in leads.",
            "Highlight the 31% reduction in Cost Per Lead.",
            "Propose budget for next month."
          ]
        },
        referenceLinks: []
      },
      {
        id: 30,
        dayNumber: 30,
        moduleId: 7,
        moduleTitle: "Freelancing",
        title: "Content Calendar & 30-Day Completion",
        summary: "Master content calendar management and complete your 30-day guide certification!",
        contentSections: [
          {
            id: "m7-d30-s1",
            title: "Master Content Calendar Template",
            type: "table",
            table: {
              headers: ["Date", "Platform", "Format", "Topic / Hook", "Goal"],
              rows: [
                ["Oct 01", "Instagram", "Reel (15s)", "'Stop making this SEO mistake in 2026'", "Lead Generation"],
                ["Oct 03", "LinkedIn", "Text + Carousel", "How I lowered CPL by 31% (Case Study)", "Authority / Proof"],
                ["Oct 05", "YouTube Short", "Screen Recording", "5 Free Canva tricks every marketer needs", "Follower Growth"],
                ["Oct 07", "Instagram", "Single Image Post", "'Client testimonial screenshot + story'", "Trust & Conversions"]
              ]
            }
          },
          {
            id: "m7-d30-s2",
            title: "Course Completion Certificate",
            type: "calloutText",
            calloutText: "🎉 Congratulations! You have completed all 30 days of the Digital Marketing Complete Study Guide! You possess practical knowledge across SEO, Personal Branding, Content Creation, Paid Ads, WordPress, and Freelancing."
          }
        ],
        practiceTask: {
          title: "Final Graduation Portfolio Task",
          description: "Compile your UVP, personal profile links, sample script, ad copy, and client report into your master portfolio.",
          actionSteps: [
            "Complete all remaining flashcards (Cards 31–42).",
            "Mark Day 30 as Complete.",
            "Share your achievement with Digital Teenz Academy!"
          ]
        },
        referenceLinks: []
      }
    ]
  }
];

export const FLASHCARDS_DATA: Flashcard[] = [
  // Module 1 (1-6)
  { id: 1, moduleId: 1, moduleCode: "M1", moduleTitle: "Intro to Digital Marketing", question: "What are the 6 core channels of digital marketing?", answer: "1. SEO\n2. Content Marketing\n3. Social Media Marketing\n4. Email Marketing\n5. Paid Advertising\n6. Affiliate & Influencer Marketing" },
  { id: 2, moduleId: 1, moduleCode: "M1", moduleTitle: "Intro to Digital Marketing", question: "What is the key difference between Intent-Based and Interest-Based advertising?", answer: "Intent-Based (Google Search Ads) targets users actively seeking a solution. Interest-Based (Meta Ads) interrupts users scrolling on social media based on demographic/interest profiles." },
  { id: 3, moduleId: 1, moduleCode: "M1", moduleTitle: "Intro to Digital Marketing", question: "Which primary tools are used for Web Analytics?", answer: "Google Analytics 4 (GA4) for user sessions/conversions and Google Search Console for search index performance and organic impressions." },
  { id: 4, moduleId: 1, moduleCode: "M1", moduleTitle: "Intro to Digital Marketing", question: "Name 3 popular social media content scheduling tools.", answer: "Buffer, Later, Hootsuite, and Meta Business Suite." },
  { id: 5, moduleId: 1, moduleCode: "M1", moduleTitle: "Intro to Digital Marketing", question: "Why is Digital Marketing more measurable than Traditional Marketing?", answer: "Digital marketing provides real-time tracking metrics (CTR, CPA, Conversion Rate, ROAS) allowing exact ROI calculation, unlike broad TV/billboard broadcasts." },
  { id: 6, moduleId: 1, moduleCode: "M1", moduleTitle: "Intro to Digital Marketing", question: "What tools should a freelance marketer use for SEO keyword research?", answer: "Ahrefs (Free tier), Ubersuggest, and Google Keyword Planner." },

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
    if (dayNum === 1) { title = "What is Digital Marketing?"; study = "Study 6 core channels & traditional vs digital matrix"; practice = "Perform digital audit on 1 business"; }
    else if (dayNum === 2) { title = "Key Marketing Tools"; study = "Study marketing tools table across Analytics, Design, SEO, Social, and Ads"; practice = "Setup free accounts on Canva and Meta Business Suite"; }
    else if (dayNum === 3) { title = "Ad Platforms Overview"; study = "Study Search Intent vs Social Interest advertising"; practice = "Analyze 2 Google Ads and 2 IG Ads"; }
    else { title = "Module 1 Review"; study = "Review Module 1 core principles"; practice = "Complete Flashcards 1–6 with 100% mastery"; }
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
