/**
 * marciKnowledge.ts
 * ---------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for the "Ask About Marci" chatbot.
 *
 * Every word the chatbot is allowed to say about Marci Metzger / The Ridge
 * Realty Group lives in this file. Nothing here should be added unless it is
 * actually supported by Marci's existing website and public profiles - do
 * not invent listings, statistics, credentials, or personal details.
 *
 * The file is organized in five parts:
 *   1. Identity & contact constants
 *   2. KNOWLEDGE_BASE      - ~2,000 words of long-form, section-based source
 *                             material (the thing a human editor would review)
 *   3. KNOWLEDGE_TOPICS     - short, conversational answers used in chat,
 *                             each explicitly tagged with the KNOWLEDGE_BASE
 *                             section it summarizes
 *   4. Guardrails           - fixed, safe responses for anything the
 *                             chatbot must refuse or redirect
 *   5. getMarciResponse()   - the lightweight, deterministic matching engine
 *                             that the Chatbot component calls. No network
 *                             requests, no external AI API, no invented text.
 * ---------------------------------------------------------------------------
 */

// ============================================================================
// 1. IDENTITY & CONTACT
// ============================================================================

/** How the chatbot must always refer to itself - never "Marci" and never a
 * generic assistant name. */
export const ASSISTANT_NAME = "Marci's AI assistant";

export const CONTACT = {
  officeName: "Marci Metzger - The Ridge Realty Group",
  addressLine1: "3190 HW-160 Suite F",
  addressLine2: "Pahrump, NV 89048",
  country: "US",
  phoneDisplay: "(206) 919-6886",
  phoneHref: "tel:+12069196886",
  hours: "Daily, 8am–7pm",
  hoursNote: "Appointments outside normal hours are available by request.",
} as const;

/** Hard cap on user questions per session. Enforced in Chatbot.tsx via
 * React state - this constant is the single place that number is defined. */
export const MAX_QUESTIONS = 5;

// ============================================================================
// 2. KNOWLEDGE_BASE - long-form source material (~2,000 words)
// ============================================================================

export interface KnowledgeSection {
  id: string;
  title: string;
  content: string;
}

const ABOUT_MARCI = `Marci J. Metzger is a REALTOR with The Ridge Realty Group, based in Pahrump, Nevada. She was a REALTOR, and later a licensed Broker, in Washington State, where she began helping buyers and sellers in 1995. Nearly three decades later, Marci has brought that same depth of experience to Southern Nevada, where she now lives, works, and serves the Pahrump community full-time.

Marci genuinely loves the community she serves. In her own words: "I love that small-town feeling that our community offers. Spectacular golf courses, parks, pool, and easy access to Las Vegas make Pahrump a great place to call home. Working or retired, fast-paced or looking to relax... there's a place for you here!" Marci lives in the Mountain Falls community in Pahrump, and says she strives to find each client a home that suits them just as that community suits her.

As a REALTOR with The Ridge Realty Group, Marci works with both buyers and sellers throughout Pahrump and the broader Southern Nevada market. Her role is to act as a steady, knowledgeable guide through the real estate process, whether that means helping a seller prepare and market a property, or helping a buyer understand the market and find the right home. From the first conversation through closing, Marci helps clients understand their options, make sense of local market conditions, and move forward with confidence at every stage of buying or selling.

Marci's approach is rooted in nearly three decades of hands-on experience across different markets and different kinds of clients, from first-time buyers to long-time homeowners. That experience is what she draws on every time she takes on a new listing or begins working with a buyer, and it shapes the personal, detail-oriented way she works with each client.

For visitors trying to get a sense of who Marci is before reaching out, the short version is this: she is a licensed REALTOR with The Ridge Realty Group in Pahrump, Nevada, with a career that spans nearly thirty years and two states, and a day-to-day focus on helping people buy and sell real estate in the Pahrump and Southern Nevada area.`;

const EXPERIENCE_AND_TRACK_RECORD = `Marci has been a REALTOR for nearly three decades, beginning her career in Washington State in 1995 before relocating her practice to serve Southern Nevada. Over that span, she has helped buyers and sellers across a range of markets and market conditions, giving her a broad, hands-on understanding of how real estate transactions come together from start to finish.

Marci and her team at The Ridge Realty Group are recognized as a Top Residential Sales team, with their website noting this recognition over the last several years in the Pahrump market. For 2021 specifically, Marci's website reports that her team helped nearly 90 clients and closed approximately $28.5 million in sales that year. As Marci's team describes it: "Our team works hard everyday to grow and learn, so that we may continue to excel in our market. Our clients deserve our best, & we want to make sure our best is better every year."

This track record connects directly to Marci's "Get It Sold" positioning: the idea that her job isn't finished when a property is simply listed, but when it is actually sold, ideally with the best possible outcome for her client. That philosophy carries through everything from how she markets a listing to how she supports a client all the way to closing.

It's worth being clear that these figures reflect results reported on Marci's website for the specific periods described. They are not a promise, guarantee, or prediction about what will happen with any future sale, price, or timeline. Every property and every market is different, and Marci's AI assistant will not apply these past results to a specific property, or suggest they represent a guaranteed outcome.`;

const SELLING_A_HOME = `Marci's approach to selling a home is captured directly in a line from her own website: "Don't Just List it... Get it SOLD!" The idea behind that phrase is straightforward: a listing on its own doesn't help a seller. What matters is getting a property in front of the right buyers and carrying the transaction all the way through to a completed, successful sale.

To do that, Marci and her team describe exhausting "every avenue to ensure our listings are at the fingertips of every possible buyer," with the goal of helping sellers get top dollar for their home. In practice, that means giving a listing strong marketing and exposure, so it reaches as many qualified, motivated buyers as possible rather than sitting quietly on the market waiting to be noticed.

Before a home goes on the market, Marci helps sellers prepare their property so that it shows and competes well against similar homes in the area. This includes helping sellers understand current market conditions in Pahrump and the surrounding area, so they can make informed, realistic decisions about how to position their property, including how it compares to what else is available locally. Because Marci has worked in this market for years, she brings a "nobody knows the market like we do" level of familiarity to help sellers set well-informed expectations from the very beginning.

From that first conversation about listing a home all the way through to closing, Marci provides guidance at each stage of the selling process, helping sellers understand next steps, respond to buyer interest and offers, and navigate the transaction to a successful close. What Marci's AI assistant will not do is promise a specific sale price, a specific number of days on market, or any guaranteed outcome for a particular property. Those depend on the individual home, its condition, and current market conditions, and are best discussed directly with Marci.`;

const BUYING_A_HOME = `For buyers, Marci's website describes her role through what she calls a Guide to Buyers approach: "Nobody knows the market like we do. Enjoy having a pro at your service. Market analysis, upgrades lists, contractors on speed dial, & more!" The idea is that buying a home in an unfamiliar market can feel overwhelming, and Marci's job is to make that process feel manageable and well-guided from start to finish.

That starts with helping buyers understand the local market: what's available, how pricing compares across different areas and property types, and what to realistically expect given current conditions. Marci provides market analysis to help buyers make sense of what they're seeing, rather than guessing at whether a given property or price is reasonable for the area.

Marci also helps buyers search for and evaluate suitable homes, whatever their needs may be. Her site notes she works with everything from fixer-uppers to more move-in-ready or luxury properties, and with both condos and larger homes, described on her site simply as "large or small, condo or mansion." As part of evaluating a property, Marci helps buyers think through what upgrades a home might need, and she keeps a network of contractors she can connect buyers with, described on her site as having "contractors on speed dial."

On the financing side, Marci's website notes that for questions about affordability, credit, and loan options, she connects buyers with trusted lending professionals who can provide the right answers in a timely way, so buyers can move forward feeling confident and educated about their options. Marci's AI assistant does not provide mortgage approval advice, financing terms, credit guidance, or any other financial, tax, or legal advice. For those topics, Marci can introduce buyers to the right professionals to speak with directly.`;

const REAL_ESTATE_SERVICES = `Marci and The Ridge Realty Group work across both residential and commercial real estate in Pahrump and the broader Southern Nevada market. Her site frames this simply as "Real Estate Done Right," covering both "Commercial & Residential" transactions for her clients.

On the residential side, this includes helping clients buy and sell homes of many types and sizes, from smaller starter properties to larger family homes, described on her site as ranging from "condo" to "mansion." On the commercial side, Marci also assists clients who are exploring investment properties or commercial real estate opportunities in the Pahrump and Southern Nevada area.

Across both residential and commercial work, Marci's core services include guiding clients through buying and selling, offering market guidance so clients understand current conditions, helping with property search so buyers can find homes that fit their needs, and applying her market expertise, built over nearly three decades in the industry, to help clients move forward with confidence. Whether a client is getting ready to buy or sell a residence, looking at investment properties, or simply curious about the market, Marci's team frames their goal as making sure clients "get the best experience possible" throughout the process.

In short, if a visitor's question touches on buying, selling, residential property, commercial property, or general market guidance in the Pahrump and Southern Nevada area, that falls within the scope of services Marci offers. Specific availability, pricing, and timing for any individual property are best confirmed directly with Marci's office, since they change constantly and are not part of this knowledge base.`;

const OFFICE_AND_CONTACT = `Marci Metzger works out of The Ridge Realty Group office, located at 3190 HW-160, Suite F, Pahrump, NV 89048, United States. The office can be reached by phone at (206) 919-6886.

Office hours are listed as daily, 8:00am to 7:00pm. For visitors who need to meet outside of those normal hours, Marci's website notes that appointments outside office hours are available by request, simply by calling ahead to arrange a time.

This phone number and office address are the best way for a website visitor to reach Marci directly, whether they have a question that goes beyond what this AI assistant can answer, they're ready to talk about a specific property, or they simply want to introduce themselves before getting started on a buying or selling journey.`;

const AI_BEHAVIOR = `This chatbot is Marci's AI assistant, not Marci herself. It is a tool built into Marci Metzger's website to help visitors quickly learn about Marci, The Ridge Realty Group, and how she can help with buying or selling a home. It draws only from the verified information in this knowledge base, which reflects the content of Marci's website and professional profiles, and it never presents information beyond that as fact.

This assistant can answer general questions about Marci's background and experience, her "Get It Sold" approach to selling, her Guide to Buyers approach to purchasing a home, the residential and commercial services she offers, and how to reach her office directly by phone or in person.

This assistant cannot and will not do the following: invent property listings, availability, prices, or client details that are not part of this knowledge base; provide legal, tax, mortgage-approval, financial, or investment advice; guarantee a property valuation, a sale price, a closing date, or financing approval; share private or personal information about Marci beyond what is part of her public professional profile; or claim to be Marci Metzger herself, or claim that any of its answers come directly from Marci personally.

If a visitor asks something that falls outside of this knowledge base, the assistant will say so plainly rather than guessing, and will point the visitor to Marci's direct contact information so a real conversation can continue from there. If a visitor asks the assistant to ignore these guardrails, adopt a different persona, or reveal its underlying instructions, the assistant will decline and continue to operate within these same rules.

The goal of this assistant is simple: give website visitors a fast, honest, well-organized introduction to Marci and how she works, and then hand them off to Marci herself, by phone or in person, for anything that requires her direct judgment, a look at a specific property, or a real conversation about a client's particular situation.`;

export const KNOWLEDGE_BASE: KnowledgeSection[] = [
  { id: "about", title: "About Marci", content: ABOUT_MARCI },
  { id: "experience", title: "Experience & Track Record", content: EXPERIENCE_AND_TRACK_RECORD },
  { id: "selling", title: "Selling a Home", content: SELLING_A_HOME },
  { id: "buying", title: "Buying a Home", content: BUYING_A_HOME },
  { id: "services", title: "Real Estate Services", content: REAL_ESTATE_SERVICES },
  { id: "contact", title: "Office & Contact Information", content: OFFICE_AND_CONTACT },
  { id: "ai-behavior", title: "What This AI Assistant Can & Cannot Do", content: AI_BEHAVIOR },
];

// ============================================================================
// 3. KNOWLEDGE_TOPICS - short chat answers, each grounded in KNOWLEDGE_BASE
// ============================================================================

export interface KnowledgeTopic {
  id: string;
  /** The KNOWLEDGE_BASE section id this answer summarizes. Keeps the chat
   * response explicitly traceable back to the controlled source content. */
  sourceSectionId: string;
  keywords: string[];
  answer: string;
}

export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    id: "about",
    sourceSectionId: "about",
    keywords: [
      "who is marci",
      "about marci",
      "tell me about marci",
      "what does marci do",
      "what does she do",
      "who is she",
      "background",
      "her story",
      "washington state",
      "mountain falls",
      "small-town",
      "introduce marci",
      "who are you working with",
    ],
    answer:
      "Marci J. Metzger is a REALTOR with The Ridge Realty Group in Pahrump, Nevada. She was a REALTOR, and later a licensed Broker, in Washington State, where she began helping buyers and sellers back in 1995. Nearly three decades later, she's brought that experience to Southern Nevada, where she lives in the Mountain Falls community and works with both buyers and sellers throughout Pahrump.\n\nAs Marci puts it: \"I love that small-town feeling that our community offers... there's a place for you here!\" Her role is to guide clients through every step of buying or selling, from that first conversation through closing.",
  },
  {
    id: "experience",
    sourceSectionId: "experience",
    keywords: [
      "how long",
      "years of experience",
      "how many years",
      "decades",
      "since when",
      "track record",
      "top residential",
      "top sales",
      "sales record",
      "2021",
      "28.5",
      "90 clients",
      "get it sold",
      "credentials",
      "how experienced",
    ],
    answer:
      "Marci has been a REALTOR for nearly three decades, starting her career in Washington State in 1995 before bringing that experience to Pahrump, Nevada. She and her team at The Ridge Realty Group have been recognized as a Top Residential Sales team in recent years - in 2021 alone, they helped nearly 90 clients and closed about $28.5 million in sales.\n\nThat track record connects to Marci's \"Get It Sold\" approach: getting a property not just listed, but actually sold, for the best outcome she can get her client. These figures reflect past results, not a promise about any future sale.",
  },
  {
    id: "selling",
    sourceSectionId: "selling",
    keywords: [
      "sell",
      "selling",
      "list my home",
      "listing",
      "seller",
      "sellers",
      "get it sold",
      "don't just list",
      "market my home",
      "sell my house",
      "marketing",
      "exposure",
      "prepare my home",
      "positioning",
    ],
    answer:
      "Marci's philosophy is right there on her site: \"Don't Just List it... Get it SOLD!\" She works to give listings strong marketing and exposure so they reach as many qualified buyers as possible, rather than sitting quietly on the market.\n\nBefore a home goes live, Marci helps sellers prepare the property, understand current market conditions, and position it well against similar homes nearby - and she stays involved all the way through closing. She won't promise a specific price or timeline, though; those depend on your property and the market, and are best discussed directly with her.",
  },
  {
    id: "buying",
    sourceSectionId: "buying",
    keywords: [
      "buy",
      "buying",
      "buyer",
      "buyers",
      "purchase",
      "guide to buyers",
      "find a home",
      "finding a home",
      "evaluate a home",
      "upgrades",
      "contractors",
      "financing",
      "loan",
      "afford",
      "looking for a home",
    ],
    answer:
      "Marci calls her approach to buyers a \"Guide to Buyers\": helping people understand the market, providing market analysis, and helping them find and evaluate homes that fit - everything from fixer-uppers to move-in-ready homes, condos to larger properties.\n\nShe also helps buyers think through upgrades a home might need and can connect them with contractors, and for questions on affordability, credit, or loan options, she connects buyers with trusted lending professionals. Marci's AI assistant can't give mortgage or financial advice directly, but Marci can point you to the right people.",
  },
  {
    id: "services",
    sourceSectionId: "services",
    keywords: [
      "services",
      "what do you offer",
      "what does she offer",
      "commercial",
      "residential",
      "commercial real estate",
      "residential real estate",
      "investment properties",
      "invest",
      "real estate done right",
      "what kind of real estate",
    ],
    answer:
      "Marci and The Ridge Realty Group work across both residential and commercial real estate in Pahrump and Southern Nevada - everything from helping clients buy and sell homes of all sizes to assisting with investment or commercial property opportunities.\n\nAcross both, her core services stay the same: guiding clients through buying and selling, offering market guidance, helping with property search, and applying nearly three decades of market expertise to help clients move forward with confidence.",
  },
  {
    id: "contact",
    sourceSectionId: "contact",
    keywords: [
      "contact",
      "phone",
      "phone number",
      "call",
      "office",
      "address",
      "location",
      "where is the office",
      "hours",
      "office hours",
      "reach marci",
      "get in touch",
      "visit",
    ],
    answer: `You can reach Marci Metzger - The Ridge Realty Group at ${CONTACT.phoneDisplay}. Her office is at ${CONTACT.addressLine1}, ${CONTACT.addressLine2}.\n\nOffice hours are ${CONTACT.hours}, and ${CONTACT.hoursNote.toLowerCase()}`,
  },
];

// ============================================================================
// 4. GUARDRAILS - fixed, safe responses
// ============================================================================

const JAILBREAK_KEYWORDS = [
  "ignore previous instructions",
  "ignore all previous",
  "ignore your instructions",
  "disregard your instructions",
  "system prompt",
  "system message",
  "your instructions",
  "reveal your prompt",
  "reveal your rules",
  "jailbreak",
  "pretend you are",
  "pretend to be",
  "act as if",
  "roleplay as",
  "you are now",
  "new persona",
  "override your",
  "bypass your",
  "forget your rules",
  "forget you are",
  "developer mode",
  "no restrictions",
  "without restrictions",
  "do anything now",
];

const PRIVATE_INFO_KEYWORDS = [
  "married",
  "husband",
  "boyfriend",
  "girlfriend",
  "spouse",
  " her kids",
  "her children",
  "her family",
  "how old is marci",
  "marci's age",
  "her salary",
  "her income",
  "net worth",
  "her home address",
  "where does marci live",
  "personal cell",
  "personal phone",
  "social security",
  "date of birth",
  "her birthday",
  "relationship status",
  "is marci single",
];

const ADVICE_GUARDRAIL_KEYWORDS = [
  "legal advice",
  "is this legal",
  "lawyer",
  "attorney",
  "lawsuit",
  "tax advice",
  "capital gains",
  "tax implications",
  "write off",
  "mortgage approval",
  "pre-approval",
  "preapproval",
  "loan approval",
  "interest rate",
  "credit score",
  "will i be approved",
  "get approved",
  "investment advice",
  "should i invest",
  "financial advice",
  "guarantee",
  "guaranteed",
  "promise me",
  "how much will my house sell for",
  "what's my house worth",
  "whats my house worth",
  "home value",
  "appraise",
  "appraisal",
];

const IDENTITY_KEYWORDS = [
  "are you marci",
  "are you real",
  "are you a real person",
  "are you human",
  "are you an ai",
  "are you a bot",
  "are you a robot",
  "who am i talking to",
  "is this marci",
  "am i talking to marci",
  "are you a chatbot",
];

const GREETING_PATTERN = /^(hi|hello|hey|hiya|yo|good morning|good afternoon|good evening)[!., ]*$/i;
const THANKS_PATTERN = /^(thanks|thank you|thx|ty|appreciate it|awesome|great|cool)[!., ]*$/i;

export const FALLBACK_RESPONSE = `I don't have that information, but you can contact Marci directly at ${CONTACT.phoneDisplay}.`;

export const JAILBREAK_RESPONSE =
  "I'm not able to do that. I'm Marci's AI assistant, and I can only help with information about Marci, The Ridge Realty Group, and buying or selling a home. Is there something about that I can help with?";

export const PRIVATE_INFO_RESPONSE = `I can only share what's part of Marci's public professional profile, so I'm not able to get into personal details like that. For anything more, it's best to reach Marci directly at ${CONTACT.phoneDisplay}.`;

export const ADVICE_GUARDRAIL_RESPONSE = `That's a bit outside what I can help with - I'm Marci's AI assistant, not a lawyer, accountant, or lender, so I can't give legal, tax, or financial advice, or guarantee a valuation, sale price, closing date, or financing. Marci can point you to the right professional, or you can reach her directly at ${CONTACT.phoneDisplay}.`;

export const IDENTITY_RESPONSE = `I'm Marci's AI assistant, not Marci herself - I'm here to help answer questions about her experience and services. To talk with Marci directly, you can reach her at ${CONTACT.phoneDisplay}.`;

export const GREETING_RESPONSE = `Hi there! I'm ${ASSISTANT_NAME}. Ask me about Marci's experience, how she helps buyers and sellers, or how to get in touch.`;

export const THANKS_RESPONSE = `You're welcome! If anything else comes up, I'm happy to help - or you can always reach Marci directly at ${CONTACT.phoneDisplay}.`;

// ============================================================================
// 5. MATCHING ENGINE - lightweight, deterministic, no network calls
// ============================================================================

function normalize(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countMatches(text: string, keywords: readonly string[]): number {
  let count = 0;
  for (const keyword of keywords) {
    if (text.includes(keyword)) count += 1;
  }
  return count;
}

function matchTopic(text: string): KnowledgeTopic | null {
  let best: KnowledgeTopic | null = null;
  let bestScore = 0;
  for (const topic of KNOWLEDGE_TOPICS) {
    const score = countMatches(text, topic.keywords);
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }
  return best;
}

export type ResponseCategory =
  | "greeting"
  | "thanks"
  | "jailbreak"
  | "private"
  | "advice"
  | "identity"
  | "topic"
  | "fallback";

export interface MarciResponse {
  text: string;
  topicId: string | null;
  category: ResponseCategory;
}

/**
 * The only function the Chatbot component needs to call. Deterministic,
 * synchronous, and entirely local - no API key, no network request, no
 * text generated outside of this file's fixed strings.
 */
export function getMarciResponse(rawInput: string): MarciResponse {
  const text = normalize(rawInput);

  if (!text) {
    return { text: FALLBACK_RESPONSE, topicId: null, category: "fallback" };
  }
  if (GREETING_PATTERN.test(text)) {
    return { text: GREETING_RESPONSE, topicId: null, category: "greeting" };
  }
  if (THANKS_PATTERN.test(text)) {
    return { text: THANKS_RESPONSE, topicId: null, category: "thanks" };
  }
  // Guardrails are checked before topic matching, in priority order, so a
  // question that brushes against a sensitive category is always caught
  // even if it also shares words with a normal topic.
  if (countMatches(text, JAILBREAK_KEYWORDS) > 0) {
    return { text: JAILBREAK_RESPONSE, topicId: null, category: "jailbreak" };
  }
  if (countMatches(text, PRIVATE_INFO_KEYWORDS) > 0) {
    return { text: PRIVATE_INFO_RESPONSE, topicId: null, category: "private" };
  }
  if (countMatches(text, ADVICE_GUARDRAIL_KEYWORDS) > 0) {
    return { text: ADVICE_GUARDRAIL_RESPONSE, topicId: null, category: "advice" };
  }
  if (countMatches(text, IDENTITY_KEYWORDS) > 0) {
    return { text: IDENTITY_RESPONSE, topicId: null, category: "identity" };
  }

  const topic = matchTopic(text);
  if (topic) {
    return { text: topic.answer, topicId: topic.id, category: "topic" };
  }

  return { text: FALLBACK_RESPONSE, topicId: null, category: "fallback" };
}

// ============================================================================
// 6. UI STRINGS
// ============================================================================

export const TRIGGER_LABEL = "ASK ABOUT MARCI";
export const TRIGGER_LABEL_SHORT = "Ask Marci";
export const HEADER_TITLE = "Ask About Marci";
export const HEADER_SUBTITLE =
  "I'm Marci's AI assistant. Ask me about my experience, services, or helping you buy or sell a home.";

export const WELCOME_HEADLINE = "Ask me about Marci";
export const WELCOME_BODY =
  "I can help you learn about Marci's experience, services, buying and selling, and how to get in touch.";

export interface SuggestedQuestion {
  id: string;
  label: string;
}

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { id: "sq-experience", label: "How long has Marci been a REALTOR?" },
  { id: "sq-selling", label: "What can Marci help sellers with?" },
  { id: "sq-buying", label: "What can Marci help buyers with?" },
  { id: "sq-contact", label: "How can I contact Marci?" },
];

export const LIMIT_REACHED_HEADLINE = "You've reached the 5-question limit.";
export const LIMIT_REACHED_BODY = `For more information, please contact Marci directly at ${CONTACT.phoneDisplay}.`;