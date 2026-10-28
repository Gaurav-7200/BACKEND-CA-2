// const express = require("express");
// const mongoose = require("mongoose");

// const app = express();

// app.use(express.json());

// mongoose.connect("mongodb://127.0.0.1:27017/library")
//     .then(() => {
//         console.log("MongoDB connected");
//     })
//     .catch((err) => {
//         console.log("MongoDB connection error");
//     });


// const bookSchema = new mongoose.Schema({
//     title: String,
//     author: String,
//     category: String,
//     availability: {
//         type: Boolean,
//         default: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });


// const Book = mongoose.model("Book", bookSchema);


// app.post("/api/books", async (req, res) => {
//     try {
//         const title = req.body.title;
//         const author = req.body.author;
//         const category = req.body.category;

//         if (!title) {
//             return res.status(400).json({
//                 message: "Title is required"
//             });
//         }

//         const book = new Book({
//             title: title,
//             author: author,
//             category: category
//         });

//         await book.save();

//         res.status(201).json({
//             message: "Book added successfully",
//             book: book
//         });
//     }
//     catch (err) {
//         res.status(500).json({
//             message: "Something went wrong"
//         });
//     }
// });



// app.get("/api/books", async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 5;

//         const skip = (page - 1) * limit;

//         const books = await Book.find()
//             .skip(skip)
//             .limit(limit);

//         const total = await Book.countDocuments();

//         res.status(200).json({
//             currentPage: page,
//             totalRecords: total,
//             books: books
//         });
//     }
//     catch (err) {
//         res.status(500).json({
//             message: "Error getting books"
//         });
//     }
// });



// app.patch("/api/books/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const availability = req.body.availability;

//         const book = await Book.findByIdAndUpdate(
//             id,
//             { availability: availability },
//             { new: true }
//         );

//         if (!book) {
//             return res.status(404).json({
//                 message: "Book not found"
//             });
//         }

//         res.status(200).json({
//             message: "Availability updated",
//             book: book
//         });
//     }
//     catch (err) {
//         res.status(500).json({
//             message: "Error updating book"
//         });
//     }
// });



// app.listen(3000, () => {
//     console.log("Server running on port 3000");
// });

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/library")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection error");
    });

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: String,
    category: String,
    availability: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Book = mongoose.model("Book", bookSchema);


app.post("/api/books", async (req, res) => {
    try {
        const title = req.body.title;
        const author = req.body.author;
        const category = req.body.category;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const book = new Book({
            title: title,
            author: author,
            category: category
        });

        await book.save();

        res.status(201).json({
            message: "Book added successfully",
            book: book
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});

app.get("/api/books", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const books = await Book.find()
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments();

        res.status(200).json({
            currentPage: page,
            totalRecords: total,
            books: books
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error getting books"
        });
    }
});

app.patch("/api/books/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const availability = req.body.availability;

        if (typeof availability !== "boolean") {
            return res.status(400).json({
                message: "Availability must be true or false"
            });
        }

        const book = await Book.findByIdAndUpdate(
            id,
            { availability: availability },
            { new: true }
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Availability updated",
            book: book
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error updating book"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
