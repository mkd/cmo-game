import { useState, useRef, useEffect } from 'react';
import cmoAvatar from './assets/cmo_avatar.png';

// --- SCENARIO DATA (20 STORIES) ---
const ALL_SCENARIOS = [
  // ORIGINAL 10
  {
    company: "Vigorade", product: "Energy Drink", type: "B2C", emoji: "⚡",
    introContext: "VIGORADE is an energy drink brand that launched strong but is stagnating relative to giants like Red Bull and Monster.",
    events: [
      { id: 1, title: 'Year 1: The Honeymoon Phase', description: 'The board is excited. The energy drink market is growing. They expect you to build memory structures quickly before competitors react.', challenge: 'massReach', hint: 'Focus on mass reach to build mental availability initially.' },
      { id: 2, title: 'Year 2: Retail Consolidation', description: 'Major supermarket chains are demanding higher margins. Shelf space is getting cut across the board for all brands.', challenge: 'distribution', hint: 'You must over-index on distribution to fight for physical availability.' },
      { id: 3, title: 'Year 3: The "Rebrand" Pitch', description: 'A creative agency is aggressively pushing you to change the Vigorade logo and colors to "appeal to Gen-Z".', challenge: 'maintain_assets', hint: 'Changing distinct brand assets destroys memory structures.' },
      { id: 4, title: 'Year 4: Competitor Ad Blitz', description: 'A rival brand just doubled their media spend and is flooding the airwaves. You need to defend your share of voice.', challenge: 'massReach', hint: 'Fight back with heavy mass reach advertising.' },
      { id: 5, title: 'Year 5: Global Expansion', description: 'This is the final year of your contract. Maximize your penetration and show the board the Vigorade growth engine works across all channels!', challenge: 'balanced', hint: 'A balanced attack on both availability fronts.' }
    ]
  },
  {
    company: "HealthCore", product: "Medical Software", type: "B2B SaaS", emoji: "🏥",
    introContext: "HealthCore builds scheduling software for hospitals. Sales cycles are long, but enterprise retention is high.",
    events: [
      { id: 1, title: 'Year 1: Foundation', description: 'You are tasked with getting HealthCore software into more hospital admins\' minds as the default choice.', challenge: 'massReach', hint: 'B2B still needs broad category mental availability.' },
      { id: 2, title: 'Year 2: Niche Competitor', description: 'A tiny startup is stealing cardiology clinics by claiming your software isn\'t specialized enough.', challenge: 'targeted', hint: 'Temporarily use targeted loyalty ads to reassure specific heavy-buyer clinics.' },
      { id: 3, title: 'Year 3: Infrastructure Upgrade', description: 'We just rebuilt the software to be fully cloud-based. You need to make it incredibly easy for IT departments to deploy us.', challenge: 'distribution', hint: 'Distribution in B2B SaaS means frictionless deployment and sales channels.' },
      { id: 4, title: 'Year 4: The Trade Show Circuit', description: 'It\'s a massive year for medical conferences. The board wants you to secure share of voice.', challenge: 'massReach', hint: 'Event sponsorships are a form of mass reach in B2B.' },
      { id: 5, title: 'Year 5: The Enterprise Push', description: 'Time to prove you can dominate the whole category, not just a niche.', challenge: 'broad_targeting', hint: 'Do not use hyper-niche targeting if you want mass growth.' }
    ]
  },
  {
    company: "Zenith Bank", product: "Retail Banking", type: "B2C Finance", emoji: "🏦",
    introContext: "Zenith Bank is a legacy retail bank trying to modernize and attract younger account holders without losing the older generation.",
    events: [
      { id: 1, title: 'Year 1: Digital Presence', description: 'The banking app just released. We need to make it as easy to open an account on a phone as it is in a branch.', challenge: 'distribution', hint: 'Digital distribution is physical availability.' },
      { id: 2, title: 'Year 2: Trust Crisis', description: 'A competitor had a data leak. Consumers are generally anxious about banking. We need to project massive stability to everyone.', challenge: 'massReach', hint: 'Massive share of voice builds trust and mental availability.' },
      { id: 3, title: 'Year 3: Board Panic', description: 'The board thinks Zenith looks "too old" and wants to rename the bank completely to "Z-Bank".', challenge: 'maintain_assets', hint: 'Trust is built on consistency. Don\'t rebrand.' },
      { id: 4, title: 'Year 4: Fintech Attack', description: 'Neon banks are popping up offering slightly better interest rates. We must retain our ease of use advantage.', challenge: 'distribution', hint: 'Double down on making the product frictionless to acquire.' },
      { id: 5, title: 'Year 5: Category Dominance', description: 'Show them that traditional banking with modern convenience can win the whole market.', challenge: 'balanced', hint: 'Keep availability high across the board.' }
    ]
  },
  {
    company: "FreshBite", product: "Fast Food Franchise", type: "B2C Retail", emoji: "🍔",
    introContext: "FreshBite is a regional burger chain looking to expand nationally. The fast food market is cutthroat.",
    events: [
      { id: 1, title: 'Year 1: Regional Push', description: 'People forget about us when they are hungry and driving. Make sure our jingle is playing in their cars.', challenge: 'massReach', hint: 'Radio and outdoor ads build mental availability.' },
      { id: 2, title: 'Year 2: Franchise Expansion', description: 'We have massive demand but lines are too long and we don\'t have enough drive-thrus.', challenge: 'distribution', hint: 'Physical availability is literally opening more stores.' },
      { id: 3, title: 'Year 3: The Vegan Fad', description: 'Some loud influencers are demanding we change our targeting to only focus on hyper-niche plant-based consumers.', challenge: 'broad_targeting', hint: 'Hyper-niche capping will kill your mass market penetration.' },
      { id: 4, title: 'Year 4: Competitor Coupon War', description: 'Rivals are discounting heavily. We need to remind everyone why they love our consistent, memorable brand.', challenge: 'massReach', hint: 'Do not engage in price wars. Rely on strong mental availability.' },
      { id: 5, title: 'Year 5: National Stage', description: 'Make FreshBite a household name across the country.', challenge: 'balanced', hint: 'Balance is key to final growth.' }
    ]
  },
  {
    company: "Horizon Auto", product: "Electric Vehicles", type: "B2C Automotive", emoji: "🏎️",
    introContext: "Horizon Auto makes premium EVs. You need to move them from a niche early-adopter product to mass market adoption.",
    events: [
      { id: 1, title: 'Year 1: Dealership Rollout', description: 'People won\'t buy cars they can\'t test drive. We desperately need more physical locations.', challenge: 'distribution', hint: 'Physical availability is the bottleneck for EVs.' },
      { id: 2, title: 'Year 2: Mainstream Awareness', description: 'Early adopters know us, but the average family doesn\'t consider a Horizon when buying a minivan.', challenge: 'massReach', hint: 'Mass market advertising bridges the chasm.' },
      { id: 3, title: 'Year 3: The Luxury Trap', description: 'Some executives want to target ONLY millionaires and make the cars hyper-exclusive.', challenge: 'broad_targeting', hint: 'Niche targeting caps your total market share.' },
      { id: 4, title: 'Year 4: The Logo Redesign', description: 'The new design chief wants to change the classic Horizon emblem to a minimalist geometric shape.', challenge: 'maintain_assets', hint: 'Car logos are critical DBAs. Do not change it.' },
      { id: 5, title: 'Year 5: Mass Production', description: 'Ensure the cars are available everywhere and top of mind for every commuter.', challenge: 'balanced', hint: 'Both availabilities must peak.' }
    ]
  },
  {
    company: "PureGlow", product: "D2C Skincare", type: "B2C Ecommerce", emoji: "✨",
    introContext: "PureGlow blew up on social media, but now you need to prove it's a real brand, not just a passing trend.",
    events: [
      { id: 1, title: 'Year 1: Beyond Influencers', description: 'Social media targeting is getting too expensive. We need broad awareness across all age groups.', challenge: 'massReach', hint: 'Stop relying solely on targeted ads.' },
      { id: 2, title: 'Year 2: Retail Shelf Space', description: 'D2C is nice, but to hit massive growth, we need to be on the shelves of Sephora and Target.', challenge: 'distribution', hint: 'Physical availability in retail stores is vital.' },
      { id: 3, title: 'Year 3: The Trendy Packaging', description: 'An agency suggests changing our signature pink bottles to matte black to look "edgy".', challenge: 'maintain_assets', hint: 'Packaging color is a Distinctive Brand Asset.' },
      { id: 4, title: 'Year 4: Competitor Dupe', description: 'A cheap competitor cloned our product. We must overwhelm the market with our original brand presence.', challenge: 'massReach', hint: 'Loud, broad advertising reminds people who the original is.' },
      { id: 5, title: 'Year 5: Household Name', description: 'Cement PureGlow as a staple in every bathroom.', challenge: 'balanced', hint: 'Keep both metrics growing.' }
    ]
  },
  {
    company: "NeoWear", product: "Sustainable Fashion", type: "B2C Retail", emoji: "👕",
    introContext: "NeoWear creates sustainable apparel. The challenge is moving beyond just the 'eco-warrior' segment to everyday clothing buyers.",
    events: [
      { id: 1, title: 'Year 1: Break the Niche', description: 'We must convince average consumers that NeoWear is just great clothing, not just a political statement.', challenge: 'broad_targeting', hint: 'Mass targeting over hyper-niche segmentation.' },
      { id: 2, title: 'Year 2: Physical Stores', description: 'Online returns are killing margins. People want to try on clothes before buying.', challenge: 'distribution', hint: 'Physical availability solves ecommerce return issues.' },
      { id: 3, title: 'Year 3: Fast Fashion Attack', description: 'Fast fashion brands are spending billions on TV ads. We are getting drowned out.', challenge: 'massReach', hint: 'You must spend on mass reach to compete for share of voice.' },
      { id: 4, title: 'Year 4: The Rebrand Mistake', description: 'The board thinks the green leaf logo is cliché and wants a plain text logo.', challenge: 'maintain_assets', hint: 'Distinctive brand assets take years to build. Keep the leaf.' },
      { id: 5, title: 'Year 5: The Global Standard', description: 'Make NeoWear the default choice for a basic t-shirt.', challenge: 'balanced', hint: 'Balance your funding.' }
    ]
  },
  {
    company: "CloudSync", product: "B2B Productivity", type: "B2B SaaS", emoji: "☁️",
    introContext: "CloudSync is an enterprise file-sharing tool competing with behemoths like Google and Microsoft.",
    events: [
      { id: 1, title: 'Year 1: Enterprise Awareness', description: 'CIOs don\'t buy what they haven\'t heard of. Get the name everywhere.', challenge: 'massReach', hint: 'Mass reach marketing builds the B2B enterprise funnel.' },
      { id: 2, title: 'Year 2: Onboarding Choke', description: 'The product is great, but IT teams complain it takes 6 months to deploy.', challenge: 'distribution', hint: 'Frictionless distribution/onboarding is B2B physical availability.' },
      { id: 3, title: 'Year 3: The Loyalty Trap', description: 'Some analysts say we should only market to our current users to upsell them features.', challenge: 'massReach', hint: 'Loyalty programs do not grow market penetration (Sharp).' },
      { id: 4, title: 'Year 4: The Startups', description: 'Small startups want to use CloudSync, but current targeting is hyper-niche for Fortune 500s only.', challenge: 'broad_targeting', hint: 'Open the targeting up. Broad market.' },
      { id: 5, title: 'Year 5: Final Evaluation', description: 'Show the VCs that you can steal market share from the giants.', challenge: 'balanced', hint: 'Fund everything properly.' }
    ]
  },
  {
    company: "Titan Fitness", product: "Gym Chain", type: "B2C Services", emoji: "🏋️",
    introContext: "Titan Fitness operates massive gyms. You need to get more memberships in a highly localized market.",
    events: [
      { id: 1, title: 'Year 1: Location, Location', description: 'People won\'t drive more than 15 minutes to a gym. We need to blanket the suburbs.', challenge: 'distribution', hint: 'Opening new locations is the ultimate physical availability.' },
      { id: 2, title: 'Year 2: New Year\'s Resolution', description: 'January is coming. We need every single person in the city to think of Titan when they decide to work out.', challenge: 'massReach', hint: 'Massive mental availability push required.' },
      { id: 3, title: 'Year 3: The "Elite" Strategy', description: 'A consultant suggests raising prices 400% and exclusively targeting elite bodybuilders.', challenge: 'broad_targeting', hint: 'Hyper-niche positioning limits total revenue.' },
      { id: 4, title: 'Year 4: Logo Confusion', description: 'A competitor opened with a very similar logo. We need to strictly reinforce our unique colors and assets.', challenge: 'maintain_assets', hint: 'Defend your Distinctive Brand Assets.' },
      { id: 5, title: 'Year 5: National Chain', description: 'Prove Titan Fitness is the dominant player.', challenge: 'balanced', hint: 'Sustain the growth engine.' }
    ]
  },
  {
    company: "PetPal", product: "Premium Pet Food", type: "B2C Consumer", emoji: "🐕",
    introContext: "PetPal makes high-quality dog food. Pet owners are notoriously loyal to their brands, making penetration hard.",
    events: [
      { id: 1, title: 'Year 1: Vet Clinic Push', description: 'Consumers buy what their vet recommends, but vets aren\'t carrying our bags.', challenge: 'distribution', hint: 'Get the product on the physical shelves of clinics.' },
      { id: 2, title: 'Year 2: The Cute Dog Ad', description: 'We need a blockbuster TV commercial to make sure everyone associates our brand with healthy, happy dogs.', challenge: 'massReach', hint: 'Emotional mass reach builds strong mental availability.' },
      { id: 3, title: 'Year 3: The Niche Trap', description: 'Sales suggests we only make food for senior Dalmatians with allergies.', challenge: 'broad_targeting', hint: 'Do not hyper-segment your product line.' },
      { id: 4, title: 'Year 4: Packaging Redesign', description: 'A new agency wants to change the bright yellow bags to premium muted gray.', challenge: 'maintain_assets', hint: 'Shoppers look for the yellow bag instantly. Do not change it.' },
      { id: 5, title: 'Year 5: Top Dog', description: 'Make PetPal the undeniable market leader.', challenge: 'balanced', hint: 'Keep growth steady.' }
    ]
  },
  // NEW 10 TECH SCENARIOS
  {
    company: "CyberShield", product: "Enterprise Cybersecurity", type: "B2B Tech", emoji: "🛡️",
    introContext: "CyberShield offers advanced zero-trust network authorization for Fortune 1000 companies. The market is increasingly paranoid and crowded.",
    events: [
      { id: 1, title: 'Year 1: Thought Leadership', description: 'CTOs don\'t buy what they haven\'t heard of. We must become the loudest voice in cybersecurity.', challenge: 'massReach', hint: 'B2B Tech buyers need mental availability before a sales pitch even happens.' },
      { id: 2, title: 'Year 2: Channel Partners', description: 'Direct sales are too slow. IT consulting agencies refuse to resell us because our integration API is clunky.', challenge: 'distribution', hint: 'In B2B tech, partner networks and APIs are your physical availability.' },
      { id: 3, title: 'Year 3: The Hacker Scare', description: 'A massive global ransomeware attack just hit the news. The entire market is searching for solutions right now.', challenge: 'massReach', hint: 'Strike while the iron is hot. Maximize reach immediately.' },
      { id: 4, title: 'Year 4: Narrowing the Scope', description: 'Product management suggests we stop selling to everyone, and exclusively build solutions for the airline industry.', challenge: 'broad_targeting', hint: 'Hyper-niche tech positioning destroys broader TAM.' },
      { id: 5, title: 'Year 5: The Unbreachable Standard', description: 'Solidify CyberShield as the default choice before potential acquisition.', challenge: 'balanced', hint: 'Hold the line with balanced spending.' }
    ]
  },
  {
    company: "DataMesh", product: "AI Analytics Engine", type: "B2B SaaS", emoji: "🧠",
    introContext: "DataMesh takes unstructured corporate data and visualizes it using LLMs. It looks flashy, but churn is a problem.",
    events: [
      { id: 1, title: 'Year 1: API Accessibility', description: 'No one wants to log into a new tool. We need our AI to live directly inside Slack, Teams, and Salesforce.', challenge: 'distribution', hint: 'Make the product easy to access where users already work (Distribution).' },
      { id: 2, title: 'Year 2: The Over-Promise', description: 'Competitors are promising Artificial General Intelligence. We need massive reach to ground our practical brand in reality.', challenge: 'massReach', hint: 'Drown out the noise with consistent mental availability.' },
      { id: 3, title: 'Year 3: Heavy User Obsession', description: 'Sales wants to dedicate 80% of marketing to upselling our top 100 Power Users rather than finding new ones.', challenge: 'massReach', hint: 'Loyalty programs do not grow market penetration.' },
      { id: 4, title: 'Year 4: Pivot the Brand?', description: 'Our signature Purple Brain logo feels 2 years old now. Let\'s change the name to something more abstract and mysterious.', challenge: 'maintain_assets', hint: 'Distinctive brand assets must survive fads.' },
      { id: 5, title: 'Year 5: Market Saturation', description: 'We are reaching maturity. Time to prove the growth engine works long term.', challenge: 'balanced', hint: 'Maintain the balance.' }
    ]
  },
  {
    company: "QuantumPay", product: "Fintech Payment API", type: "B2B Tech", emoji: "💳",
    introContext: "QuantumPay is a payment gateway (like Stripe) trying to win over e-commerce developers with lower fees.",
    events: [
      { id: 1, title: 'Year 1: Developer Friction', description: 'Our documentation is terrible and SDKs are taking a week to install.', challenge: 'distribution', hint: 'Developer friction is poor physical availability.' },
      { id: 2, title: 'Year 2: Trust is Everything', description: 'Developers need to trust our uptime. We must be perceived as massive and omnipresent.', challenge: 'massReach', hint: 'Massive reach builds B2B trust.' },
      { id: 3, title: 'Year 3: The Bitcoin Pivot', description: 'Crypto is trending. Investors want us to drop regular e-commerce and only process obscure stablecoins.', challenge: 'broad_targeting', hint: 'Don\'t abandon the mass market for a hyper-niche.' },
      { id: 4, title: 'Year 4: Enterprise Whales', description: 'We just landed a huge retail chain. Now we need to reassure them we have the infrastructure.', challenge: 'targeted', hint: 'Sometimes targeted loyalty spend is needed to retain enterprise whales in B2B.' },
      { id: 5, title: 'Year 5: Default Gateway', description: 'Make QuantumPay the default standard for all new tech startups.', challenge: 'balanced', hint: 'Balance the load.' }
    ]
  },
  {
    company: "StreamWorks", product: "Enterprise Video Hosting", type: "B2B SaaS", emoji: "🎥",
    introContext: "StreamWorks provides secure, internal video broadcasting for global corporations. Competing with Microsoft Stream is brutal.",
    events: [
      { id: 1, title: 'Year 1: Breakout Awareness', description: 'Microsoft is the default. If IT directors haven\'t heard of us, we will never get past procurement.', challenge: 'massReach', hint: 'You must build massive mental availability to bypass the default.' },
      { id: 2, title: 'Year 2: The SSO Barrier', description: 'Employees hate our video portal because they have to use a separate password. Adoption is dying inside companies that bought it.', challenge: 'distribution', hint: 'Single Sign-On (SSO) is critical distribution for enterprise software.' },
      { id: 3, title: 'Year 3: The Icon Shift', description: 'Our design team wants to replace our neon play-button logo with an abstract geometric sphere.', challenge: 'maintain_assets', hint: 'Never discard a Distinctive Brand Asset just because you are bored of it.' },
      { id: 4, title: 'Year 4: Expanding Horizons', description: 'Some propose we stop selling to HR departments and only sell to high-end Hollywood production studios.', challenge: 'broad_targeting', hint: 'A drastic niche pivot guarantees a capped market ceiling.' },
      { id: 5, title: 'Year 5: Global Deployment', description: 'Final year to prove we can win the Fortune 500.', challenge: 'balanced', hint: 'Ensure both MA and PA are funded.' }
    ]
  },
  {
    company: "OmniCart", product: "Headless E-commerce", type: "B2B Platform", emoji: "🛒",
    introContext: "OmniCart is a flexible backend platform for massive online retailers, directly fighting Shopify Plus.",
    events: [
      { id: 1, title: 'Year 1: The Integration Game', description: 'Agencies build these sites, not the brands themselves. We aren\'t integrated with the top agency boilerplates.', challenge: 'distribution', hint: 'In ecosystem tech, partnering with agencies is your physical distribution.' },
      { id: 2, title: 'Year 2: Industry Whispers', description: 'Shopify is blanketing Times Square and tech portals with ads. We are getting forgotten.', challenge: 'massReach', hint: 'You can\'t win if you aren\'t mentally available when replatforming decisions happen.' },
      { id: 3, title: 'Year 3: The Power Features', description: 'Our existing 100 enterprise clients want us to spend all our money building custom features just for them.', challenge: 'massReach', hint: 'Appeasing heavy buyers at the expense of mass reach stalls growth.' },
      { id: 4, title: 'Year 4: The 1% Fixation', description: 'Should we only target companies doing over $1 billion a year in revenue?', challenge: 'broad_targeting', hint: 'Don\'t segment so heavily that you lock yourself out of the mid-market.' },
      { id: 5, title: 'Year 5: The E-commerce Standard', description: 'Take OmniCart to the absolute top of the enterprise stack.', challenge: 'balanced', hint: 'Final balancing act.' }
    ]
  },
  {
    company: "DevOpsFlow", product: "Deployment Automation", type: "B2B DevTools", emoji: "💻",
    introContext: "DevOpsFlow helps engineers automate server deployments. It's a complex product aiming for a highly skeptical technical audience.",
    events: [
      { id: 1, title: 'Year 1: Pluggability', description: 'Engineers refuse to use us because we don\'t have a direct GitHub integration. It takes 10 manual steps to set up.', challenge: 'distribution', hint: 'Developer physical availability means 1-click cloud integrations.' },
      { id: 2, title: 'Year 2: Mindshare War', description: 'A massive venture-backed competitor just launched with huge billboards in SF and heavy podcast sponsorships.', challenge: 'massReach', hint: 'Developers buy what they remember. Fight back with mass reach.' },
      { id: 3, title: 'Year 3: Rebrand Resistance', description: 'Marketing wants to scrap the classic "flowing server" mascot we\'ve had for 5 years.', challenge: 'maintain_assets', hint: 'Mascots are powerful Distinctive Brand Assets (like GitHub\'s Octocat). Keep it.' },
      { id: 4, title: 'Year 4: The Rust Obsession', description: 'A small but loud group of engineers demand we rewrite everything in Rust and only market to Rust developers.', challenge: 'broad_targeting', hint: 'Niche targeting stunts scale. Serve all major languages.' },
      { id: 5, title: 'Year 5: The Developer Default', description: 'Make DevOpsFlow the de-facto standard for every engineering team.', challenge: 'balanced', hint: 'Fund across the board.' }
    ]
  },
  {
    company: "MetaComm", product: "Unified Communications", type: "B2B Hardware/Software", emoji: "💬",
    introContext: "MetaComm sells enterprise communication hubs—both software software and conference room hardware.",
    events: [
      { id: 1, title: 'Year 1: The Remote Shift', description: 'Companies are confused about office communications. We need to be loud enough that CEOs think of us first.', challenge: 'massReach', hint: 'Mental availability is crucial in confusing, shifting markets.' },
      { id: 2, title: 'Year 2: Supply Chain Crunch', description: 'Our conference room cameras are stuck in ports. We can\'t fulfill purchase orders fast enough.', challenge: 'distribution', hint: 'Hardware needs robust physical availability to convert demand to sales.' },
      { id: 3, title: 'Year 3: The Color Palette', description: 'We\'ve always used neon blue and silver. A consultant says we should switch to muted earth tones.', challenge: 'maintain_assets', hint: 'Changing colors destroys asset recognition.' },
      { id: 4, title: 'Year 4: The Enterprise RFP', description: 'We\'ve qualified for a massive government contract. We need to hyper-target the decision-makers to close it over 12 months.', challenge: 'targeted', hint: 'B2B enterprise whales sometimes require heavily targeted tactical spend.' },
      { id: 5, title: 'Year 5: Office Ubiquity', description: 'Your final year to put MetaComm hardware in every boardroom on earth.', challenge: 'balanced', hint: 'Maintain the momentum.' }
    ]
  },
  {
    company: "AeroDrone", product: "Commercial Drone Mapping", type: "B2B Tech/Hardware", emoji: "🚁",
    introContext: "AeroDrone builds autonomous drones for agricultural and construction mapping. It's a high-ticket capital expense.",
    events: [
      { id: 1, title: 'Year 1: Dealership Networks', description: 'Farmers and construction firms don\'t buy $50,000 drones online. We need specialized equipment dealers.', challenge: 'distribution', hint: 'Physical availability here is offline dealer networks.' },
      { id: 2, title: 'Year 2: Category Education', description: 'Most industries don\'t even know drone mapping is an option. We need to create the category in their minds.', challenge: 'massReach', hint: 'Category creation requires tremendous mass reach.' },
      { id: 3, title: 'Year 3: The Surveying Niche', description: 'We discovered that land surveyors love us. Should we stop selling to everyone else and just target surveyors?', challenge: 'broad_targeting', hint: 'A single niche will ultimately throttle your revenue.' },
      { id: 4, title: 'Year 4: Drone Show Buzz', description: 'Competitors are putting on flashy LED drone shows to get sheer brand dominance. We are losing share of voice.', challenge: 'massReach', hint: 'Drown them out. Mental availability won\'t maintain itself.' },
      { id: 5, title: 'Year 5: Skies Dominated', description: 'Secure AeroDrone\'s legacy as the premier commercial UAV manufacturer.', challenge: 'balanced', hint: 'Balance the final year.' }
    ]
  },
  {
    company: "NanoTech", product: "Silicon Microprocessors", type: "B2B Tech/OEM", emoji: "🖲️",
    introContext: "NanoTech designs powerful, low-energy chips acting as OEM for device manufacturers. The logo is rarely seen by end consumers.",
    events: [
      { id: 1, title: 'Year 1: The Intel Model', description: 'End-consumers don\'t know we exist inside their phones. We want them to demand our chips from phone makers.', challenge: 'massReach', hint: 'An \'Intel Inside\' strategy requires mass reach mental availability.' },
      { id: 2, title: 'Year 2: Foundry Shortages', description: 'Semiconductor fabs are backed up. Smartphone makers want to use us, but we can\'t physically source the silicon.', challenge: 'distribution', hint: 'Your physical availability is supply chain robustness.' },
      { id: 3, title: 'Year 3: The "Gold" Branding', description: 'Our chips have always been branded with a distinct gold "N". Engineering thinks printing the logo is a waste of time.', challenge: 'maintain_assets', hint: 'Never compromise distinctive brand assets, even in B2B hardware.' },
      { id: 4, title: 'Year 4: The Supercomputer Niche', description: 'A faction in the board wants to stop making smartphone chips and only make chips for quantum supercomputers.', challenge: 'broad_targeting', hint: 'Leaving the mass market volume destroys the core business.' },
      { id: 5, title: 'Year 5: The Silicon Standard', description: 'Ensure NanoTech is the undisputed leader in OEM components.', challenge: 'balanced', hint: 'Finish strong.' }
    ]
  },
  {
    company: "VR-Sync", product: "VR Collaboration Suites", type: "B2B Tech Software", emoji: "🥽",
    introContext: "VR-Sync creates virtual reality meeting rooms. It's highly bleeding edge, meaning huge skepticism and friction.",
    events: [
      { id: 1, title: 'Year 1: Hardware Friction', description: 'Our software is amazing, but it requires users to manually side-load the app onto their headsets. Nobody is doing it.', challenge: 'distribution', hint: 'If the app store distribution is bad, physical availability drops to zero.' },
      { id: 2, title: 'Year 2: The Metaverse Hype', description: 'The word "Metaverse" is everywhere. We need to ensure when executives hear it, they think of VR-Sync.', challenge: 'massReach', hint: 'Ride the wave with massive mental availability spend.' },
      { id: 3, title: 'Year 3: The Web3 Distraction', description: 'Investors are pressuring us to pivot the brand, add NFTs, and change our logo to the Doge meme.', challenge: 'maintain_assets', hint: 'Do not chase fads. Preserve your distinctive brand assets.' },
      { id: 4, title: 'Year 4: Corporate Whales', description: 'Adoption is slowing. We need to hyper-target heavy users (Fortune 500 CEOs) to convince them to mandate it.', challenge: 'targeted', hint: 'B2B enterprise sometimes necessitates targeted loyalty pushes.' },
      { id: 5, title: 'Year 5: Virtual Reality Reality', description: 'Prove that VR-Sync is here to stay, not just a pandemic fad.', challenge: 'balanced', hint: 'Maintain the ecosystem.' }
    ]
  }
];

const INITIAL_STATE = {
  year: 1,
  budget: 1000000,
  mentalAvailability: 15,
  physicalAvailability: 15,
  marketShare: 4.5,
  revenue: 4500000,
  feedback: null,
  feedbackType: 'neutral', // positive | negative | neutral
  history: [
    { year: 1, marketShare: 4.5, revenue: 4500000, ma: 15, pa: 15 } // Array to chart out
  ] 
};

function App() {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  
  // Lazily initialize scenario on load
  const [scenario, setScenario] = useState(() => ALL_SCENARIOS[Math.floor(Math.random() * ALL_SCENARIOS.length)]);
  
  // App boots into an empty splash page to grab the first user click and seamlessly enable audio.
  const [phase, setPhase] = useState('splash'); // splash, intro, event, allocate, summary, end, fired
  
  const [allocations, setAllocations] = useState({ massReach: 0, targeted: 0, distribution: 0 });
  const [brandAssetStrategy, setBrandAssetStrategy] = useState('maintain');
  const [targetingStrategy, setTargetingStrategy] = useState('mass');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [boardTarget, setBoardTarget] = useState(null);
  const [lastBoardTarget, setLastBoardTarget] = useState(null);
  
  const audioCtxRef = useRef(null);
  const musicIntervalRef = useRef(null);
  const currentEvent = scenario.events[gameState.year - 1] || scenario.events[4];

  // Stop music on unmount
  useEffect(() => {
    return () => stopMusic();
  }, []);

  // Generate targets when moving to event phase
  useEffect(() => {
    if (phase === 'event' && !boardTarget) {
      setBoardTarget({
        marketShare: parseFloat((gameState.marketShare * 1.08).toFixed(1)),
        mental: Math.min(100, Math.ceil(gameState.mentalAvailability * 1.15)),
        physical: Math.min(100, Math.ceil(gameState.physicalAvailability * 1.15)),
        revenue: (gameState.revenue * 1.08)
      });
    }
  }, [phase, gameState, boardTarget]);

  const stopMusic = () => {
    if (musicIntervalRef.current) clearInterval(musicIntervalRef.current);
    if (audioCtxRef.current) audioCtxRef.current.close();
    audioCtxRef.current = null;
    setIsAudioPlaying(false);
  };

  const startMusic = (type = 'bgm') => {
    if (audioCtxRef.current) stopMusic(); // Reset audio context if switching tracks

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    setIsAudioPlaying(true);

    if (type === 'failure') {
      playFailureJingle(ctx);
      return;
    }

    // MULTI-MINUTE PROCEDURAL 8-BIT MUSIC
    let chords = [];
    let tempoMs = 150;

    if (type === 'bgm') {
      // Minor somewhat tense progression
      chords = [
        [130.81, 155.56, 196.00], // Cm
        [103.83, 130.81, 155.56], // Ab
        [155.56, 196.00, 233.08], // Eb
        [116.54, 146.83, 174.61]  // Bb
      ];
    } else if (type === 'victory') {
      // Endless UPBEAT, faster Major progression!
      tempoMs = 120; // faster
      chords = [
        [130.81, 164.81, 196.00], // C major
        [174.61, 220.00, 261.63], // F major
        [196.00, 246.94, 293.66], // G major
        [130.81, 164.81, 196.00]  // C major
      ];
    }

    let step = 0;
    
    musicIntervalRef.current = setInterval(() => {
      if (ctx.state !== 'running') return;
      const time = ctx.currentTime;
      
      const measure = Math.floor(step / 16);
      const chordIdx = measure % 4;
      const currentChord = chords[chordIdx];

      // Arpeggio / accompaniment
      if (step % 2 === 0) {
        const arpFreq = currentChord[(step / 2) % 3] * 2; 
        const oscA = ctx.createOscillator();
        const gainA = ctx.createGain();
        oscA.type = type === 'victory' ? 'square' : 'triangle'; // Brighter sound for victory
        oscA.frequency.value = arpFreq;
        oscA.connect(gainA);
        gainA.connect(ctx.destination);
        gainA.gain.setValueAtTime(0.04, time);
        gainA.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        oscA.start(time);
        oscA.stop(time + 0.15);
      }

      // Bassline
      if (step % 4 === 0 || step % 4 === 3) {
        const bassFreq = currentChord[0] / 2;
        const oscB = ctx.createOscillator();
        const gainB = ctx.createGain();
        oscB.type = 'square';
        oscB.frequency.value = bassFreq;
        oscB.connect(gainB);
        gainB.connect(ctx.destination);
        gainB.gain.setValueAtTime(0.06, time);
        gainB.gain.linearRampToValueAtTime(0.01, time + 0.3);
        oscB.start(time);
        oscB.stop(time + 0.3);
      }

      // Procedural Melody
      if (step % 8 === 0 || Math.random() > 0.8) {
        const melodyFreq = currentChord[Math.floor(Math.random() * 3)] * 4;
        const oscM = ctx.createOscillator();
        const gainM = ctx.createGain();
        oscM.type = 'square';
        oscM.frequency.value = melodyFreq;
        oscM.connect(gainM);
        gainM.connect(ctx.destination);
        const duration = (Math.random() > 0.5) ? 0.2 : 0.4;
        gainM.gain.setValueAtTime(0.04, time);
        gainM.gain.linearRampToValueAtTime(0.001, time + duration);
        oscM.start(time);
        oscM.stop(time + duration);
      }
      step++;
    }, tempoMs);
  };

  const playFailureJingle = (ctx) => {
    const time = ctx.currentTime;
    const notes = [261.63, 246.94, 233.08, 220.00]; 
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.1, time + (i * 0.4));
      gain.gain.linearRampToValueAtTime(0.001, time + (i * 0.4) + 0.4);
      osc.start(time + (i * 0.4));
      osc.stop(time + (i * 0.4) + 0.4);
    });
  };

  const toggleMusic = () => {
    if (isAudioPlaying) {
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
        setIsAudioPlaying(false);
      }
    } else {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
        setIsAudioPlaying(true);
      } else {
        startMusic('bgm');
      }
    }
  };

  const beep = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, audioCtxRef.current.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.1);
  };

  const restartGame = () => {
    const randIndex = Math.floor(Math.random() * ALL_SCENARIOS.length);
    setScenario(ALL_SCENARIOS[randIndex]);
    setGameState(INITIAL_STATE);
    setBoardTarget(null);
    setPhase('splash');
    stopMusic(); 
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const calculateNextYear = () => {
    beep();
    let newMA = gameState.mentalAvailability * 0.75; // 25% decay
    let newPA = gameState.physicalAvailability * 0.75; // 25% decay
    let feedbackStr = null;
    let computedFeedbackType = 'neutral';

    const challenge = currentEvent.challenge;
    
    const massPct = allocations.massReach / gameState.budget;
    const distPct = allocations.distribution / gameState.budget;
    
    newMA += (allocations.massReach / 50000) * 1.5;
    newMA += (allocations.targeted / 50000) * 0.4; 
    newPA += (allocations.distribution / 50000) * 1.5;

    // SCENARIO GRADING ENGINE
    if (challenge === 'massReach' && massPct < 0.4) {
      newMA -= 15;
      feedbackStr = "⚠️ You underinvested in Mass Reach when the market context demanded it!\n";
      computedFeedbackType = 'negative';
    }
    if (challenge === 'distribution' && distPct < 0.4) {
      newPA -= 15;
      feedbackStr = (feedbackStr || "") + "⚠️ You ignored Distribution. Without Physical Availability, your demand evaporated.\n";
      computedFeedbackType = 'negative';
    }
    if (challenge === 'targeted' && allocations.targeted < (gameState.budget * 0.3)) {
      newMA -= 5;
      feedbackStr = (feedbackStr || "") + "⚠️ You missed a critical Enterprise/Loyalty retention window.\n";
      computedFeedbackType = 'negative';
    }
    if (challenge === 'maintain_assets' && brandAssetStrategy === 'refresh') {
      newMA -= 30; // Fatal mistake
      feedbackStr = (feedbackStr || "") + "⚠️ FATAL ERROR: You refreshed your distinct brand assets. Consumer memory structures were completely destroyed!\n";
      computedFeedbackType = 'negative';
    } else if (brandAssetStrategy !== 'refresh') {
      newMA += 3;
    }
    if (challenge === 'broad_targeting' && targetingStrategy === 'niche') {
        newMA = Math.min(newMA, 30); // Niche cap
        feedbackStr = (feedbackStr || "") + "⚠️ You narrowed your targeting too much. Growth is hard-capped by the size of your niche.\n";
        computedFeedbackType = 'negative';
    } else if (targetingStrategy === 'niche') {
        newMA = Math.min(newMA, 40);
    }

    newMA = Math.min(100, Math.max(0, newMA));
    newPA = Math.min(100, Math.max(0, newPA));

    let volatility = 1 + ((Math.random() * 0.2) - 0.1);
    
    let calculatedMS = ((newMA * 0.6) + (newPA * 0.4)) * 0.4 * volatility; 
    let newMarketShare = Math.max(0, calculatedMS);

    let marketSize = 100000000;
    let newRevenue = marketSize * (newMarketShare / 100);
    
    let nextBudget = (newRevenue * 0.2) + 200000;
    
    // Evaluate Board Target
    if (boardTarget && newMarketShare < boardTarget.marketShare) {
      feedbackStr = (feedbackStr || "") + `📉 You missed the CEO's growth target of ${boardTarget.marketShare}% Market Share.`;
      computedFeedbackType = 'negative';
    } else if (boardTarget) {
      feedbackStr = (feedbackStr || "") + `📈 Excellent work! You exceeded the CEO's growth target.`;
      if (computedFeedbackType !== 'negative') computedFeedbackType = 'positive';
    }

    const nextGameState = {
      year: gameState.year + 1,
      budget: nextBudget,
      mentalAvailability: parseFloat(newMA.toFixed(1)),
      physicalAvailability: parseFloat(newPA.toFixed(1)),
      marketShare: parseFloat(newMarketShare.toFixed(1)),
      revenue: newRevenue,
      feedback: feedbackStr,
      feedbackType: computedFeedbackType,
      history: [...gameState.history, { 
        year: gameState.year + 1, 
        marketShare: parseFloat(newMarketShare.toFixed(1)), 
        revenue: newRevenue,
        ma: parseFloat(newMA.toFixed(1)),
        pa: parseFloat(newPA.toFixed(1))
      }]
    };

    setGameState(nextGameState);
    setLastBoardTarget(boardTarget);
    setBoardTarget(null); // Reset target for next phase
    setAllocations({ massReach: 0, targeted: 0, distribution: 0 });
    
    if (newMarketShare < 2.0) {
      setPhase('fired');
      startMusic('failure');
      return;
    }
    
    if (nextGameState.year > 5) {
      setPhase('end');
      startMusic('victory');
    } else {
      setPhase('summary');
    }
  };

  const handleAllocationChange = (key, value) => {
    const totalOthers = Object.entries(allocations).reduce((sum, [k, v]) => k !== key ? sum + v : sum, 0);
    let newVal = parseInt(value) || 0;
    if (totalOthers + newVal > gameState.budget) {
      newVal = gameState.budget - totalOthers;
    }
    setAllocations({ ...allocations, [key]: newVal });
  };

  const totalAllocated = allocations.massReach + allocations.targeted + allocations.distribution;
  const remainingBudget = gameState.budget - totalAllocated;

  // Chart Rendering Helpers
  const maxHistoryRevenue = Math.max(...gameState.history.map(h => h.revenue), 100000);
  const maxHistoryMS = Math.max(...gameState.history.map(h => h.marketShare), 10);

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* SPLASH SCREEN */}
      {phase === 'splash' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ color: '#88ff88', textShadow: '4px 4px 0px #aa00aa', fontSize: '64px', marginBottom: '20px', textAlign: 'center' }}>THE GROWTH ENGINE</h1>
          <p style={{ fontSize: '24px', color: 'var(--tertiary)', marginBottom: '50px' }}>A CMO Strategy Simulator</p>
          <button className="pixel-btn" onClick={() => { startMusic('bgm'); setPhase('intro'); beep(); }} style={{ fontSize: '32px', padding: '20px 40px', animation: 'pulse 1.5s infinite' }}>
            CLICK TO START GAME
          </button>
        </div>
      )}

      {/* MAIN LAYOUT HEADER / TOGGLE */}
      {phase !== 'splash' && (
        <>
          <div style={{ textAlign: 'right', marginBottom: '10px' }}>
            <button className="pixel-btn" style={{ fontSize: '12px', padding: '5px' }} onClick={toggleMusic}>
              {isAudioPlaying ? '🔈 MUTE MUSIC' : '🔊 PLAY MUSIC'}
            </button>
          </div>
          
          <header style={{ marginBottom: '40px', textAlign: 'center', backgroundColor: 'var(--bg-color)', padding: '10px', borderBottom: '4px solid var(--text-color)' }}>
            <h1 style={{ color: '#88ff88', textShadow: '2px 2px 0px #aa00aa' }}>The Growth Engine</h1>
            <p style={{ color: 'var(--text-color)' }}>A CMO Strategy Simulator</p>
          </header>
        </>
      )}

      {phase === 'intro' && (
        <div className="pixel-panel" style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <img src={cmoAvatar} alt="CMO Avatar" style={{ width: '150px', height: '150px', border: '4px solid var(--text-color)', imageRendering: 'pixelated' }} />
            <div>
              <h2 style={{ color: 'var(--primary)' }}>CEO Briefing</h2>
              <p style={{ marginBottom: '15px', lineHeight: '1.4' }}>
                "Welcome to the team, CMO. You are taking over marketing for <strong>{scenario.company} ({scenario.emoji})</strong>, our {scenario.type} company making {scenario.product}."
              </p>
              <p style={{ marginBottom: '15px', lineHeight: '1.4', color: '#ffb3ba' }}>
                {scenario.introContext}
              </p>
              <p style={{ marginBottom: '15px', color: 'var(--tertiary)', lineHeight: '1.4' }}>
                "We need you to execute using the <strong>G-STIC Framework</strong>:<br/>
                <span style={{color: 'var(--text-color)'}}>- <strong>Goal</strong>: Aggressive 5-year growth.</span><br/>
                <span style={{color: 'var(--text-color)'}}>- <strong>Strategy</strong>: Define target and value.</span><br/>
                <span style={{color: 'var(--text-color)'}}>- <strong>Tactics</strong>: The marketing mix (Product, Price, Place, Promotion).</span><br/>
                <span style={{color: 'var(--text-color)'}}>- <strong>Implementation</strong>: Execute the strategy.</span><br/>
                <span style={{color: 'var(--text-color)'}}>- <strong>Control</strong>: The KPIs. We track Market Share rigidly. Drop below 2% and you're fired.</span>"
              </p>
            </div>
          </div>
          <div style={{ borderTop: '2px dashed var(--text-color)', paddingTop: '20px' }}>
            <h3 style={{ color: '#88ff88', marginBottom: '10px' }}>The Rules of Growth</h3>
            <p style={{ marginBottom: '15px', fontSize: '18px', lineHeight: '1.4' }}>
              Your success depends entirely on reading the Market Events carefully and funding these two empirical metrics:
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '18px', lineHeight: '1.5', marginBottom: '20px' }}>
              <li style={{ marginBottom: '10px' }}><strong>Mental Availability:</strong> The brand coming to mind in buying situations. It requires massive, broad-reach advertising to build memory structures.</li>
              <li><strong>Physical Availability:</strong> How easy it is to physically or digitally buy the product. It requires aggressive distribution and sales pipeline spending.</li>
            </ul>
            <button className="pixel-btn" style={{ width: '100%', fontSize: '24px' }} onClick={() => { setPhase('event'); beep(); }}>Sign Contract &gt;</button>
          </div>
        </div>
      )}

      {phase === 'fired' && (
        <div className="pixel-panel" style={{ borderColor: 'var(--danger)' }}>
          <h2 style={{ color: 'var(--danger)' }}>YOU'RE FIRED!</h2>
          <p style={{ marginBottom: '20px' }}>Your market share dropped below 2%. The board lost confidence and terminated your contract in Year {gameState.year}.</p>
          <div style={{ padding: '20px', border: '2px dashed var(--danger)', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--tertiary)' }}>What went wrong?</h3>
            <p>You failed to read the market context. If you underfund mass reach and distribution when events demand it, the 25% annual decay destroys your company.</p>
            {gameState.feedback && <p style={{ marginTop: '10px', color: 'var(--danger)' }}>{gameState.feedback}</p>}
          </div>
          <button className="pixel-btn" onClick={restartGame}>Interview at a new company</button>
        </div>
      )}

      {phase === 'summary' && (
        <div className="pixel-panel">
          <h2 style={{ color: 'var(--accent)' }}>End of Year {gameState.year - 1} Report (Control Phase)</h2>
          
          {gameState.feedback && (
            <div style={{ 
              padding: '15px', 
              background: gameState.feedbackType === 'positive' ? '#030' : '#300', 
              border: `2px solid ${gameState.feedbackType === 'positive' ? 'var(--primary)' : 'var(--danger)'}`, 
              marginBottom: '20px',
              fontSize: '18px',
              lineHeight: '1.5'
            }}>
              {gameState.feedback}
            </div>
          )}

          <p>Financial results are in for the year:</p>
          <ul style={{ margin: '20px', lineHeight: '2' }}>
            <li>Market Share: <strong>{gameState.marketShare}%</strong> {lastBoardTarget && <span style={{color: '#ccc', fontSize: '16px'}}> (Target: {lastBoardTarget.marketShare}%)</span>}</li>
            <li>Revenue: <strong>{formatCurrency(gameState.revenue)}</strong> {lastBoardTarget && <span style={{color: '#ccc', fontSize: '16px'}}> (Target: {formatCurrency(lastBoardTarget.revenue)})</span>}</li>
            <li>Mental Availability: <strong>{gameState.mentalAvailability} / 100</strong> {lastBoardTarget && <span style={{color: '#ccc', fontSize: '16px'}}> (Target: {lastBoardTarget.mental})</span>}</li>
            <li>Physical Availability: <strong>{gameState.physicalAvailability} / 100</strong> {lastBoardTarget && <span style={{color: '#ccc', fontSize: '16px'}}> (Target: {lastBoardTarget.physical})</span>}</li>
          </ul>
          <p style={{ marginBottom: '20px', color: 'var(--tertiary)' }}>Notice the natural ±10% market volatility and the severe 25% annual decay. Overcome it!</p>
          <p style={{ marginBottom: '20px' }}>Your Marketing Budget for Year {gameState.year} is {formatCurrency(gameState.budget)}.</p>
          <button className="pixel-btn" onClick={() => { beep(); setPhase('event'); }}>Advance to Year {gameState.year} &gt;</button>
        </div>
      )}

      {phase === 'end' && (
        <div className="pixel-panel" style={{ borderColor: 'var(--accent)' }}>
          <h2 style={{ color: 'var(--primary)' }}>Final Board Review</h2>
          <p style={{ marginBottom: '20px' }}>You successfully completed 5 years as the {scenario.company} CMO. Let's look at the numbers.</p>
          
          <div style={{ padding: '20px', background: '#111', border: '2px solid var(--text-color)', marginBottom: '20px' }}>
            <p style={{ fontSize: '24px', marginBottom: '10px' }}>Final Market Share: <strong style={{ color: gameState.marketShare > 15 ? 'var(--accent)' : (gameState.marketShare < 5 ? 'var(--danger)' : 'var(--primary)') }}>{gameState.marketShare}%</strong></p>
            <p style={{ fontSize: '24px' }}>Final Revenue: <strong style={{ color: 'var(--primary)' }}>{formatCurrency(gameState.revenue)}</strong></p>
          </div>

          <div style={{ marginBottom: '30px', padding: '20px', border: '2px dashed var(--secondary)' }}>
            <h3 style={{ textTransform: 'uppercase', marginBottom: '15px' }}>5-Year Growth Trajectory</h3>
            <div style={{ display: 'flex', gap: '30px', justifyContent: 'space-around', alignItems: 'flex-end', height: '150px', borderBottom: '2px solid #555', paddingBottom: '10px' }}>
               {/* Simple CSS Bar Chart for REVENUE */}
               {gameState.history.map(h => (
                  <div key={h.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <div style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '5px' }}>{formatCurrency(h.revenue)}</div>
                     <div style={{ width: '40px', background: 'var(--primary)', height: `${(h.revenue / maxHistoryRevenue) * 100}px`, transition: 'height 1s ease' }}></div>
                     <strong style={{ marginTop: '10px' }}>Y{h.year}</strong>
                  </div>
               ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px', color: '#888' }}>Revenue Over Time</div>
          </div>
          
          <div style={{ padding: '20px', border: '2px dashed var(--secondary)', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--secondary)' }}>CMO Debriefing:</h3>
            <p style={{ fontSize: '18px' }}>
              {gameState.marketShare >= 15 
                ? "Incredible growth! You read the market context perfectly and spent accordingly. You beat the Law of Decay!"
                : "Growth was stagnant. You survived, but you didn't tailor your strategy significantly to the specific market events."}
            </p>
          </div>
          
          <button className="pixel-btn" onClick={restartGame}>Play Again</button>
        </div>
      )}

      {/* ALLOCATE and EVENT PHASES */}
      {(phase === 'event' || phase === 'allocate') && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
          <main>
            {phase === 'event' && (
              <div className="pixel-panel" style={{ animation: 'fadeIn 0.5s' }}>
                <h2 style={{ color: 'var(--secondary)' }}>Annual Market Event</h2>
                <h3 style={{ fontSize: '26px', color: 'var(--tertiary)' }}>{currentEvent?.title}</h3>
                <p style={{ marginBottom: '30px', marginTop: '10px', fontSize: '24px', lineHeight: '1.5' }}>{currentEvent?.description}</p>
                
                {boardTarget && (
                  <div style={{ background: '#1a1a1a', borderLeft: '4px solid var(--accent)', padding: '15px', marginBottom: '20px' }}>
                    <h4 style={{ color: 'var(--accent)', marginBottom: '10px', fontSize: '20px' }}>🎯 Year {gameState.year} CEO Targets:</h4>
                    <ul style={{ paddingLeft: '20px', fontSize: '18px', lineHeight: '1.8' }}>
                      <li>Market Share: <strong>{boardTarget.marketShare}%</strong></li>
                      <li>Revenue: <strong>{formatCurrency(boardTarget.revenue)}</strong></li>
                      <li>Mental Avail: <strong>{boardTarget.mental}/100</strong></li>
                      <li>Physical Avail: <strong>{boardTarget.physical}/100</strong></li>
                    </ul>
                  </div>
                )}

                <div style={{ textAlign: 'right' }}>
                  <button className="pixel-btn" onClick={() => { beep(); setPhase('allocate'); }}>Plan Tactics &amp; Budget &gt;</button>
                </div>
              </div>
            )}

            {phase === 'allocate' && (
              <div className="pixel-panel" style={{ animation: 'fadeIn 0.5s' }}>
                <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Tactic & Budget Allocation</h2>
                
                <div style={{ marginBottom: '20px' }}>
                    <button className="pixel-btn" style={{ fontSize: '14px', padding: '5px 10px', background: '#333' }} onClick={() => { beep(); setPhase('event'); }}>
                        &lt; Back to Event
                    </button>
                </div>

                <div style={{ background: '#222', padding: '10px', marginBottom: '20px', border: '2px solid var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>💰</span> 
                  Unallocated: <span style={{ color: remainingBudget < 0 ? 'var(--danger)' : 'var(--accent)', fontSize: '24px' }}>{formatCurrency(remainingBudget)}</span>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ borderBottom: '2px solid', paddingBottom: '5px', color: 'var(--tertiary)' }}>1. Invest in Availability</h3>
                  
                  <label style={{ display: 'block', marginTop: '15px', fontSize: '18px' }}>Mass Reach Advertising ($)</label>
                  <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>Builds massive Mental Availability across all category buyers.</p>
                  <input type="range" min="0" max={gameState.budget} step="10000" 
                    value={allocations.massReach} onChange={(e) => handleAllocationChange('massReach', e.target.value)} 
                    style={{ width: '100%', margin: '5px 0' }} />
                  <div style={{ fontSize: '16px', color: 'var(--accent)' }}>{formatCurrency(allocations.massReach)}</div>

                  <label style={{ display: 'block', marginTop: '15px', fontSize: '18px' }}>Targeted Loyalty Ads ($)</label>
                  <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>Focus on existing buyers. Far less effective at driving penetration.</p>
                  <input type="range" min="0" max={gameState.budget} step="10000" 
                    value={allocations.targeted} onChange={(e) => handleAllocationChange('targeted', e.target.value)} 
                    style={{ width: '100%', margin: '5px 0' }} />
                  <div style={{ fontSize: '16px', color: 'var(--accent)' }}>{formatCurrency(allocations.targeted)}</div>

                  <label style={{ display: 'block', marginTop: '15px', fontSize: '18px' }}>Distribution Expansion ($)</label>
                  <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '5px' }}>Increases Physical Availability (store placements, software APIs, etc).</p>
                  <input type="range" min="0" max={gameState.budget} step="10000" 
                    value={allocations.distribution} onChange={(e) => handleAllocationChange('distribution', e.target.value)} 
                    style={{ width: '100%', margin: '5px 0' }} />
                  <div style={{ fontSize: '16px', color: 'var(--accent)' }}>{formatCurrency(allocations.distribution)}</div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ borderBottom: '2px solid', paddingBottom: '5px', color: 'var(--tertiary)' }}>2. Strategic Posture</h3>
                  
                  <label style={{ display: 'block', marginTop: '15px', fontSize: '18px' }}>Targeting Philosophy</label>
                  <select value={targetingStrategy} onChange={(e) => setTargetingStrategy(e.target.value)}
                    style={{ width: '100%', padding: '10px', fontSize: '16px', background: 'var(--bg-color)', color: 'var(--text-color)', border: '2px solid var(--primary)', fontFamily: 'inherit', marginTop: '10px' }}>
                    <option value="mass">Broad Reach (Target the entire category)</option>
                    <option value="niche">Hyper-Niche (Target a tiny specific segment)</option>
                  </select>

                  <label style={{ display: 'block', marginTop: '15px', fontSize: '18px' }}>Distinctive Brand Assets (DBAs)</label>
                  <select value={brandAssetStrategy} onChange={(e) => setBrandAssetStrategy(e.target.value)}
                    style={{ width: '100%', padding: '10px', fontSize: '16px', background: 'var(--bg-color)', color: 'var(--text-color)', border: '2px solid var(--primary)', fontFamily: 'inherit', marginTop: '10px' }}>
                    <option value="maintain">Maintain Consistency (Build Memory)</option>
                    <option value="refresh">"Refresh" Logo & Colors (Destroy Memory)</option>
                  </select>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button className="pixel-btn" onClick={calculateNextYear}>Execute Strategy &gt;</button>
                </div>
              </div>
            )}
          </main>

          <aside>
            <div className="pixel-panel" style={{ fontSize: '20px', position: 'sticky', top: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', fontSize: '64px' }}>
                {scenario.emoji}
              </div>
              <h3 style={{ borderBottom: '2px solid var(--text-color)', paddingBottom: '10px', marginBottom: '15px', textAlign: 'center' }}>
                {scenario.company.toUpperCase()} DATA
              </h3>
              <p>Year: <strong style={{color: 'var(--primary)'}}>{gameState.year} / 5</strong></p>
              <p>Budget: <strong>{formatCurrency(gameState.budget)}</strong></p>
              <div style={{ height: '20px' }}></div>
              <p>Market Share: <strong>{gameState.marketShare}%</strong></p>
              <p>Revenue: <strong style={{ color: 'var(--accent)' }}>{formatCurrency(gameState.revenue)}</strong></p>
              <div style={{ marginTop: '15px', color: 'var(--tertiary)', borderTop: '2px dashed #444', paddingTop: '15px' }}>
                <p>Mental Avail: {gameState.mentalAvailability}/100</p>
                <div style={{ width: '100%', height: '10px', background: '#333', marginTop: '5px', marginBottom: '15px' }}>
                  <div style={{ width: `${gameState.mentalAvailability}%`, height: '100%', background: 'var(--secondary)' }}></div>
                </div>
                
                <p>Physical Avail: {gameState.physicalAvailability}/100</p>
                <div style={{ width: '100%', height: '10px', background: '#333', marginTop: '5px' }}>
                  <div style={{ width: `${gameState.physicalAvailability}%`, height: '100%', background: 'var(--secondary)' }}></div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

    </div>
  );
}

export default App;
