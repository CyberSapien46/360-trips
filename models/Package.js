
const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destinationId: {
    type: String, // We'll keep this as a string to maintain compatibility with current structure
    required: true
  },
  packageName: {
    type: String,
    default: 'My Travel Package'
  },
  packageGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PackageGroup'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Package', PackageSchema);
