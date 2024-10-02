// const express = require("express");
// const router = express.Router();
// const fetchuser = require("../middleware/fetchuser");
// const getMiddleware = require("../middleware/GetMiddleware");
// const ProductSchema = require("../models/Product");
// const { body, validationResult } = require("express-validator");
// const multer = require("multer");

// // Define multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null, uniqueSuffix + file.originalname);
//   },  
// });

// const upload = multer({ storage: storage });

// //......................................Route 1......................................................

// // router.get("/fetchAll/Teamwork", getMiddleware, async (req, res) => {
// //   try {
// //     const notes = await ProductSchema.find();
// //     res.json(notes);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).send("Internal Server Error");
// //   }
// // });


// //--------------------------------Route 2: To add notes---------------------
// //-------------Add a new note using Post request: "localhost:5000/api/notes/addnote"-----------------------

// router.post(
//   "/add/Product",
//   // upload.single("image"),
//   upload.array("image", 10),
//   // fetchuser,
//   getMiddleware,
//   [
//     body("title", "Enter a valid title").isLength({ min: 3 }),
//     body("category", "Enter category").isLength({ min: 3 }),
//     body("fabric", "Please enter fabric").isLength({ min: 1 }),body("title", "Enter a valid title").isLength({ min: 3 }),
//     body("description", "description must be atleast 5 characters").isLength({
//       min: 5,
//     }),
//     body("size", "Please choose any size").isLength({ min: 1 }),
//     body("price", "Enter a price").isLength({ min: 1 }),
//     body("color", "Please choose atleast 1 color").isLength({ min: 3 }),
//     body("Polo_collar").optional(),
//     body("Round_neck").optional(),
//     body("Cloth_collar").optional(),
//     body("Readymade_collar").optional(),
//     body("printing_charges").optional(),
//     body("printing_area").optional(),
//     body("sleeves_type").optional(),
//     body("Product_code").optional(),
//   ],
//   async (req, res) => {
//     try {
//       // Extract form data from the request
//       const {
//         title,
//         category,
//         description,
//         fabric,
//         price,
//         color,
//         sleeves_type,
//         Polo_collar,
//         Round_neck,
//         Cloth_collar,
//         Readymade_collar,
//         full_sleeves,
//         half_sleeves,
//         printing_charges,
//         printing_area,
//         Product_code,
//         size,
//       } = req.body;

//       // Get the paths of the uploaded files from multer
//       const imagePaths = req.files.map((file) => `uploads/${file.filename}`);
//       // Format image paths as a comma-separated string
//       const imageString = imagePaths.join(", ");

//       // If there are any validation errors, return them
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({
//           errors: errors.array(),
//         });
//       }

//       // Create a new ProductSchema instance with the uploaded file path
//       const note = new ProductSchema({
//         title,
//         category,
//         description,
//         price,
//         color,
//         fabric,
//         image: imageString,
//         sleeves_type,
//         Polo_collar,
//         Round_neck,
//         Cloth_collar,
//         Readymade_collar,
//         full_sleeves,
//         half_sleeves,
//         printing_charges,
//         printing_area,
//         Product_code,
//         size,
//         // user: req.user.id,
//       });

//       // Save the new Teamwork entry to the database
//       const savedNote = await note.save();

//       // Return the saved note as the response
//       res.json(savedNote);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );
// // router.post(
// //   "/add/Product",
// //   upload.array("image", 10),
// //   [
// //     // Validation checks
// //     body("title", "Enter a valid title").isLength({ min: 3 }),
// //     body("category", "Enter category").isLength({ min: 3 }),
// //     body("fabric", "Please enter fabric").isLength({ min: 1 }),
// //     body("description", "Description must be at least 5 characters").isLength({ min: 5 }),
// //     body("size", "Please choose any size").isLength({ min: 1 }),
// //     body("price", "Enter a price").isLength({ min: 1 }),
// //     body("color", "Please choose at least 1 color").isLength({ min: 3 }),
// //     body("Polo_collar").optional(),
// //     body("Round_neck").optional(),
// //     body("Cloth_collar").optional(),
// //     body("Readymade_collar").optional(),
// //     body("printing_charges").optional(),
// //     body("printing_area").optional(),
// //     body("sleeves_type").optional(),
// //     body("Product_code").optional(),
// //   ],
// //   async (req, res) => {
// //     try {
// //       const {
// //         title,
// //         category,
// //         description,
// //         fabric,
// //         price,
// //         color,
// //         sleeves_type,
// //         Polo_collar,
// //         Round_neck,
// //         Cloth_collar,
// //         Readymade_collar,
// //         full_sleeves,
// //         half_sleeves,
// //         printing_charges,
// //         printing_area,
// //         Product_code,
// //         size,
// //       } = req.body;

// //       // Ensure that files were uploaded
// //       let imagePaths = [];
// //       if (req.files) {
// //         imagePaths = req.files.map((file) => `uploads/${file.filename}`);
// //       } else {
// //         return res.status(400).json({ error: "No files uploaded" });
// //       }

// //       // Check for validation errors
// //       const errors = validationResult(req);
// //       if (!errors.isEmpty()) {
// //         return res.status(400).json({
// //           errors: errors.array(),
// //         });
// //       }

// //       // Create a new product document
// //       const product = new ProductSchema({
// //         title,
// //         category,
// //         description,
// //         price,
// //         color,
// //         fabric,
// //         image: imagePaths.join(", "),
// //         sleeves_type,
// //         Polo_collar,
// //         Round_neck,
// //         Cloth_collar,
// //         Readymade_collar,
// //         full_sleeves,
// //         half_sleeves,
// //         printing_charges,
// //         printing_area,
// //         Product_code,
// //         size,
// //       });

// //       const savedProduct = await product.save();
// //       res.json(savedProduct);
// //     } catch (error) {
// //       console.error(error);
// //       res.status(500).send("Internal Server Error");
// //     }
// //   }
// // );


// //-------------Route 3 : update and existing note---------------
// //------------"localhost:5000/api/notes/updatenote,/:id"-------------------------
// router.put(
//   "/update/Product/:id",
//   getMiddleware,
//   upload.array("image", 10),
//   async (req, res) => {
//     try {
//       const {
//         title,
//         category,
//         description,
//         price,
//         color,
//         fabric,
//         sleeves_type,
//         Polo_collar,
//         Round_neck,
//         Cloth_collar,
//         Readymade_collar,
//         full_sleeves,
//         half_sleeves,
//         printing_charges,
//         printing_area,
//         Product_code,
//         size,
//       } = req.body;

//       const newNote = {};

//       if (title) newNote.title = title;
//       if (category) newNote.category = category;
//       if (description) newNote.description = description;
//       if (fabric) newNote.fabric = fabric;
//       if (price) newNote.price = price;
//       if (color) newNote.color = color;
//       if (size) newNote.size = size;
//       if (Polo_collar !== undefined) newNote.Polo_collar = Polo_collar;
//       if (Round_neck !== undefined) newNote.Round_neck = Round_neck;
//       if (Cloth_collar !== undefined) newNote.Cloth_collar = Cloth_collar;
//       if (Readymade_collar !== undefined)
//         newNote.Readymade_collar = Readymade_collar;
//       if (printing_charges !== undefined)
//         newNote.printing_charges = printing_charges;
//       if (printing_area) newNote.printing_area = printing_area;
//       if (full_sleeves !== undefined) newNote.full_sleeves = full_sleeves;
//       if (half_sleeves !== undefined) newNote.half_sleeves = half_sleeves;
//       if (sleeves_type) newNote.sleeves_type = sleeves_type;
//       if (Product_code) newNote.Product_code = Product_code;

//       if (req.file) newNote.image = `uploads/${req.file.filename}`;

//       // Get the paths of the uploaded files from multer
//       if (req.files && req.files.length > 0) {
//         const imagePaths = req.files.map((file) => `uploads/${file.filename}`);
//         // Format image paths as a comma-separated string
//         const imageString = imagePaths.join(", ");
//         newNote.image = imageString;
//       }
      
//       // Find the existing note by ID
//       let note = await ProductSchema.findById(req.params.id);
//       if (!note) {
//         return res.status(404).send("Not Found");
//       }
      
//       // Update the note with new values
//       note = await ProductSchema.findByIdAndUpdate(
//         req.params.id,
//         { $set: newNote },
//         { new: true }
//       );
//       if (!note) {
//         return res.status(404).send("Note not found after update");
//       }

//       res.json({ note });
//     } catch (error) {
//       console.error("Error updating Teamwear:", error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

// //----------------------Route 3-----------------------
// //-----this route 3 is to delete the note : "localhost:5000/api/notes/deletenote/:id"
// router.delete(
//   "/delete/Product/:id",
//   //  fetchuser,
//   getMiddleware,
//   async (req, res) => {
//     try {
//       //Extract title, description, tag from req.body by using object destruction
//       // const { title, description, tag, image } = req.body;

//       //Find the note to be deleted and delete it
//       let note = await ProductSchema.findById(req.params.id); //params me jo id hai
//       if (!note) {
//         //agar params me id nahi hai to..
//         return res.status(404).send("Not Found");
//       }

//       //Allow deletion only id user owns this Note
//       // if (note.user.toString() !== req.user.id) {
//       //agar params me id nahi hai to..
//       // return res.status(401).send("Not Allowed");
//       // }

//       note = await ProductSchema.findByIdAndDelete(req.params.id);

//       res.json({
//         Sucess: "Note has been deleted",
//         note: note,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

// // -------------------------Route 3 : Search------------------------
// // localhost:5000/api/notes/fetchallSearched/Product?category=&Product_code=

// // router.get(
// //   "/fetchallSearched/Product",
// //   getMiddleware,
// //   async (req, res) => {
// //     try {
// //       const searchCategory = req.query.category || ""; // Get category from query parameters or set empty string
// //       const searchCode = req.query.Product_code || ""; // Get title from query parameters or set empty string

// //       const products = await ProductSchema.find({
// //         $and: [
// //           { category: { $regex: new RegExp(searchCategory, "i") } }, // Case-insensitive search for category
// //           { product_code: { $regex: new RegExp(searchCode, "i") } },       // Case-insensitive search for title
// //         ],
// //       }).sort({ _id: -1 }); // Sort the results by _id in descending order

// //       res.json(products);
// //     } catch (error) {
// //       console.error(error);
// //       res.status(500).send("Internal Server Error");
// //     }
// //   }
// // );
// // 0000
// router.get(
//   "/fetchallSearched/Product",
//   getMiddleware,
//   async (req, res) => {
//     try {
//       const searchCategory = req.query.category || ""; // Get category from query parameters or set empty string
//       const searchCode = req.query .Product_code || ""; // Get Product_code from query parameters or set empty string

//       const searchCriteria = {};

//       // Add search conditions only if category and Product_code are provided
//       if (searchCategory) {
//         searchCriteria.category = { $regex: new RegExp(searchCategory, "i") }; // Case-insensitive search for category
//       }
//       if (searchCode) {
//         searchCriteria.Product_code = { $regex: new RegExp(searchCode, "i") }; // Case-insensitive search for Product_code
//       }

//       const products = await ProductSchema.find(searchCriteria).sort({ _id: -1 }); // Sort the results by _id in descending order

//       if (products.length === 0) {
//         return res.status(404).json({ message: "No products found." });
//       }

//       res.json(products);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );



// //  ---------------Route 4: Search and Sort--------------
// //    //SearchAndSort?sort=asc
// //    //SearchAndSort?sort=desc
// //    //SearchAndSort?title=Jeans&sort=asc
// //    //SearchAndSort?title=Jeans&sort=desc

// router.get(
//   "/SearchAndSort/Product",
//   fetchuser,
//   getMiddleware,
//   async (req, res) => {
//     try {
//       // Extract the title and sort parameters from the query string
//       const { title, sort } = req.query;

//       // Build the filter object based on the title parameter
//       const filter = { user: req.user.id };
//       if (title) {
//         filter.title = title;
//       }

//       // Build the sort object based on the sort parameter
//       let sortOption = {};
//       if (sort === "asc") {
//         sortOption = { price: 1 }; // Ascending order
//       } else if (sort === "desc") {
//         sortOption = { price: -1 }; // Descending order
//       }

//       // Use the filter and sort objects in the Note.find method
//       const notes = await ProductSchema.find(filter).sort(sortOption);

//       // Send the filtered and sorted notes array as a JSON response
//       res.json(notes);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

// // ----------------------- Route 5 ---------------------------
// // Endpoint to fetch a product by ID
// router.get("/fetch/Product/:id", getMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params; // Get the ID from the request parameters
//     const product = await ProductSchema.findById(id); // Find the document by ID

//     // Check if the product was found
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Return the product if found
//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     // Handle invalid ID format
//     if (error.kind === "ObjectId") {
//       return res.status(400).json({ message: "Invalid product ID" });
//     }
//     res.status(500).send("Internal Server Error");
//   }
// });

// module.exports = router;


// ================= New Code ===================
// Import required packages
const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const getMiddleware = require("../middleware/GetMiddleware");
const ProductSchema = require("../models/Product");
const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const { multerS3 } = require("multer-s3");

// Create a new S3 client instance
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer to use multer-s3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

// Route to add a product with image upload
router.post("/add/Product", upload.array("image", 10), async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      fabric,
      price,
      color,
      size,
    } = req.body;

    // Map the uploaded files to their S3 URLs
    const imageUrls = req.files.map(file => file.location);

    // Create a new product instance
    const product = new ProductSchema({
      title,
      category,
      description,
      fabric,
      price,
      color,
      size,
      image: imageUrls.join(", "), // Store image URLs as a comma-separated string
    });

    // Save the product to the database
    const savedProduct = await product.save();
    res.json(savedProduct); // Send the saved product as a response
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to update an existing product
router.put("/update/Product/:id", getMiddleware, upload.array("image", 10), async (req, res) => {
  try {
    const { title, category, description, price, color, fabric, size } = req.body;

    const newProduct = {};
    if (title) newProduct.title = title;
    if (category) newProduct.category = category;
    if (description) newProduct.description = description;
    if (fabric) newProduct.fabric = fabric;
    if (price) newProduct.price = price;
    if (color) newProduct.color = color;
    if (size) newProduct.size = size;

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.location);
      newProduct.image = imageUrls.join(", ");
    }

    let product = await ProductSchema.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product Not Found");
    }

    product = await ProductSchema.findByIdAndUpdate(req.params.id, { $set: newProduct }, { new: true });
    res.json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to delete a product
router.delete("/delete/Product/:id", getMiddleware, async (req, res) => {
  try {
    let product = await ProductSchema.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product Not Found");
    }

    await ProductSchema.findByIdAndDelete(req.params.id);
    res.json({ Success: "Product has been deleted", product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to fetch a product by ID
router.get("/fetch/Product/:id", getMiddleware, async (req, res) => {
  try {
    const product = await ProductSchema.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).send("Internal Server Error");
  }
});




module.exports = router;
