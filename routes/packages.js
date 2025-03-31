
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Package = require('../models/Package');
const PackageGroup = require('../models/PackageGroup');

// Get user packages
router.get('/', auth, async (req, res) => {
  try {
    const packages = await Package.find({ userId: req.user.id });
    res.json(packages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add destination to package
router.post('/', auth, async (req, res) => {
  const { destinationId, packageName, packageGroupId } = req.body;
  
  try {
    // Check if package already exists
    const existingPackage = await Package.findOne({ 
      userId: req.user.id,
      destinationId
    });
    
    if (existingPackage) {
      return res.status(400).json({ msg: 'Destination already in package' });
    }
    
    const newPackage = new Package({
      userId: req.user.id,
      destinationId,
      packageName: packageName || 'My Travel Package',
      packageGroupId
    });
    
    const package = await newPackage.save();
    res.json(package);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Remove destination from package
router.delete('/:destinationId', auth, async (req, res) => {
  try {
    await Package.findOneAndDelete({ 
      userId: req.user.id,
      destinationId: req.params.destinationId 
    });
    
    res.json({ msg: 'Destination removed from package' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get package groups
router.get('/groups', auth, async (req, res) => {
  try {
    const groups = await PackageGroup.find({ userId: req.user.id });
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create package group
router.post('/groups', auth, async (req, res) => {
  const { name } = req.body;
  
  try {
    const newGroup = new PackageGroup({
      userId: req.user.id,
      name
    });
    
    const group = await newGroup.save();
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
