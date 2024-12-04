const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const getMiddleware = require("../middleware/GetMiddleware");
const ProductSchema = require("../models/Product");
const { body, validationResult } = require("express-validator");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
  // Note: 'bucket' is not a valid AWS SDK configuration property
});

const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // cb(null, Date.now().toString())
      cb(null, file.originalname);
    },
  }),
});

//......................................Route 1......................................................

// router.get("/fetchAll/Teamwork", getMiddleware, async (req, res) => {
//   try {
//     const notes = await ProductSchema.find();
//     res.json(notes);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

//--------------------------------Route 2: To add notes---------------------
//-------------Add a new note using Post request: "localhost:5000/api/notes/addnote"-----------------------

router.post(
  "/add/Product",
  // upload.single("image"),
  // upload.single('file');
  upload.array("image", 10),

  // fetchuser,
  getMiddleware,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("category", "Enter category").isLength({ min: 3 }),
    body("fabric", "Please enter fabric").isLength({ min: 1 }),
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("size", "Please choose any size").isLength({ min: 1 }),
    body("price", "Enter a price").isLength({ min: 1 }),
    body("color", "Please choose atleast 1 color").isLength({ min: 3 }),
    body("Polo_collar").optional(),
    body("Round_neck").optional(),
    body("Cloth_collar").optional(),
    body("Readymade_collar").optional(),
    body("printing_charges").optional(),
    body("printing_area").optional(),
    body("sleeves_type").optional(),
    body("Product_code").optional(),
    body("Product_Quantity").optional(),
  ],
  async (req, res) => {
    try {
      // Extract form data from the request
      const {
        title,
        category,
        description,
        fabric,
        price,
        color,
        sleeves_type,
        Polo_collar,
        Round_neck,
        Cloth_collar,
        Readymade_collar,
        full_sleeves,
        half_sleeves,
        printing_charges,
        printing_area,
        Product_code,
        Product_Quantity,
        size,
      } = req.body;
      console.log("this is my request body ", req.body);

      // Get the paths of the uploaded files from multer
      const imagePaths = req.files.map((file) => file.location);
      // Format image paths as a comma-separated string
      const imageString = imagePaths.join(", ");

      // If there are any validation errors, return them
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      // Create a new ProductSchema instance with the uploaded file path
      const note = new ProductSchema({
        title,
        category,
        description,
        price,
        color,
        fabric,
        image: imageString,
        sleeves_type,
        Polo_collar,
        Round_neck,
        Cloth_collar,
        Readymade_collar,
        full_sleeves,
        half_sleeves,
        printing_charges,
        printing_area,
        Product_code,
        Product_Quantity,
        size,
        // user: req.user.id,
      });
      // Save the new Teamwork entry to the database
      const savedNote = await note.save();
      console.log("This is my response", savedNote);

      // Return the saved note as the response
      res.json(savedNote);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);
// router.post(
//   "/add/Product",
//   upload.array("image", 10),
//   [
//     // Validation checks
//     body("title", "Enter a valid title").isLength({ min: 3 }),
//     body("category", "Enter category").isLength({ min: 3 }),
//     body("fabric", "Please enter fabric").isLength({ min: 1 }),
//     body("description", "Description must be at least 5 characters").isLength({ min: 5 }),
//     body("size", "Please choose any size").isLength({ min: 1 }),
//     body("price", "Enter a price").isLength({ min: 1 }),
//     body("color", "Please choose at least 1 color").isLength({ min: 3 }),
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

//       // Ensure that files were uploaded
//       let imagePaths = [];
//       if (req.files) {
//         imagePaths = req.files.map((file) => `uploads/${file.filename}`);
//       } else {
//         return res.status(400).json({ error: "No files uploaded" });
//       }

//       // Check for validation errors
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({
//           errors: errors.array(),
//         });
//       }

//       // Create a new product document
//       const product = new ProductSchema({
//         title,
//         category,
//         description,
//         price,
//         color,
//         fabric,
//         image: imagePaths.join(", "),
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
//       });

//       const savedProduct = await product.save();
//       res.json(savedProduct);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

//-------------Route 3 : update and existing note---------------
//------------"localhost:5000/api/notes/updatenote,/:id"-------------------------
router.put(
  "/update/Product/:id",
  getMiddleware,
  upload.array("image", 10),
  async (req, res) => {
    try {
      const {
        title,
        category,
        description,
        price,
        color,
        fabric,
        sleeves_type,
        Polo_collar,
        Round_neck,
        Cloth_collar,
        Readymade_collar,
        full_sleeves,
        half_sleeves,
        printing_charges,
        printing_area,
        Product_code,
        Product_Quantity,
        size,
      } = req.body;

      const newNote = {};

      if (title) newNote.title = title;
      if (category) newNote.category = category;
      if (description) newNote.description = description;
      if (fabric) newNote.fabric = fabric;
      if (price) newNote.price = price;
      if (color) newNote.color = color;
      if (size) newNote.size = size;
      if (Polo_collar !== undefined) newNote.Polo_collar = Polo_collar;
      if (Round_neck !== undefined) newNote.Round_neck = Round_neck;
      if (Cloth_collar !== undefined) newNote.Cloth_collar = Cloth_collar;
      if (Readymade_collar !== undefined)
        newNote.Readymade_collar = Readymade_collar;
      if (printing_charges !== undefined)
        newNote.printing_charges = printing_charges;
      if (printing_area) newNote.printing_area = printing_area;
      if (full_sleeves !== undefined) newNote.full_sleeves = full_sleeves;
      if (half_sleeves !== undefined) newNote.half_sleeves = half_sleeves;
      if (sleeves_type) newNote.sleeves_type = sleeves_type;
      if (Product_code) newNote.Product_code = Product_code;
      if (Product_Quantity) newNote.Product_Quantity = Product_Quantity;

      // Get the paths of the uploaded files from multer
      if (req.files && req.files.length > 0) {
        const imagePaths = req.files.map((file) => `uploads/${file.filename}`);
        // Format image paths as a comma-separated string
        newNote.image = imagePaths.join(", ");
      }

      // Find the existing product by ID
      let note = await ProductSchema.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Product Not Found");
      }

      // Update the product with new values
      note = await ProductSchema.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      if (!note) {
        return res.status(404).send("Product not found after update");
      }

      res.json({ note });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//----------------------Route 3-----------------------
//-----this route 3 is to delete the note : "localhost:5000/api/notes/deletenote/:id"

// router.delete("/delete/Product/:id", getMiddleware, async (req, res) => {
//   try {
//     // Find the product by ID
//     const product = await ProductSchema.findById(req.params.id);
//     if (!product) {
//       console.log("Product not found");
//       return res.status(404).send("Product not found");
//     }

//     // Extract image keys (assuming `product.image` is a comma-separated string of S3 keys)
//     const imageKeys = product.image.split(", ");
//     console.log("Image keys to delete:", imageKeys);

//     // Delete each image from S3
//     const deletePromises = imageKeys.map((key) => {
//       const params = {
//         Bucket: BUCKET_NAME,
//         Key: process.env.ACCESS_KEY
//       };
//       console.log(`Deleting image with key: ${key}`);
//       return s3.deleteObject(params).promise();
//     });

//     // Wait for all delete operations to complete
//     await Promise.all(deletePromises).catch((error) => {
//       console.error("Error deleting images from S3:", error);
//       throw error;
//     });

//     // Delete product from the database
//     await ProductSchema.findByIdAndDelete(req.params.id);
//     console.log("Product deleted from database");

//     res.json({
//       Success: "Product and associated images have been deleted",
//       product: product,
//     });
//   } catch (error) {
//     console.error("Error deleting product or images:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

router.delete(
  "/delete/Product/:id",
  //  fetchuser,
  getMiddleware,
  async (req, res) => {
    try {
      //Extract title, description, tag from req.body by using object destruction
      // const { title, description, tag, image } = req.body;

      //Find the note to be deleted and delete it
      let note = await ProductSchema.findById(req.params.id); //params me jo id hai
      if (!note) {
        //agar params me id nahi hai to..
        return res.status(404).send("Not Found");
      }

      //Allow deletion only id user owns this Note
      // if (note.user.toString() !== req.user.id) {
      //agar params me id nahi hai to..
      // return res.status(401).send("Not Allowed");
      // }

      note = await ProductSchema.findByIdAndDelete(req.params.id);

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
// localhost:5000/api/notes/fetchallSearched/Product?category=&Product_code=

// router.get(
//   "/fetchallSearched/Product",
//   getMiddleware,
//   async (req, res) => {
//     try {
//       const searchCategory = req.query.category || ""; // Get category from query parameters or set empty string
//       const searchCode = req.query.Product_code || ""; // Get title from query parameters or set empty string

//       const products = await ProductSchema.find({
//         $and: [
//           { category: { $regex: new RegExp(searchCategory, "i") } }, // Case-insensitive search for category
//           { product_code: { $regex: new RegExp(searchCode, "i") } },       // Case-insensitive search for title
//         ],
//       }).sort({ _id: -1 }); // Sort the results by _id in descending order

//       res.json(products);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );
// 0000
router.get("/fetchallSearched/Product", getMiddleware, async (req, res) => {
  try {
    const searchCategory = req.query.category || "";
    const searchCode = req.query.Product_code || "";

    const searchCriteria = {};

    if (searchCategory) {
      searchCriteria.category = { $regex: new RegExp(searchCategory, "i") };
    }
    if (searchCode) {
      searchCriteria.Product_code = { $regex: new RegExp(searchCode, "i") };
    }

    // Fetch products based on the search criteria
    const products = await ProductSchema.find(searchCriteria).sort({ _id: -1 });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found." });
    }

    // Send the products as the response, including the image URLs
    res.json(products);
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

router.get(
  "/SearchAndSort/Product",
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
      const notes = await ProductSchema.find(filter).sort(sortOption);

      // Send the filtered and sorted notes array as a JSON response
      res.json(notes);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ----------------------- Route 5 ---------------------------
// Endpoint to fetch a product by ID
router.get("/fetch/Product/:id", getMiddleware, async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the request parameters
    const product = await ProductSchema.findById(id); // Find the document by ID

    // Check if the product was found
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return the product if found
    res.json(product);
  } catch (error) {
    console.error(error);
    // Handle invalid ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
