const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const getMiddleware = require("../middleware/GetMiddleware");
const FitnessSchema = require("../models/Fitness");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const Fitness = require("../models/Fitness");

// Define multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

//......................................Route 1......................................................

router.get("/fetchAll/Fitnesswear", getMiddleware, async (req, res) => {
  try {
    // Fetch teamwork data
    const notes = await FitnessSchema.find();
    res.json(notes); // this means notes array send krdo reponse
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//--------------------------------Route 2: To add notes---------------------
//-------------Add a new note using Post request: "localhost:5000/api/notes/addnote"-----------------------
router.post(
  "/add/Fitnesswear",
  upload.array("image", 10),
  getMiddleware,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("fabric", "Enter fabric").isLength({ min: 1 }),
    body("price", "Enter a price").isLength({ min: 1 }),
    body("size", "Please choose size").isLength({ min: 1 }),
    body("color", "Please choose atleast 1 color").isLength({ min: 3 }),
    body("Polo_collar").optional(),
    body("Round_neck").optional(),
    body("Cloth_collar").optional(),
    body("Readymade_collar").optional(),
    body("printing_charges").optional(),
    body("printing_area").optional(),
    body("sleeves_type").optional(),

    // body("size", "Enter a valid size").isLength({ min: 1 }),
  ],

  async (req, res) => {
    try {
      //Extract title, description, tag from req.body by using object destruction
      const {
        title,
        description,
        price,
        color,
        size,
        fabric,
        Polo_collar,
        Round_neck,
        Cloth_collar,
        Readymade_collar,
        sleeves_type,
        printing_charges,
        printing_area,
        full_sleeves,
        half_sleeves,
      } = req.body;

      // Get the paths of the uploaded files from multer
      const imagePaths = req.files.map((file) => `uploads/${file.filename}`);
      // Format image paths as a comma-separated string
      const imageString = imagePaths.join(", ");

      //If there is any error occured, return end request and the validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const note = new FitnessSchema({
        title,
        description,
        price,
        color,
        fabric,
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
        image: imageString,
      });
      const savedNotes = await note.save();

      res.json(savedNotes);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//-------------Route 3 : update and existing note---------------
//------------"localhost:5000/api/notes/updatenote/:id"-------------------------
router.put("/update/Fitnesswear/:id", getMiddleware, async (req, res) => {
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
    let note = await FitnessSchema.findById(req.params.id); //params me jo id hai
    if (!note) {
      //agar params me id nahi hai to..
      return res.status(404).send("Not Found");
    }

    note = await FitnessSchema.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//----------------------Route 3-----------------------
//-----this route 3 is to delete the note : "localhost:5000/api/notes/deletenote/:id"
router.delete("/delete/Fitnesswear/:id", getMiddleware, async (req, res) => {
  try {
    //Extract title, description, tag from req.body by using object destruction
    const { title, description, tag } = req.body;

    //Find the note to be deleted and delete it
    let note = await FitnessSchema.findById(req.params.id); //params me jo id hai
    if (!note) {
      //agar params me id nahi hai to..
      return res.status(404).send("Not Found");
    }

    //Allow deletion only id user owns this Note
    if (note.user.toString() !== req.user.id) {
      //agar params me id nahi hai to..
      return res.status(401).send("Not Allowed");
    }

    note = await FitnessSchema.findByIdAndDelete(req.params.id);

    res.json({
      Sucess: "Note has been deleted",
      note: note,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// -------------------------Route 3 : Search------------------------
// /fetchallSearchednotes?title=your_title
router.get("/fetchallSearched/Fitnesswear", getMiddleware, async (req, res) => {
  try {
    const searchTitle = req.query.title || ""; // Get the search title from query parameters or set an empty string as default

    const notes = await FitnessSchema.find({
      user: req.user.id, // Ensure correct user association using `req.user.id`
      title: { $regex: new RegExp(searchTitle, "i") }, // Perform case-insensitive search with exact match
    });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//  ---------------Route 4: Search and Sort--------------
//    //SearchAndSort?sort=asc
//    //SearchAndSort?sort=desc
//    //SearchAndSort?title=Jeans&sort=asc
//    //SearchAndSort?title=Jeans&sort=desc

router.get("/SearchAndSort/Fitnesswear", getMiddleware, async (req, res) => {
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
    const notes = await FitnessSchema.find(filter).sort(sortOption);

    // Send the filtered and sorted notes array as a JSON response
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
