const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const getMiddleware = require("../middleware/GetMiddleware");
const SportswearSchema = require("../models/Sports");
const { body, validationResult } = require("express-validator");
const multer = require("multer");

// Define multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "uploads");
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

//......................................Route 1......................................................

// router.get("/fetchAll/Teamwork", getMiddleware, async (req, res) => {
//   try {
//     const notes = await SportswearSchema.find();
//     res.json(notes);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });
router.get("/fetchAll/Sportswear", getMiddleware, async (req, res) => {
  try {
    // Find all documents, sort by _id in descending order (latest first)
    const notes = await SportswearSchema.find().sort({ _id: -1 });

    // Check if there's any result
    if (notes.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json(notes); // Return the array of documents in reversed order
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//--------------------------------Route 2: To add notes---------------------
//-------------Add a new note using Post request: "localhost:5000/api/notes/addnote"-----------------------

router.post(
  "/add/Sportswear",
  upload.single("image"), // Handle single file upload with the field name "image"
  // fetchuser,
  getMiddleware,
  [
    body("title", "Enter a valid title").isLength({ min: 2 }),
    body("fabric", "Please enter fabric").isLength({ min: 1 }),
    body("description", "description must be atleast 5 characters").isLength({min: 3}),
    body("price", "Enter a price").isLength({ min: 1 }),
    body("price", "Enter a price").isLength({ min: 2 }),
    body("color", "Please choose atleast 1 color").isLength({ min: 3 }),
    body("size", "Please choose at least 1 size").isLength({ min: 1 }),
    body("Polo_collar").optional(),
    body("Round_neck").optional(),
    body("Cloth_collar").optional(),
    body("Readymade_collar").optional(),
    body("printing_charges").optional(),
    body("printing_area").optional(),
    body("sleeves_type").optional(),
  ],
  async (req, res) => {
    try {
      // Extract form data from the request
      const {
        title,
        description,
        fabric,
        price,
        color,
        sleeves_type,
        Polo_collar,
        Round_neck,
        Cloth_collar,
        Readymade_collar,
        printing_charges,
        printing_area,
        full_sleeves,
        half_sleeves,
        size,
      } = req.body;

      // Get the path of the uploaded file from multer
      // const imagePath = req.file.path;
      const imagePath = `uploads/${req?.file?.filename}`;

      // If there are any validation errors, return them
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      // Create a new SportswearSchema instance with the uploaded file path
      const note = new SportswearSchema({
        title,
        description,
        price,
        color,
        fabric,
        image: imagePath, // Save the image path in the database
        sleeves_type,
        Polo_collar,
        Round_neck,
        Cloth_collar,
        Readymade_collar,
        printing_charges,
        printing_area,
        full_sleeves,
        half_sleeves,
        size,
        // user: req.user.id,
      });

      // Save the new Teamwork entry to the database
      const savedNote = await note.save();

      // Return the saved note as the response
      res.json(savedNote);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//-------------Route 3 : update and existing note---------------
//------------"localhost:5000/api/notes/updatenote,/:id"-------------------------
router.put(
  "/update/Sportswear/:id",
  getMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      //Extract title, description, tag from req.body by using object destruction
      const {
        title,
        description,
        price,
        color,
        fabric,
        image,
        sleeves_type,
        Polo_collar,
        Round_neck,
        Cloth_collar,
        Readymade_collar,
        printing_charges,
        printing_area,
        full_sleeves,
        half_sleeves,
        size,
        
      } = req.body;
      //Yeh line ek naya empty object newNote banata hai, jisme hum update karne wale note ki nayi values store karenge.
      const newNote = {};

      //agar title hai to newNote ke title ko title kardo,

      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (fabric) {
        newNote.fabric = fabric;
      }
      if (price) {
        newNote.price = price;
      }
      if (color) {
        newNote.color = color;
      }
      if (size) {
        newNote.size = size;
      }
      if (Polo_collar !== undefined) {
        newNote.Polo_collar = Polo_collar;
      }
      if (Round_neck !== undefined) {
        newNote.Round_neck = Round_neck;
      }
      if (Cloth_collar !== undefined) {
        newNote.Cloth_collar = Cloth_collar;
      }
      if (Readymade_collar !== undefined) {
        newNote.Readymade_collar = Readymade_collar;
      }
      if (printing_charges !== undefined) {
        newNote.printing_charges = printing_charges;
      }
      if (printing_area) {
        newNote.printing_area = printing_area;
      }
      if (full_sleeves !== undefined) {
        newNote.full_sleeves = full_sleeves;
      }
      if (half_sleeves !== undefined) {
        newNote.half_sleeves = half_sleeves;
      }
      if (sleeves_type) {
        newNote.sleeves_type = sleeves_type;
      }

      if (req.file) newNote.image = `uploads/${req.file.filename}`;

      //Find the note to be updated and update it
      let note = await SportswearSchema.findById(req.params.id); //params me jo id hai
      if (!note) {
        //agar params me id nahi hai to..
        return res.status(404).send("Not Found");
      }

      // //Allow update only id user owns this Note
      // if (note.user.toString() !== req.user.id) {
      //   //agar params me id nahi hai to..
      //   return res.status(401).send("Not Allowed");
      // }

      note = await SportswearSchema.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//----------------------Route 3-----------------------
//-----this route 3 is to delete the note : "localhost:5000/api/notes/deletenote/:id"
router.delete(
  "/delete/Sportswear/:id",
  //  fetchuser,
  getMiddleware,
  async (req, res) => {
    try {
      //Extract title, description, tag from req.body by using object destruction
      // const { title, description, tag, image } = req.body;

      //Find the note to be deleted and delete it
      let note = await SportswearSchema.findById(req.params.id); //params me jo id hai
      if (!note) {
        //agar params me id nahi hai to..
        return res.status(404).send("Not Found");
      }

      //Allow deletion only id user owns this Note
      // if (note.user.toString() !== req.user.id) {
      //agar params me id nahi hai to..
      // return res.status(401).send("Not Allowed");
      // }

      note = await SportswearSchema.findByIdAndDelete(req.params.id);

      res.json({
        Sucess: "Note has been deleted",
        note: note,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// -------------------------Route 3 : Search------------------------
// /fetchallSearchednotes?title=your_title
router.get(
  "/fetchallSearched/Sportswear",
  fetchuser,
  getMiddleware,
  async (req, res) => {
    try {
      const searchTitle = req.query.title || ""; // Get the search title from query parameters or set an empty string as default

      const notes = await SportswearSchema.find({
        user: req.user.id, // Ensure correct user association using `req.user.id`
        title: { $regex: new RegExp(searchTitle, "i") }, // Perform case-insensitive search with exact match
      });

      res.json(notes);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//  ---------------Route 4: Search and Sort--------------
//    //SearchAndSort?sort=asc
//    //SearchAndSort?sort=desc
//    //SearchAndSort?title=Jeans&sort=asc
//    //SearchAndSort?title=Jeans&sort=desc

router.get(
  "/SearchAndSort/Sportswear",
  fetchuser,
  getMiddleware,
  async (req, res) => {
    try {
      // Extract the title and sort parameters from the query string
      const { title, sort } = req.query;

      // Build the filter object based on the title parameter
      const filter = { user: req.user.id };
      if (title) {
        filter.title = title;
      }

      // Build the sort object based on the sort parameter
      let sortOption = {};
      if (sort === "asc") {
        sortOption = { price: 1 }; // Ascending order
      } else if (sort === "desc") {
        sortOption = { price: -1 }; // Descending order
      }

      // Use the filter and sort objects in the Note.find method
      const notes = await SportswearSchema.find(filter).sort(sortOption);

      // Send the filtered and sorted notes array as a JSON response
      res.json(notes);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
