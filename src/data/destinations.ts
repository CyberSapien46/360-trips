
import { Destination } from "@/context/TravelContext";

export interface DestinationWithTourDetails extends Destination {
  description: string;
  duration: string;
  price: number;
  rating: number;
  videoUrl: string;
  imageUrl: string;
  panoramaUrl?: string; // Added for 360° images
  accommodation?: string;
  inclusions?: string[];
  itinerary?: {
    day: number;
    title: string;
    description: string;
  }[];
}

export const destinations: DestinationWithTourDetails[] = [
  // North India - Uttar Pradesh
  {
    id: 'd1',
    name: 'Taj Mahal',
    location: 'Agra, Uttar Pradesh, India',
    description: 'An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife.',
    duration: '1 Day',
    price: 5000,
    rating: 4.8,
    videoUrl: 'https://www.youtube.com/embed/KNhrE6GId4Y',
    imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200',
    accommodation: 'Luxury hotels available nearby',
    inclusions: ['Entry tickets', 'Guided tour', 'Lunch'],
    itinerary: [
      { day: 1, title: 'Visit Taj Mahal', description: 'Explore the iconic Taj Mahal and learn about its history.' }
    ]
  },
  {
    id: 'd11',
    name: 'Varanasi Ghats',
    location: 'Varanasi, Uttar Pradesh, India',
    description: 'Varanasi is a city on the banks of the Ganges in Uttar Pradesh, India. The city is famous for its ghats and ancient temples.',
    duration: '2 Days',
    price: 4000,
    rating: 4.4,
    videoUrl: 'https://www.youtube.com/embed/Pp-JlbGHIKM',
    imageUrl: 'https://images.unsplash.com/photo-1599420425731-e5593a454048?q=80&w=1200',
    accommodation: 'Guesthouse stay',
    inclusions: ['Accommodation', 'Ganga Aarti', 'Boat ride'],
    itinerary: [
      { day: 1, title: 'Ganga Aarti', description: 'Witness the Ganga Aarti ceremony.' },
      { day: 2, title: 'Boat Ride', description: 'Enjoy a boat ride on the Ganges.' }
    ]
  },
  
  // South India - Kerala
  {
    id: 'd2',
    name: 'Kerala Backwaters',
    location: 'Alleppey, Kerala, India',
    description: 'The Kerala backwaters are a network of brackish lagoons and lakes lying parallel to the Arabian Sea coast of Kerala state in southern India.',
    duration: '2 Days',
    price: 7500,
    rating: 4.6,
    videoUrl: 'https://www.youtube.com/embed/JUJqWAbCjKk',
    imageUrl: 'https://images.unsplash.com/photo-1572914839059-2f35565e35ae?q=80&w=1200',
    accommodation: 'Houseboat stay',
    inclusions: ['Houseboat stay', 'Meals', 'Village visit'],
    itinerary: [
      { day: 1, title: 'Houseboat Cruise', description: 'Enjoy a relaxing houseboat cruise through the backwaters.' },
      { day: 2, title: 'Village Visit', description: 'Visit local villages and experience the culture.' }
    ]
  },
  {
    id: 'd12',
    name: 'Munnar Tea Gardens',
    location: 'Munnar, Kerala, India',
    description: 'Munnar is a town and hill station in the Western Ghats mountain range, known for its tea plantations and stunning landscapes.',
    duration: '3 Days',
    price: 6500,
    rating: 4.7,
    videoUrl: 'https://www.youtube.com/embed/sFr5F2pF2R0',
    imageUrl: 'https://images.unsplash.com/photo-1548689813-1eb31a2e6116?q=80&w=1200',
    accommodation: 'Mountain resort',
    inclusions: ['Accommodation', 'Tea plantation tour', 'Wildlife safari'],
    itinerary: [
      { day: 1, title: 'Tea Plantation Tour', description: 'Visit the lush tea gardens and learn about tea processing.' },
      { day: 2, title: 'Eravikulam National Park', description: 'Explore the national park and spot endangered Nilgiri Tahr.' },
      { day: 3, title: 'Mattupetty Dam', description: 'Visit the scenic dam and enjoy boating.' }
    ]
  },
  
  // West India - Goa
  {
    id: 'd3',
    name: 'Goa Beaches',
    location: 'North Goa, Goa, India',
    description: 'Goa, a tiny emerald land, is washed by the Arabian Sea on its west coast. Goa is known for its stunning beaches, excellent cuisine and Portuguese heritage.',
    duration: '3 Days',
    price: 6000,
    rating: 4.7,
    videoUrl: 'https://www.youtube.com/embed/rdc36JCPs9Y',
    imageUrl: 'https://images.unsplash.com/photo-1517191434788-255216a92493?q=80&w=1200',
    accommodation: 'Beach resort stay',
    inclusions: ['Accommodation', 'Water sports', 'Sightseeing'],
    itinerary: [
      { day: 1, title: 'Beach Relaxation', description: 'Relax on the beaches of Goa.' },
      { day: 2, title: 'Water Sports', description: 'Enjoy water sports activities.' },
      { day: 3, title: 'Sightseeing', description: 'Visit local attractions.' }
    ]
  },
  {
    id: 'd13',
    name: 'Old Goa Churches',
    location: 'Old Goa, Goa, India',
    description: 'Old Goa is known for its magnificent Portuguese colonial architecture and historic churches, recognized as a UNESCO World Heritage Site.',
    duration: '1 Day',
    price: 3500,
    rating: 4.5,
    videoUrl: 'https://www.youtube.com/embed/K1RdjraGjKQ',
    imageUrl: 'https://images.unsplash.com/photo-1583505093722-63ab271570d7?q=80&w=1200',
    accommodation: 'Heritage hotel stay',
    inclusions: ['Guided heritage tour', 'Lunch at local restaurant', 'Transportation'],
    itinerary: [
      { day: 1, title: 'Old Goa Heritage Tour', description: 'Visit Basilica of Bom Jesus, Se Cathedral, and other historic churches.' }
    ]
  },
  
  // West India - Rajasthan
  {
    id: 'd4',
    name: 'Jaisalmer Desert Safari',
    location: 'Jaisalmer, Rajasthan, India',
    description: 'Jaisalmer "the Golden city", is a town in the Indian state of Rajasthan, located 575 kilometres west of the state capital, Jaipur.',
    duration: '4 Days',
    price: 8000,
    rating: 4.5,
    videoUrl: 'https://www.youtube.com/embed/DQ9FIm-mq-Y',
    imageUrl: 'https://images.unsplash.com/photo-1628515957778-52f981199c04?q=80&w=1200',
    accommodation: 'Desert camp stay',
    inclusions: ['Accommodation', 'Camel safari', 'Cultural show'],
    itinerary: [
      { day: 1, title: 'Arrival in Jaisalmer', description: 'Arrive in Jaisalmer and check into your accommodation.' },
      { day: 2, title: 'Camel Safari', description: 'Enjoy a camel safari in the desert.' },
      { day: 3, title: 'Cultural Show', description: 'Experience a cultural show in the desert.' },
      { day: 4, title: 'Departure', description: 'Depart from Jaisalmer.' }
    ]
  },
  {
    id: 'd14',
    name: 'Udaipur City Palace',
    location: 'Udaipur, Rajasthan, India',
    description: 'Udaipur, known as the "City of Lakes", features the magnificent City Palace complex overlooking Lake Pichola, displaying the rich cultural heritage of Rajasthan.',
    duration: '3 Days',
    price: 7500,
    rating: 4.8,
    videoUrl: 'https://www.youtube.com/embed/Wh-OLz2O_Ew',
    imageUrl: 'https://images.unsplash.com/photo-1576487236230-eaa4afe68618?q=80&w=1200',
    accommodation: 'Heritage hotel',
    inclusions: ['Accommodation', 'Palace tour', 'Lake cruise', 'Cultural performance'],
    itinerary: [
      { day: 1, title: 'City Palace Tour', description: 'Explore the impressive City Palace complex and museum.' },
      { day: 2, title: 'Lake Pichola Cruise', description: 'Enjoy a sunset cruise on Lake Pichola and visit Jag Mandir.' },
      { day: 3, title: 'Cultural Heritage', description: 'Visit Bagore Ki Haveli and enjoy a traditional Rajasthani dance performance.' }
    ]
  },
  
  // North India - Ladakh
  {
    id: 'd5',
    name: 'Ladakh Monasteries',
    location: 'Leh, Ladakh, India',
    description: 'Ladakh, "the land of high passes", is a region administered by India as a union territory and constituting a part of the larger Kashmir region.',
    duration: '5 Days',
    price: 10000,
    rating: 4.9,
    videoUrl: 'https://www.youtube.com/embed/JjTj7VbEj30',
    imageUrl: 'https://images.unsplash.com/photo-1615934669857-9e799b355923?q=80&w=1200',
    accommodation: 'Monastery stay',
    inclusions: ['Accommodation', 'Sightseeing', 'Meals'],
    itinerary: [
      { day: 1, title: 'Arrival in Leh', description: 'Arrive in Leh and check into your accommodation.' },
      { day: 2, title: 'Sightseeing', description: 'Visit local monasteries.' },
      { day: 3, title: 'Pangong Lake', description: 'Visit Pangong Lake.' },
      { day: 4, title: 'Nubra Valley', description: 'Visit Nubra Valley.' },
      { day: 5, title: 'Departure', description: 'Depart from Leh.' }
    ]
  },
  {
    id: 'd15',
    name: 'Magnetic Hill & Confluence',
    location: 'Leh, Ladakh, India',
    description: 'Experience the natural wonder of Magnetic Hill and the sacred confluence of the Indus and Zanskar rivers, offering stunning landscapes and unique geological phenomena.',
    duration: '2 Days',
    price: 6500,
    rating: 4.6,
    videoUrl: 'https://www.youtube.com/embed/KZOZUJaSK4o',
    imageUrl: 'https://images.unsplash.com/photo-1545211900-59365f7638b2?q=80&w=1200',
    accommodation: 'Boutique homestay',
    inclusions: ['Accommodation', 'Transport', 'Local guide', 'Meals'],
    itinerary: [
      { day: 1, title: 'Magnetic Hill', description: 'Experience the optical illusion at Magnetic Hill and visit Gurudwara Pathar Sahib.' },
      { day: 2, title: 'River Confluence', description: 'Visit the spectacular confluence of Indus and Zanskar rivers and enjoy photography.' }
    ]
  },
  
  // East India - West Bengal
  {
    id: 'd7',
    name: 'Darjeeling Tea Gardens',
    location: 'Darjeeling, West Bengal, India',
    description: 'Darjeeling is a town and a municipality in the Indian state of West Bengal, located in the Lesser Himalayas. It is known for its tea industry, its views of Kangchenjunga.',
    duration: '3 Days',
    price: 5500,
    rating: 4.6,
    videoUrl: 'https://www.youtube.com/embed/QtbvJ-44GuI',
    imageUrl: 'https://images.unsplash.com/photo-1600887936033-a5264c4ca892?q=80&w=1200',
    accommodation: 'Tea estate stay',
    inclusions: ['Accommodation', 'Tea tasting', 'Sightseeing'],
    itinerary: [
      { day: 1, title: 'Tea Tasting', description: 'Taste different types of tea.' },
      { day: 2, title: 'Sightseeing', description: 'Visit local attractions.' },
      { day: 3, title: 'Toy Train Ride', description: 'Enjoy a ride on the Darjeeling Himalayan Railway.' }
    ]
  },
  {
    id: 'd16',
    name: 'Sundarbans National Park',
    location: 'Sundarbans, West Bengal, India',
    description: 'The Sundarbans is a mangrove area in the delta formed by the confluence of the Ganges, Brahmaputra and Meghna Rivers in the Bay of Bengal, home to the Royal Bengal Tiger.',
    duration: '3 Days',
    price: 7500,
    rating: 4.7,
    videoUrl: 'https://www.youtube.com/embed/6OV9o7H-OcE',
    imageUrl: 'https://images.unsplash.com/photo-1590256518526-7c15df05d1e6?q=80&w=1200',
    accommodation: 'Eco resort',
    inclusions: ['Accommodation', 'Boat safari', 'Guided tours', 'Meals'],
    itinerary: [
      { day: 1, title: 'Arrival & Orientation', description: 'Arrive at Sundarbans and learn about the unique ecosystem.' },
      { day: 2, title: 'Boat Safari', description: 'Explore the mangrove forests and wildlife on a boat safari.' },
      { day: 3, title: 'Bird Watching', description: 'Early morning bird watching tour and departure.' }
    ]
  },
  
  // South India - Tamil Nadu
  {
    id: 'd17',
    name: 'Meenakshi Temple',
    location: 'Madurai, Tamil Nadu, India',
    description: 'The Meenakshi Amman Temple is a historic Hindu temple dedicated to Goddess Meenakshi, with stunning Dravidian architecture and elaborate carvings.',
    duration: '2 Days',
    price: 4500,
    rating: 4.8,
    videoUrl: 'https://www.youtube.com/embed/JuKD6kL_oqQ',
    imageUrl: 'https://images.unsplash.com/photo-1595829060086-b7c2207e143d?q=80&w=1200',
    accommodation: 'Heritage hotel',
    inclusions: ['Accommodation', 'Temple tour', 'Cultural show', 'Local cuisine'],
    itinerary: [
      { day: 1, title: 'Temple Tour', description: 'Explore the magnificent Meenakshi Temple complex and museum.' },
      { day: 2, title: 'Cultural Experience', description: 'Visit Thirumalai Nayakkar Palace and enjoy a traditional dance performance.' }
    ]
  },
  {
    id: 'd18',
    name: 'Pondicherry French Quarter',
    location: 'Pondicherry, Tamil Nadu, India',
    description: 'Pondicherry (now Puducherry) features a unique blend of French colonial architecture and Indian culture, with charming streets, cafes, and the spiritual community of Auroville.',
    duration: '3 Days',
    price: 5500,
    rating: 4.6,
    videoUrl: 'https://www.youtube.com/embed/QHjisPFqaok',
    imageUrl: 'https://images.unsplash.com/photo-1616591011673-3656ba4cbba2?q=80&w=1200',
    accommodation: 'Colonial boutique hotel',
    inclusions: ['Accommodation', 'Guided walking tour', 'Bicycle rental', 'Breakfast'],
    itinerary: [
      { day: 1, title: 'French Quarter Walk', description: 'Explore the charming streets of the French Quarter and enjoy French cuisine.' },
      { day: 2, title: 'Auroville Visit', description: 'Visit the international community of Auroville and the Matrimandir.' },
      { day: 3, title: 'Beach & Ashram', description: 'Relax at Promenade Beach and visit Sri Aurobindo Ashram.' }
    ]
  },
  
  // Island Territory - Andaman
  {
    id: 'd8',
    name: 'Andaman Islands',
    location: 'Port Blair, Andaman and Nicobar Islands, India',
    description: 'The Andaman and Nicobar Islands, one of the seven union territories of India, are a group of islands at the juncture of the Bay of Bengal and the Andaman Sea.',
    duration: '4 Days',
    price: 9000,
    rating: 4.7,
    videoUrl: 'https://www.youtube.com/embed/m6cpD0lH-TE',
    imageUrl: 'https://images.unsplash.com/photo-1562645133-559b5986805a?q=80&w=1200',
    accommodation: 'Beach resort stay',
    inclusions: ['Accommodation', 'Water sports', 'Sightseeing'],
    itinerary: [
      { day: 1, title: 'Beach Relaxation', description: 'Relax on the beaches of Andaman.' },
      { day: 2, title: 'Water Sports', description: 'Enjoy water sports activities.' },
      { day: 3, title: 'Sightseeing', description: 'Visit local attractions.' },
      { day: 4, title: 'Departure', description: 'Depart from Andaman.' }
    ]
  },
  {
    id: 'd19',
    name: 'Cellular Jail & Radhanagar Beach',
    location: 'Port Blair & Havelock, Andaman, India',
    description: 'Explore the historic Cellular Jail in Port Blair and experience the beauty of Radhanagar Beach, rated as one of the best beaches in Asia.',
    duration: '5 Days',
    price: 11000,
    rating: 4.9,
    videoUrl: 'https://www.youtube.com/embed/ZL4r4OVVYO8',
    imageUrl: 'https://images.unsplash.com/photo-1587466280419-5cc43b9f1ff4?q=80&w=1200',
    accommodation: 'Mix of city hotel and beach resort',
    inclusions: ['Accommodation', 'Ferry transfers', 'Light and sound show', 'Snorkeling'],
    itinerary: [
      { day: 1, title: 'Port Blair Arrival', description: 'Arrive in Port Blair and visit Cellular Jail.' },
      { day: 2, title: 'Light & Sound Show', description: 'Experience the historic light and sound show at Cellular Jail.' },
      { day: 3, title: 'Havelock Island', description: 'Transfer to Havelock Island and relax at Radhanagar Beach.' },
      { day: 4, title: 'Snorkeling Adventure', description: 'Enjoy snorkeling at Elephant Beach and coral reefs.' },
      { day: 5, title: 'Return Journey', description: 'Return to Port Blair and depart.' }
    ]
  },
  
  // North India - Uttarakhand
  {
    id: 'd9',
    name: 'Rishikesh Adventure',
    location: 'Rishikesh, Uttarakhand, India',
    description: 'Rishikesh, also known as Hrishikesh, is a city governed by Rishikesh Municipal Corporation in the Dehradun district of the Indian state Uttarakhand.',
    duration: '3 Days',
    price: 6500,
    rating: 4.8,
    videoUrl: 'https://www.youtube.com/embed/9QJ-JxE-tWs',
    imageUrl: 'https://images.unsplash.com/photo-1629203851349-89a46909f0a7?q=80&w=1200',
    accommodation: 'Camp stay',
    inclusions: ['Accommodation', 'River rafting', 'Bungee jumping'],
    itinerary: [
      { day: 1, title: 'River Rafting', description: 'Enjoy river rafting in the Ganges.' },
      { day: 2, title: 'Bungee Jumping', description: 'Experience bungee jumping.' },
      { day: 3, title: 'Sightseeing', description: 'Visit local attractions.' }
    ]
  },
  {
    id: 'd20',
    name: 'Valley of Flowers Trek',
    location: 'Chamoli, Uttarakhand, India',
    description: 'The Valley of Flowers National Park is a UNESCO World Heritage Site known for its meadows of endemic alpine flowers and diverse flora.',
    duration: '6 Days',
    price: 12000,
    rating: 4.9,
    videoUrl: 'https://www.youtube.com/embed/6dQIDz_bGvM',
    imageUrl: 'https://images.unsplash.com/photo-1597131527245-0fb2f5659791?q=80&w=1200',
    accommodation: 'Guesthouses and camping',
    inclusions: ['Accommodation', 'Guided trek', 'Meals', 'Permits'],
    itinerary: [
      { day: 1, title: 'Arrival at Joshimath', description: 'Arrive at Joshimath and prepare for the trek.' },
      { day: 2, title: 'Trek to Ghangaria', description: 'Trek from Govindghat to Ghangaria base camp.' },
      { day: 3, title: 'Valley of Flowers', description: 'Full day exploration of the Valley of Flowers.' },
      { day: 4, title: 'Hemkund Sahib', description: 'Visit the sacred Hemkund Sahib lake and temple.' },
      { day: 5, title: 'Return to Ghangaria', description: 'Return trek to Ghangaria.' },
      { day: 6, title: 'Departure', description: 'Trek back to Govindghat and depart for Joshimath.' }
    ]
  },
  
  // South India - Karnataka
  {
    id: 'd10',
    name: 'Hampi Ruins',
    location: 'Hampi, Karnataka, India',
    description: 'Hampi, also referred to as the Group of Monuments at Hampi, is a UNESCO World Heritage Site located in east-central Karnataka, India.',
    duration: '2 Days',
    price: 4500,
    rating: 4.5,
    videoUrl: 'https://www.youtube.com/embed/Ww-Wj9W-Wjk',
    imageUrl: 'https://images.unsplash.com/photo-1563909289484-158e30423325?q=80&w=1200',
    accommodation: 'Guesthouse stay',
    inclusions: ['Accommodation', 'Sightseeing', 'Guided tour'],
    itinerary: [
      { day: 1, title: 'Sightseeing', description: 'Visit local attractions.' },
      { day: 2, title: 'Guided Tour', description: 'Enjoy a guided tour of the ruins.' }
    ]
  },
  {
    id: 'd21',
    name: 'Coorg Coffee Plantations',
    location: 'Coorg, Karnataka, India',
    description: 'Coorg (Kodagu) is a rural district in the Western Ghats of southwestern Karnataka, known for its coffee plantations, lush landscapes, and Kodava culture.',
    duration: '3 Days',
    price: 7000,
    rating: 4.7,
    videoUrl: 'https://www.youtube.com/embed/Y4jA8Fj6FxA',
    imageUrl: 'https://images.unsplash.com/photo-1622892735236-a521a612c4d2?q=80&w=1200',
    accommodation: 'Coffee estate homestay',
    inclusions: ['Accommodation', 'Coffee plantation tour', 'Wildlife safari', 'Local cuisine'],
    itinerary: [
      { day: 1, title: 'Coffee Estate Tour', description: 'Explore coffee plantations and learn about coffee production.' },
      { day: 2, title: 'Abbey Falls and Raja\'s Seat', description: 'Visit the scenic Abbey Falls and enjoy sunset at Raja\'s Seat.' },
      { day: 3, title: 'Dubare Elephant Camp', description: 'Interact with elephants at Dubare Elephant Camp.' }
    ]
  },
  
  // East India - Odisha
  {
    id: 'd22',
    name: 'Konark Sun Temple',
    location: 'Konark, Odisha, India',
    description: 'The Konark Sun Temple is a 13th-century CE sun temple dedicated to the Hindu Sun God Surya, known for its intricate stone carvings and architectural marvel.',
    duration: '2 Days',
    price: 5000,
    rating: 4.8,
    videoUrl: 'https://www.youtube.com/embed/OYxD9NH2nSA',
    imageUrl: 'https://images.unsplash.com/photo-1558432645-406280084a4d?q=80&w=1200',
    accommodation: 'Beach resort',
    inclusions: ['Accommodation', 'Temple tour', 'Chandrabhaga beach visit', 'Cultural show'],
    itinerary: [
      { day: 1, title: 'Sun Temple Exploration', description: 'Guided tour of the magnificent Konark Sun Temple.' },
      { day: 2, title: 'Puri & Beaches', description: 'Visit Puri Jagannath Temple and relax at Chandrabhaga beach.' }
    ]
  },
  {
    id: 'd23',
    name: 'Chilika Lake',
    location: 'Chilika, Odisha, India',
    description: 'Chilika Lake is the largest coastal lagoon in India and the second largest brackish water lagoon in the world, famous for its biodiversity and migratory birds.',
    duration: '3 Days',
    price: 6000,
    rating: 4.6,
    videoUrl: 'https://www.youtube.com/embed/yJUD8zYAfhM',
    imageUrl: 'https://images.unsplash.com/photo-1593693771929-5bc3a20ffd94?q=80&w=1200',
    accommodation: 'Lakeside resort',
    inclusions: ['Accommodation', 'Boat safari', 'Bird watching', 'Dolphin spotting'],
    itinerary: [
      { day: 1, title: 'Arrival & Orientation', description: 'Arrive at Chilika and get oriented with the unique ecosystem.' },
      { day: 2, title: 'Irrawaddy Dolphins', description: 'Boat safari to spot the rare Irrawaddy dolphins.' },
      { day: 3, title: 'Bird Island', description: 'Visit Nalabana Bird Sanctuary for migratory bird watching.' }
    ]
  },
  
  // Northeast India - Assam
  {
    id: 'd24',
    name: 'Kaziranga National Park',
    location: 'Kaziranga, Assam, India',
    description: 'Kaziranga National Park is a UNESCO World Heritage Site famous for housing two-thirds of the world\'s one-horned rhinoceros population.',
    duration: '3 Days',
    price: 8500,
    rating: 4.9,
    videoUrl: 'https://www.youtube.com/embed/bxLvr8sCO6s',
    imageUrl: 'https://images.unsplash.com/photo-1616587630610-0e7eb99e7d59?q=80&w=1200',
    accommodation: 'Wildlife lodge',
    inclusions: ['Accommodation', 'Jeep safari', 'Elephant safari', 'Meals'],
    itinerary: [
      { day: 1, title: 'Arrival & Evening Safari', description: 'Arrive at Kaziranga and enjoy an evening jeep safari.' },
      { day: 2, title: 'Elephant Safari', description: 'Early morning elephant safari to spot rhinoceros and other wildlife.' },
      { day: 3, title: 'Central Range Exploration', description: 'Jeep safari through the central range and departure.' }
    ]
  },
  {
    id: 'd25',
    name: 'Majuli River Island',
    location: 'Majuli, Assam, India',
    description: 'Majuli is the world\'s largest river island located in the Brahmaputra River, known for its unique Assamese culture, Satras (monasteries), and mask making.',
    duration: '2 Days',
    price: 5500,
    rating: 4.7,
    videoUrl: 'https://www.youtube.com/embed/BU7DGoXVA9g',
    imageUrl: 'https://images.unsplash.com/photo-1675278799906-6c4dbe7b9d8a?q=80&w=1200',
    accommodation: 'Traditional homestay',
    inclusions: ['Accommodation', 'Ferry transfers', 'Cultural performances', 'Mask making workshop'],
    itinerary: [
      { day: 1, title: 'Island Arrival & Satras', description: 'Ferry to Majuli and visit ancient Vaishnavite monasteries.' },
      { day: 2, title: 'Mask Making & Culture', description: 'Learn about traditional mask making and witness cultural performances.' }
    ]
  }
];

// Update a few destinations to add panorama URLs - using higher quality images with appropriate URL query parameters
destinations.forEach(dest => {
  // For demonstration, we'll use full quality panorama-suitable images
  if (dest.id === 'd1') {
    dest.panoramaUrl = 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=2000&auto=format&fit=crop';
  } else if (dest.id === 'd2') {
    dest.panoramaUrl = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000&auto=format&fit=crop';
  } else if (dest.id === 'd3') {
    dest.panoramaUrl = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2000&auto=format&fit=crop';
  } else if (dest.id === 'd14') {
    dest.panoramaUrl = 'https://images.unsplash.com/photo-1578662996442-48f1845c43a0?q=80&w=2000&auto=format&fit=crop';
  } else if (dest.id === 'd17') {
    dest.panoramaUrl = 'https://images.unsplash.com/photo-1583505093722-63ab271570d7?q=80&w=2000&auto=format&fit=crop';
  } else if (dest.id === 'd24') {
    dest.panoramaUrl = 'https://images.unsplash.com/photo-1584974292709-5c2f0619971b?q=80&w=2000&auto=format&fit=crop';
  }
});
