
import { Destination } from '@/context/TravelContext';

// Extended destination type with tour details
export interface DestinationWithTourDetails extends Destination {
  duration: string;
  accommodation: string;
  tourHighlights: string[];
  inclusions: string[];
  itinerary: { day: number; title: string; description: string }[];
}

export const destinations: DestinationWithTourDetails[] = [
  {
    id: "9",
    name: "Taj Mahal, Agra",
    location: "Agra, Uttar Pradesh, India",
    description: "Experience the majestic Taj Mahal, one of the seven wonders of the world and a symbol of eternal love. This immersive tour includes visits to Agra Fort and Fatehpur Sikri.",
    imageUrl: "https://images.unsplash.com/photo-1506462945848-ac8ea6f609cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/49HTIoCccDY?si=Iu7ygJ7LT13m5Yve",
    price: 24999,
    rating: 4.8,
    duration: "3 Days / 2 Nights",
    accommodation: "4-Star Hotel (The Oberoi Amarvilas or similar)",
    tourHighlights: [
      "Sunrise view of the Taj Mahal",
      "Guided tour of Agra Fort",
      "Visit to Fatehpur Sikri",
      "Traditional Mughlai cuisine experience"
    ],
    inclusions: [
      "Accommodation with breakfast",
      "Private AC vehicle",
      "Professional English-speaking guide",
      "Monument entrance fees",
      "Welcome dinner with cultural performance"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Agra",
        description: "Arrive in Agra and check into your hotel. Evening visit to Mehtab Bagh for a sunset view of the Taj Mahal from across the Yamuna River. Welcome dinner with traditional music."
      },
      {
        day: 2,
        title: "Taj Mahal & Agra Fort",
        description: "Early morning visit to the Taj Mahal at sunrise. After breakfast, explore the magnificent Agra Fort. Afternoon shopping for marble crafts and leather goods in local markets."
      },
      {
        day: 3,
        title: "Fatehpur Sikri & Departure",
        description: "Visit the abandoned city of Fatehpur Sikri. After lunch, depart from Agra with beautiful memories."
      }
    ]
  },
  {
    id: "24",
    name: "Varanasi, The Spiritual City",
    location: "Varanasi, Uttar Pradesh, India",
    description: "Immerse yourself in the spiritual heart of India with a journey along the sacred Ganges River, ancient temples, and the mystical evening Ganga Aarti ceremony in Varanasi.",
    imageUrl: "https://images.unsplash.com/photo-1561361058-c13c6e5ac451?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmFyYW5hc2l8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/Yon4Gv0708k?si=zTCFZOiGvwHbDHmG",
    price: 21999,
    rating: 4.7,
    duration: "4 Days / 3 Nights",
    accommodation: "Heritage Riverside Hotel (BrijRama Palace or similar)",
    tourHighlights: [
      "Sunrise boat ride on the Ganges",
      "Evening Ganga Aarti ceremony",
      "Sarnath Buddhist site",
      "Walking tour of ancient ghats and temples"
    ],
    inclusions: [
      "Accommodation with breakfast",
      "Private boat rides",
      "Guided walking tours",
      "Temple and monument entrance fees",
      "Cultural experiences"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Varanasi",
        description: "Arrive in Varanasi and transfer to your hotel. Evening walk to witness the spectacular Ganga Aarti ceremony at Dashashwamedh Ghat with thousands of floating lamps."
      },
      {
        day: 2,
        title: "Ganges & Temples",
        description: "Early morning boat ride on the Ganges to witness the sunrise and morning rituals. After breakfast, guided tour of important temples including Kashi Vishwanath, followed by a heritage walk."
      },
      {
        day: 3,
        title: "Sarnath Excursion",
        description: "Visit Sarnath, where Buddha gave his first sermon. Explore the archaeological museum and Dhamek Stupa. Evening free for shopping for famous Banarasi silk."
      },
      {
        day: 4,
        title: "Spiritual Experience & Departure",
        description: "Morning yoga and meditation session by the Ganges. Time for personal exploration before departure, taking with you the spiritual essence of this ancient city."
      }
    ]
  },
  {
    id: "25",
    name: "Jaipur, The Pink City",
    location: "Jaipur, Rajasthan, India",
    description: "Explore the majestic forts and palaces of the Pink City, with its rich cultural heritage, vibrant bazaars, and royal Rajasthani experiences.",
    imageUrl: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/vn_JW_ZQT1w?si=Zngu_08mG0vylSrt",
    price: 27999,
    rating: 4.8,
    duration: "4 Days / 3 Nights",
    accommodation: "Heritage Haveli (Samode Haveli or similar)",
    tourHighlights: [
      "Amber Fort elephant ride",
      "City Palace and Hawa Mahal tour",
      "Traditional Rajasthani dinner with folk dance",
      "Bazaar shopping experience"
    ],
    inclusions: [
      "Accommodation with breakfast",
      "Private AC vehicle",
      "Professional guide",
      "Monument entrance fees",
      "Elephant ride at Amber Fort",
      "Cultural dinner"
    ],
    itinerary: [
      {
        day: 1,
        title: "Welcome to Jaipur",
        description: "Arrive in Jaipur and check into your heritage hotel. Visit Albert Hall Museum and explore the local markets. Evening dinner with traditional Rajasthani folk music and dance."
      },
      {
        day: 2,
        title: "Amber Fort & City Monuments",
        description: "Morning visit to the majestic Amber Fort with an elephant ride to the entrance. After lunch, explore City Palace, Jantar Mantar observatory, and photograph the iconic Hawa Mahal (Palace of Winds)."
      },
      {
        day: 3,
        title: "Jaipur Exploration",
        description: "Visit Jal Mahal (Water Palace) and the ancient step-well Panna Meena Ka Kund. Afternoon dedicated to craft workshops including block printing and blue pottery. Shopping in the colorful bazaars of Jaipur."
      },
      {
        day: 4,
        title: "Royal Experience & Departure",
        description: "Morning visit to Nahargarh Fort for panoramic views of the Pink City. Special high tea experience at a royal venue before departure."
      }
    ]
  },
  {
    id: "26",
    name: "Kerala Backwaters",
    location: "Alleppey & Kumarakom, Kerala, India",
    description: "Cruise through the serene backwaters of Kerala on a traditional houseboat, experiencing the lush landscapes, village life, and cultural richness of God's Own Country.",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/J8Tik6Gd01c?si=8nqIoPeHafrNu3ZG",
    price: 32999,
    rating: 4.9,
    duration: "5 Days / 4 Nights",
    accommodation: "Premium Houseboat & Lakeside Resort",
    tourHighlights: [
      "Overnight houseboat cruise",
      "Kathakali dance performance",
      "Spice plantation tour",
      "Ayurvedic massage experience",
      "Kerala cuisine cooking demonstration"
    ],
    inclusions: [
      "Houseboat stay with all meals",
      "Resort accommodation with breakfast",
      "Private transfers",
      "Cultural shows and experiences",
      "Guided village and nature walks"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kochi",
        description: "Arrive in Kochi and transfer to your hotel. Evening witness the spectacular Kathakali dance performance, a classical dance form of Kerala. Dinner at a local seafood restaurant."
      },
      {
        day: 2,
        title: "Kochi & Transfer to Alleppey",
        description: "Morning tour of Fort Kochi including the Chinese Fishing Nets, Jewish Synagogue, and Dutch Palace. After lunch, drive to Alleppey, known as the 'Venice of the East'. Board your private houseboat for an overnight backwater cruise."
      },
      {
        day: 3,
        title: "Backwater Cruise & Kumarakom",
        description: "Enjoy a morning cruise through the narrow canals, observing rural Kerala life. Disembark and transfer to a luxury lakeside resort in Kumarakom. Afternoon Ayurvedic massage session."
      },
      {
        day: 4,
        title: "Kumarakom Bird Sanctuary & Village Life",
        description: "Early morning visit to Kumarakom Bird Sanctuary. Later, experience village life with activities like toddy tapping, coir making, and fishing. Evening cooking demonstration of traditional Kerala dishes."
      },
      {
        day: 5,
        title: "Spice Plantation & Departure",
        description: "Morning visit to a spice plantation to learn about various spices grown in Kerala. Transfer to Kochi airport for departure."
      }
    ]
  },
  {
    id: "27",
    name: "Goa Beach Retreat",
    location: "North & South Goa, India",
    description: "Enjoy the perfect beach holiday in Goa with its golden beaches, Portuguese heritage, vibrant nightlife, and relaxed atmosphere.",
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/rjwxpZgswrk?si=g23_dwLY5Z8M9JwM",
    price: 28999,
    rating: 4.7,
    duration: "6 Days / 5 Nights",
    accommodation: "Beach Resort (The Leela or similar)",
    tourHighlights: [
      "Beach hopping tour",
      "Old Goa churches visit",
      "Spice plantation with lunch",
      "Sunset cruise on the Mandovi River",
      "Water sports activities"
    ],
    inclusions: [
      "Accommodation with breakfast",
      "Welcome drink on arrival",
      "Private AC vehicle for sightseeing",
      "River cruise tickets",
      "2 complimentary dinners",
      "Airport transfers"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Goa",
        description: "Arrive at Goa airport and transfer to your beach resort. Day free to relax at the beach or by the pool. Welcome dinner at the resort."
      },
      {
        day: 2,
        title: "North Goa Beaches",
        description: "After breakfast, visit the popular beaches of North Goa including Baga, Calangute, and Anjuna. Evening visit to the Wednesday Flea Market (if available) or Anjuna market."
      },
      {
        day: 3,
        title: "Cultural Goa",
        description: "Full day tour of Old Goa churches, Dona Paula viewpoint, and Miramar beach. Visit Panjim city and enjoy a sunset cruise on the Mandovi River with cultural performances."
      },
      {
        day: 4,
        title: "South Goa Exploration",
        description: "Day trip to the serene beaches of South Goa including Colva, Benaulim, and Palolem. Visit to the Ancestral Goa museum. Evening free for relaxation."
      },
      {
        day: 5,
        title: "Adventure & Nature",
        description: "Morning visit to a spice plantation with Goan lunch. Afternoon for water sports activities (parasailing, jet ski, banana boat ride) or nature walks. Farewell dinner at a beach shack."
      },
      {
        day: 6,
        title: "Leisure & Departure",
        description: "Morning at leisure for last-minute shopping or beach time. Check-out and transfer to Goa airport for departure."
      }
    ]
  },
  {
    id: "28",
    name: "Darjeeling & Gangtok",
    location: "West Bengal & Sikkim, India",
    description: "Experience the breathtaking beauty of the Eastern Himalayas, tea plantations, Buddhist monasteries, and the world's third-highest peak Kanchenjunga.",
    imageUrl: "https://images.unsplash.com/photo-1544634076-ba7c172f3640?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/DbiB3Xzs-Lw?si=IH32clXJj6Z9mlgT",
    price: 31999,
    rating: 4.8,
    duration: "7 Days / 6 Nights",
    accommodation: "Heritage Hotels & Mountain Resorts",
    tourHighlights: [
      "Darjeeling Himalayan Railway (Toy Train)",
      "Tiger Hill sunrise view",
      "Tea garden tour and tasting",
      "Nathula Pass (Indo-China border)",
      "Tsomgo Lake visit"
    ],
    inclusions: [
      "Accommodation with breakfast and dinner",
      "Toy Train ride",
      "All transfers and sightseeing",
      "Inner Line Permits for restricted areas",
      "Expert local guides",
      "Welcome drink on arrival"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bagdogra & Drive to Darjeeling",
        description: "Arrive at Bagdogra airport and drive to Darjeeling (approx. 3 hours). Evening walk around the Mall Road and Chowrasta."
      },
      {
        day: 2,
        title: "Darjeeling Sightseeing",
        description: "Early morning visit to Tiger Hill to witness the sunrise over Kanchenjunga. Visit Ghoom Monastery, Batasia Loop, and the Himalayan Mountaineering Institute. Afternoon joy ride on the famous Darjeeling Toy Train."
      },
      {
        day: 3,
        title: "Tea Estates & Local Life",
        description: "Visit to Happy Valley Tea Estate for a tour and tasting session. Explore the Tibetan Refugee Self-Help Center. Evening cultural show at Darjeeling."
      },
      {
        day: 4,
        title: "Darjeeling to Gangtok",
        description: "Drive from Darjeeling to Gangtok (approx. 4 hours). En route, visit Rumtek Monastery. Evening exploration of MG Marg, the main street of Gangtok."
      },
      {
        day: 5,
        title: "North Sikkim",
        description: "Full day excursion to Tsomgo Lake and Baba Mandir. Enjoy the pristine beauty of the alpine lake at 12,400 feet. Return to Gangtok by evening."
      },
      {
        day: 6,
        title: "Gangtok Local Sightseeing",
        description: "Visit to Do Drul Chorten, Enchey Monastery, Namgyal Institute of Tibetology, and Flower Exhibition Center. Afternoon cable car ride for panoramic views of Gangtok."
      },
      {
        day: 7,
        title: "Departure",
        description: "After breakfast, drive to Bagdogra airport (approx. 4 hours) for your onward journey."
      }
    ]
  },
  {
    id: "29",
    name: "Ladakh Adventure",
    location: "Jammu & Kashmir, India",
    description: "Embark on an unforgettable journey to the land of high passes, pristine lakes, ancient monasteries, and breathtaking landscapes.",
    imageUrl: "https://images.unsplash.com/photo-1598343679739-53c1e4b9b2cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/JTsBRNEy-1I?si=dPLlF6T_NYGiO3mP",
    price: 45999,
    rating: 4.9,
    duration: "8 Days / 7 Nights",
    accommodation: "Boutique Hotels & Luxury Camps",
    tourHighlights: [
      "Pangong Lake stay",
      "Nubra Valley with sand dunes",
      "Khardung La Pass (world's highest motorable road)",
      "Thiksey Monastery morning prayer ritual",
      "Rafting in Zanskar River"
    ],
    inclusions: [
      "Accommodation with all meals",
      "Oxygen cylinders for altitude sickness",
      "All transfers and sightseeing",
      "Inner Line Permits",
      "Expert guides",
      "Welcome dinner in Leh"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Leh & Acclimatization",
        description: "Arrive at Leh airport and transfer to your hotel. Rest day for acclimatization to the high altitude. Short evening walk around Leh Market."
      },
      {
        day: 2,
        title: "Leh Local Sightseeing",
        description: "Visit Shanti Stupa, Leh Palace, and Namgyal Tsemo Gompa. Explore the old town of Leh and its bazaars. Evening visit to Shey Palace and Thiksey Monastery."
      },
      {
        day: 3,
        title: "Leh to Nubra Valley",
        description: "Drive to Nubra Valley via Khardung La Pass (18,380 ft). Visit Diskit Monastery and enjoy a camel safari on the sand dunes at Hunder. Overnight in Nubra."
      },
      {
        day: 4,
        title: "Nubra Valley to Pangong Lake",
        description: "Drive to Pangong Lake via Shyok River route. Enjoy the spectacular views of the lake famous for changing colors. Overnight stay in camps by the lakeside."
      },
      {
        day: 5,
        title: "Pangong Lake to Leh",
        description: "Early morning by the lake for photography. Return to Leh via Chang La Pass. Evening at leisure for shopping in Leh market."
      },
      {
        day: 6,
        title: "Leh to Lamayuru",
        description: "Day excursion to Lamayuru, visiting Alchi Monastery en route. Visit the moon landscape and Lamayuru Monastery, one of the oldest in Ladakh. Return to Leh by evening."
      },
      {
        day: 7,
        title: "Rafting & Local Experiences",
        description: "Morning rafting session in Zanskar River (seasonal). Afternoon visit to SECMOL, the innovative school founded by Sonam Wangchuk. Evening cultural performance with dinner."
      },
      {
        day: 8,
        title: "Departure",
        description: "Transfer to Leh airport for your departure flight, taking with you memories of the breathtaking landscapes and cultural experiences of Ladakh."
      }
    ]
  },
  {
    id: "30",
    name: "Rann of Kutch",
    location: "Gujarat, India",
    description: "Experience the surreal white salt desert of Kutch, vibrant tribal cultures, intricate handicrafts, and the famous Rann Utsav festival.",
    imageUrl: "https://images.unsplash.com/photo-1582899074157-25d6316bb235?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/-XMF0qFRb9Q?si=LGw7XjZuZtCEO8hJ",
    price: 26999,
    rating: 4.7,
    duration: "5 Days / 4 Nights",
    accommodation: "Luxury Tent City & Heritage Hotel",
    tourHighlights: [
      "White Rann sunset experience",
      "Full moon night at the White Desert",
      "Kutchi tribal village visit",
      "Handicraft workshops",
      "Kala Dungar (Black Hill) visit"
    ],
    inclusions: [
      "Accommodation with breakfast and dinner",
      "Luxury tent stay at Rann Utsav (seasonal)",
      "All transfers and sightseeing",
      "Cultural programs",
      "Local guide",
      "Permits for restricted areas"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bhuj",
        description: "Arrive at Bhuj airport and transfer to your hotel. Visit Bhuj highlights including Aina Mahal, Prag Mahal, and local markets. Evening cultural program."
      },
      {
        day: 2,
        title: "Bhuj to White Rann",
        description: "Drive to Dhordo, the gateway to White Rann. Check-in at the tent city (during Rann Utsav) or nearby resort. Evening visit to White Rann to witness the magical sunset over the salt desert. Cultural performances and dinner."
      },
      {
        day: 3,
        title: "White Rann & Handicraft Villages",
        description: "Morning free at White Rann. Later visit to Kala Dungar, the highest point in Kutch with panoramic views. Afternoon tour of nearby villages famous for handicrafts - Bhirandiyara (embroidery), Khavda (pottery), and Nirona (Rogan art)."
      },
      {
        day: 4,
        title: "Local Culture & Mandvi",
        description: "Visit to Hodko and Dhaneti villages to experience the vibrant tribal culture. Drive to Mandvi and visit the shipbuilding yard and the private beach palace of Mandvi rulers. Return to Bhuj by evening."
      },
      {
        day: 5,
        title: "Shopping & Departure",
        description: "Morning visit to Bhujodi weaver's village. Time for souvenir shopping in Bhuj. Transfer to Bhuj airport for departure."
      }
    ]
  }
];
