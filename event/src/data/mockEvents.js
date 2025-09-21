export const mockEvents = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description: "Join us for the biggest tech conference of the year featuring cutting-edge technologies, networking opportunities, and inspiring talks from industry leaders. This event will cover AI, blockchain, cloud computing, and the future of software development.",
    date: "2024-10-15",
    time: "09:00",
    location: "San Francisco Convention Center",
    address: "747 Howard St, San Francisco, CA 94103",
    priceINR: 2999,
    seats: 500,
    bookedSeats: 150,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    organizer: "TechEvents Inc.",
    tags: ["Technology", "Networking", "Innovation"]
  },
  {
    id: 2,
    title: "Summer Music Festival",
    description: "Experience three days of incredible music with top artists from around the world. Featuring multiple stages, food trucks, and an unforgettable atmosphere under the stars. Get ready for the musical event of the summer!",
    date: "2024-07-20",
    time: "18:00",
    location: "Golden Gate Park",
    address: "Golden Gate Park, San Francisco, CA",
    priceINR: 1500,
    seats: 2000,
    bookedSeats: 800,
    category: "Music",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    organizer: "Music Events Co.",
    tags: ["Music", "Festival", "Outdoor"]
  },
  {
    id: 3,
    title: "Art Gallery Opening",
    description: "Discover contemporary art at its finest in this exclusive gallery opening. Meet the artists, enjoy wine and hors d'oeuvres, and be among the first to see these stunning new collections. A night of culture and sophistication awaits.",
    date: "2024-06-10",
    time: "19:00",
    location: "Modern Art Museum",
    address: "151 3rd St, San Francisco, CA 94103",
    priceINR: 750,
    seats: 200,
    bookedSeats: 45,
    category: "Art",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    organizer: "City Art Foundation",
    tags: ["Art", "Culture", "Networking"]
  },
  {
    id: 4,
    title: "Startup Pitch Competition",
    description: "Watch innovative startups pitch their groundbreaking ideas to a panel of expert investors. Network with entrepreneurs, learn about emerging trends, and witness the future of business unfold before your eyes.",
    date: "2024-08-05",
    time: "14:00",
    location: "Innovation Hub",
    address: "123 Startup Way, Palo Alto, CA 94301",
    priceINR: 500,
    seats: 300,
    bookedSeats: 120,
    category: "Business",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    organizer: "Startup Accelerator",
    tags: ["Business", "Startup", "Innovation"]
  },
  {
    id: 5,
    title: "Food & Wine Festival",
    description: "Indulge in a culinary journey featuring the finest local restaurants, award-winning wines, and celebrity chef demonstrations. A perfect blend of flavors, entertainment, and gastronomic excellence awaits food enthusiasts.",
    date: "2024-09-12",
    time: "12:00",
    location: "Pier 39",
    address: "Pier 39, San Francisco, CA 94133",
    priceINR: 1250,
    seats: 800,
    bookedSeats: 250,
    category: "Food",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    organizer: "Culinary Events SF",
    tags: ["Food", "Wine", "Culinary"]
  },
  {
    id: 6,
    title: "Fitness Bootcamp",
    description: "Transform your fitness journey with this high-energy bootcamp featuring professional trainers, nutritional guidance, and a supportive community. Perfect for all fitness levels looking to challenge themselves and achieve their goals.",
    date: "2024-06-25",
    time: "07:00",
    location: "Marina Green",
    address: "Marina Green, San Francisco, CA",
    priceINR: 350,
    seats: 100,
    bookedSeats: 60,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    organizer: "FitLife Events",
    tags: ["Fitness", "Health", "Outdoor"]
  }
];

export const getEventById = (id) => {
  return mockEvents.find(event => event.id === parseInt(id));
};

export const getAvailableSeats = (eventId) => {
  const event = getEventById(eventId);
  return event ? event.seats - event.bookedSeats : 0;
};

export const bookEvent = (eventId, ticketsBooked) => {
  const eventIndex = mockEvents.findIndex(event => event.id === parseInt(eventId));
  if (eventIndex !== -1) {
    mockEvents[eventIndex].bookedSeats += ticketsBooked;
    return true;
  }
  return false;
};