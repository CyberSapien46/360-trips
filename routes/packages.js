
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Package = require('../models/Package');
const PackageGroup = require('../models/PackageGroup');
const mongoose = require('mongoose');

// @route   GET api/packages
// @desc    Get all user packages
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const packages = await Package.find({ userId: req.user.id });
    res.json(packages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/packages
// @desc    Create a package
// @access  Private
router.post('/', auth, async (req, res) => {
  const { destinationId, packageName, packageGroupId } = req.body;

  try {
    const newPackage = new Package({
      userId: req.user.id,
      destinationId,
      packageName: packageName || 'My Travel Package',
      packageGroupId: packageGroupId || null
    });

    const package = await newPackage.save();
    res.json(package);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/packages/:id
// @desc    Delete a package
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({ msg: 'Package not found' });
    }

    // Make sure user owns the package
    if (package.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await package.remove();
    res.json({ msg: 'Package removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Package not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/packages/groups
// @desc    Get all package groups for user
// @access  Private
router.get('/groups', auth, async (req, res) => {
  try {
    const groups = await PackageGroup.find({ userId: req.user.id });
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/packages/groups
// @desc    Create a package group
// @access  Private
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
