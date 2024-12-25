// const express = require('express');
// const Shelter = require('../models/shelter');
// const multer = require('multer'); // For handling image uploads
// const path = require('path');

// const router = express.Router();

// // Set up Multer for image uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Save uploaded images to 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Create a unique file name
//     }
// });

// const upload = multer({ storage: storage });

// // Route to POST (Add Shelter)
// router.post('/add', upload.single('image'), async (req, res) => {
//     try {
//         const { name, location, capacity, availableSpace, contact, coordinates } = req.body;

//         if (!name || !location || !capacity || !availableSpace || !contact || !coordinates) {
//             return res.status(400).json({ message: 'All fields are required!' });
//         }

//         // Handle image upload
//         const image = req.file ? req.file.path : null;

//         // Create new shelter
//         const shelter = new Shelter({
//             name,
//             location,
//             capacity,
//             availableSpace,
//             contact,
//             coordinates,
//             image,
//         });

//         const savedShelter = await shelter.save();
//         res.status(201).json({ message: 'Shelter added successfully!', data: savedShelter });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error adding shelter', error });
//     }
// });

// // Route to UPDATE (Update Shelter)
// router.put('/update/:id', upload.single('image'), async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, location, capacity, availableSpace, contact, coordinates } = req.body;

//         if (!name || !location || !capacity || !availableSpace || !contact || !coordinates) {
//             return res.status(400).json({ message: 'All fields are required!' });
//         }

//         // Handle image upload (if new image is uploaded)
//         const image = req.file ? req.file.path : null;

//         const updatedShelter = await Shelter.findByIdAndUpdate(
//             id,
//             {
//                 name,
//                 location,
//                 capacity,
//                 availableSpace,
//                 contact,
//                 coordinates,
//                 image: image || undefined, // Only update image if new one is provided
//             },
//             { new: true } // Return the updated document
//         );

//         if (!updatedShelter) {
//             return res.status(404).json({ message: 'Shelter not found' });
//         }

//         res.status(200).json({ message: 'Shelter updated successfully!', data: updatedShelter });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error updating shelter', error });
//     }
// });

// // Route to GET (List All Shelters)
// router.get('/', async (req, res) => {
//     try {
//         const shelters = await Shelter.find();
//         res.status(200).json({ message: 'Shelters fetched successfully!', data: shelters });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching shelters', error });
//     }
// });

// module.exports = router;

const express = require('express');
const Shelter = require('../models/shelter');
const multer = require('multer'); // For handling image uploads
const path = require('path');

const router = express.Router();

// Set up Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save uploaded images to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Create a unique file name
    }
});

const upload = multer({ storage: storage });

// Route to POST (Add Shelter)
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { name, location, capacity, availableSpace, contact ,latitude,longitude} = req.body;

        if (!name || !location || !capacity || !availableSpace || !contact ) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Handle image upload
        const image = req.file ? req.file.path : null;

        // Create new shelter
        const shelter = new Shelter({
            name,
            location,
            capacity,
            availableSpace,
            contact,
            coordinates: {
                latitude: parseFloat(latitude),  // Make sure it's a valid number
                longitude: parseFloat(longitude)
            },
         // Expecting coordinates as latitude and longitude
            image,
        });

        const savedShelter = await shelter.save();
        res.status(201).json({ message: 'Shelter added successfully!', data: savedShelter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding shelter', error });
    }
});

// Route to UPDATE (Update Shelter)
router.put('/api/shelter/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, capacity, availableSpace, contact, coordinates } = req.body;

        if (!name || !location || !capacity || !availableSpace || !contact || !coordinates) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Handle image upload (if new image is uploaded)
        const image = req.file ? req.file.path : null;

        // Update shelter in database
        const updatedShelter = await Shelter.findByIdAndUpdate(
            id,
            {
                name,
                location,
                capacity,
                availableSpace,
                contact,
                coordinates,
                image: image || undefined, // Only update image if new one is provided
            },
            { new: true } // Return the updated document
        );

        if (!updatedShelter) {
            return res.status(404).json({ message: 'Shelter not found' });
        }

        res.status(200).json({ message: 'Shelter updated successfully!', data: updatedShelter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating shelter', error });
    }
});

// Route to GET (List All Shelters)
router.get('/', async (req, res) => {
    try {
        const shelters = await Shelter.find();
        res.status(200).json({ message: 'Shelters fetched successfully!', data: shelters });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching shelters', error });
    }
});

// Route to GET Shelter by ID (Fetch single shelter by ID)
router.get('/:id', async (req, res) => {
    try {
        const shelter = await Shelter.findById(req.params.id);

        if (!shelter) {
            return res.status(404).json({ message: 'Shelter not found' });
        }

        res.status(200).json({ message: 'Shelter fetched successfully!', data: shelter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching shelter', error });
    }
});

module.exports = router;
