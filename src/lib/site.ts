export const site = {
  agent: "Marci Metzger",
  brokerage: "The Ridge Realty Group",
  tagline: "Pahrump Realtor",
  experience: "Realtor for nearly 3 decades",
  phone: {
    display: "(206) 919-6886",
    href: "tel:+12069196886",
  },
  address: {
    street: "3190 HW-160, Suite F",
    cityStateZip: "Pahrump, Nevada 89048",
    country: "United States",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=3190+HW-160+Suite+F+Pahrump+NV+89048",
  },
  hours: {
    summary: "Open daily 8:00 am – 7:00 pm",
    note: "Appointments outside office hours available upon request. Just call!",
  },
  social: [
    { label: "Facebook", href: "https://www.facebook.com/MarciHomes/" },
    { label: "Instagram", href: "https://www.instagram.com/marcimetzger_theridge/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/marci-metzger-30642496/" },
    { label: "Yelp", href: "https://www.yelp.com/biz/xr3yQN_m2SgO0R_7S6p62w" },
  ],
} as const;

export const navLinks = [
  { label: "The Area", href: "#about" },
  { label: "Working With Marci", href: "#approach" },
  { label: "Find a Home", href: "#search" },
  { label: "Gallery", href: "#gallery" },
  { label: "Services", href: "#services" },
  { label: "Visit", href: "#contact" },
] as const;

export const trackRecord = [
  {
    title: "Top Residential Sales Last 5 Years",
    body: "We helped nearly 90 clients in 2021, and closed 28.5 million in sales! Our team works hard everyday to grow and learn, so that we may continue to excel in our market. Our clients deserve our best, & we want to make sure our best is better every year.",
  },
  {
    title: "Don't Just List it…",
    body: "Get it SOLD! We exhaust every avenue to ensure our listings are at the fingertips of every possible buyer, getting you top dollar for your home.",
  },
  {
    title: "Guide to Buyers",
    body: "Nobody knows the market like we do. Enjoy having a pro at your service. Market analysis, upgrades lists, contractors on speed dial, & more!",
  },
] as const;

export const services = [
  {
    title: "Buying & Selling",
    body: "Nervous about your property adventure? Don't be. Whether you're getting ready to buy or sell your residence, looking at investment properties, or just curious about the markets, our team ensures you get the best experience possible!",
    image: "/images/service-home-evening.jpg",
    alt: "Single-storey home at dusk with a pool and covered patio",
  },
  {
    title: "Commercial & Residential",
    body: "Large or small, condo or mansion, we can find it and get at the price that's right. Fixer-uppers? Luxury? We can help with all of it! We live, work, and play in this community. Happy to help you find where to put you hard-earned dollars.",
    image: "/images/service-open-kitchen.jpg",
    alt: "Open-plan kitchen and living space with wide windows",
  },
  {
    title: "Rely on Expertise",
    body: "If you have questions about affordability, credit, and loan options, trust us to connect you with the right people to get the answers you need in a timely fashion. We make sure you feel confident and educated every step of the way.",
    image: "/images/service-client-meeting.jpg",
    alt: "Two clients shaking hands with an advisor across a table",
  },
] as const;

export const gallery = [
  {
    src: "/images/gallery-roseworthy-52.jpg",
    alt: "Aerial view of a Pahrump golf community with a lake, clubhouse and pools below the mountains",
    width: 1024,
    height: 682,
  },
  {
    src: "/images/gallery-ailanto-45.jpg",
    alt: "Tile-roofed homes on a quiet street with the snow-topped range on the horizon",
    width: 1024,
    height: 682,
  },
  {
    src: "/images/gallery-beacon-ridge-41.jpg",
    alt: "Newly built single-storey homes backing onto the golf course and desert valley",
    width: 1024,
    height: 683,
  },
  {
    src: "/images/gallery-ailanto-14.jpg",
    alt: "Sitting room with floor-to-ceiling windows opening onto a desert garden",
    width: 1024,
    height: 682,
  },
  {
    src: "/images/gallery-beacon-ridge-53.jpg",
    alt: "Community clubhouse with tennis and pickleball courts beside the fairways",
    width: 1024,
    height: 683,
  },
  {
    src: "/images/gallery-ailanto-50.jpg",
    alt: "Backyard pool and covered patio looking out over the greens toward the mountains",
    width: 1024,
    height: 682,
  },
  {
    src: "/images/gallery-beacon-ridge-54.jpg",
    alt: "Wide view of the neighbourhood entrance, courts and clubhouse under an open sky",
    width: 1024,
    height: 683,
  },
] as const;
