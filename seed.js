
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('./models/Destination');
const { destinations } = require('./client/src/data/destinations');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Format destinations for MongoDB
const formattedDestinations = destinations.map(dest => ({
  name: dest.name,
  location: dest.location,
  description: dest.description,
  imageUrl: dest.imageUrl,
  videoUrl: dest.videoUrl,
  price: dest.price,
  rating: dest.rating
}));

// Seeds the database with destinations
const seedDatabase = async () => {
  try {
    // First, clear existing destinations
    await Destination.deleteMany({});
    console.log('Cleared existing destinations');
    
    // Insert new destinations
    await Destination.insertMany(formattedDestinations);
    console.log(`Successfully seeded ${formattedDestinations.length} destinations`);
    
    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
