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
  {
    id: 'd1',
    name: 'Taj Mahal',
    location: 'Agra, Uttar Pradesh, India',
    description: 'An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife.',
    duration: '1 Day',
    price: 5000,
    rating: 4.8,
    videoUrl: 'https://www.youtube.com/embed/KNhrE6GId4Y',
    imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    accommodation: 'Luxury hotels available nearby',
    inclusions: ['Entry tickets', 'Guided tour', 'Lunch'],
    itinerary: [
      { day: 1, title: 'Visit Taj Mahal', description: 'Explore the iconic Taj Mahal and learn about its history.' }
    ]
  },
  {
    id: 'd2',
    name: 'Kerala Backwaters',
    location: 'Alleppey, Kerala, India',
    description: 'The Kerala backwaters are a network of brackish lagoons and lakes lying parallel to the Arabian Sea coast of Kerala state in southern India.',
    duration: '2 Days',
    price: 7500,
    rating: 4.6,
    videoUrl: 'https://www.youtube.com/embed/JUJqWAbCjKk',
    imageUrl: 'https://images.unsplash.com/photo-1572914839059-2f35565e35ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    accommodation: 'Houseboat stay',
    inclusions: ['Houseboat stay', 'Meals', 'Village visit'],
    itinerary: [
      { day: 1, title: 'Houseboat Cruise', description: 'Enjoy a relaxing houseboat cruise through the backwaters.' },
      { day: 2, title: 'Village Visit', description: 'Visit local villages and experience the culture.' }
    ]
  },
  {
    id: 'd3',
    name: 'Goa Beaches',
    location: 'Goa, India',
    description: 'Goa, a tiny emerald land, is washed by the Arabian Sea on its west coast. Goa is known for its stunning beaches, excellent cuisine and Portuguese heritage.',
    duration: '3 Days',
    price: 6000,
    rating: 4.7,
    videoUrl: 'https://www.youtube.com/embed/rdc36JCPs9Y',
    imageUrl: 'https://images.unsplash.com/photo-1517191434788-255216a92493?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
    accommodation: 'Beach resort stay',
    inclusions: ['Accommodation', 'Water sports', 'Sightseeing'],
    itinerary: [
      { day: 1, title: 'Beach Relaxation', description: 'Relax on the beaches of Goa.' },
      { day: 2, title: 'Water Sports', description: 'Enjoy water sports activities.' },
      { day: 3, title: 'Sightseeing', description: 'Visit local attractions.' }
    ]
  },
  {
    id: 'd4',
    name: 'Rajasthan Deserts',
    location: 'Jaisalmer, Rajasthan, India',
    description: 'Jaisalmer "the Golden city", is a town in the Indian state of Rajasthan, located 575 kilometres (357 mi) west of the state capital, Jaipur.',
    duration: '4 Days',
    price: 8000,
    rating: 4.5,
    videoUrl: 'https://www.youtube.com/embed/DQ9FIm-mq-Y',
    imageUrl: 'https://images.unsplash.com/photo-1628515957778-52f981199c04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
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
    id: 'd5',
    name: 'Ladakh Monasteries',
    location: 'Leh, Ladakh, India',
    description: 'Ladakh, "the land of high passes", is a region administered by India as a union territory and constituting a part of the larger Kashmir region.',
    duration: '5 Days',
    price: 10000,
    rating: 4.9,
    videoUrl: 'https://www.youtube.com/embed/JjTj7VbEj30',
    imageUrl: 'https://images.unsplash.com/photo-1615934669857-9e799b355923?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
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
    id: 'd6',
    name: 'Varanasi Ghats',
    location: 'Varanasi, Uttar Pradesh, India',
    description: 'Varanasi is a city on the banks of the Ganges in Uttar Pradesh, India, 320 kilometres (200 mi) south-east of the state capital, Lucknow.',
    duration: '2 Days',
    price: 4000,
    rating: 4.4,
    videoUrl: 'https://www.youtube.com/embed/Pp-JlbGHIKM',
    imageUrl: 'https://images.unsplash.com/photo-1599420425731-e5593a454048?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    accommodation: 'Guesthouse stay',
    inclusions: ['Accommodation', 'Ganga Aarti', 'Boat ride'],
    itinerary: [
      { day: 1, title: 'Ganga Aarti', description: 'Witness the Ganga Aarti ceremony.' },
      { day: 2, title: 'Boat Ride', description: 'Enjoy a boat ride on the Ganges.' }
    ]
  },
  {
    id: 'd7',
    name: 'Darjeeling Tea Gardens',
    location: 'Darjeeling, West Bengal, India',
    description: 'Darjeeling is a town and a municipality in the Indian state of West Bengal, located in the Lesser Himalayas. It is known for its tea industry, its views of Kangchenjunga.',
    duration: '3 Days',
    price: 5500,
    rating: 4.6,
    videoUrl: 'https://www.youtube.com/embed/QtbvJ-44GuI',
    imageUrl: 'https://images.unsplash.com/photo-1600887936033-a5264c4ca892?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    accommodation: 'Tea estate stay',
    inclusions: ['Accommodation', 'Tea tasting', 'Sightseeing'],
    itinerary: [
      { day: 1, title: 'Tea Tasting', description: 'Taste different types of tea.' },
      { day: 2, title: 'Sightseeing', description: 'Visit local attractions.' },
      { day: 3, title: 'Toy Train Ride', description: 'Enjoy a ride on the Darjeeling Himalayan Railway.' }
    ]
  },
  {
    id: 'd8',
    name: 'Andaman Islands',
    location: 'Port Blair, Andaman and Nicobar Islands, India',
    description: 'The Andaman and Nicobar Islands, one of the seven union territories of India, are a group of islands at the juncture of the Bay of Bengal and the Andaman Sea.',
    duration: '4 Days',
    price: 9000,
    rating: 4.7,
    videoUrl: 'https://www.youtube.com/embed/m6cpD0lH-TE',
    imageUrl: 'https://images.unsplash.com/photo-1562645133-559b5986805a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
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
    id: 'd9',
    name: 'Rishikesh Adventure',
    location: 'Rishikesh, Uttarakhand, India',
    description: 'Rishikesh, also known as Hrishikesh, is a city governed by Rishikesh Municipal Corporation in the Dehradun district of the Indian state Uttarakhand.',
    duration: '3 Days',
    price: 6500,
    rating: 4.8,
    videoUrl: 'https://www.youtube.com/embed/9QJ-JxE-tWs',
    imageUrl: 'https://images.unsplash.com/photo-1629203851349-89a46909f0a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    accommodation: 'Camp stay',
    inclusions: ['Accommodation', 'River rafting', 'Bungee jumping'],
    itinerary: [
      { day: 1, title: 'River Rafting', description: 'Enjoy river rafting in the Ganges.' },
      { day: 2, title: 'Bungee Jumping', description: 'Experience bungee jumping.' },
      { day: 3, title: 'Sightseeing', description: 'Visit local attractions.' }
    ]
  },
  {
    id: 'd10',
    name: 'Hampi Ruins',
    location: 'Hampi, Karnataka, India',
    description: 'Hampi, also referred to as the Group of Monuments at Hampi, is a UNESCO World Heritage Site located in east-central Karnataka, India.',
    duration: '2 Days',
    price: 4500,
    rating: 4.5,
    videoUrl: 'https://www.youtube.com/embed/Ww-Wj9W-Wjk',
    imageUrl: 'https://images.unsplash.com/photo-1563909289484-158e30423325?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    accommodation: 'Guesthouse stay',
    inclusions: ['Accommodation', 'Sightseeing', 'Guided tour'],
    itinerary: [
      { day: 1, title: 'Sightseeing', description: 'Visit local attractions.' },
      { day: 2, title: 'Guided Tour', description: 'Enjoy a guided tour of the ruins.' }
    ]
  }
];

// Update a few destinations to add panorama URLs
destinations.forEach(dest => {
  // For demonstration, we'll use the regular image for panorama view
  // In a real implementation, you would use actual 360° panorama images
  if (dest.id === 'd1') {
    dest.panoramaUrl = 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80';
  } else if (dest.id === 'd2') {
    dest.panoramaUrl = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80';
  } else if (dest.id === 'd3') {
    dest.panoramaUrl = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80';
  }
});
