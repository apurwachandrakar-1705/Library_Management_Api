const express = require("express");
const router = express.Router();
const Book = require("../models/book");
// ROUTES......
// GET METHODS.....
// 1) get all books
router.get("/", async (req, res) => {
  const bookDetail = await Book.find();
  if (!bookDetail) {
    return res.status(400).send({ msg: "Cannot Able to find books..." });
  }
  res.status(200).send(bookDetail);
});

// 2) get book by id
router.get("/:id", async (req, res) => {
  const bookDetail = await Book.findById(req.params.id);
  if (!bookDetail) {
    return res.status(400).send({ msg: "Cannot Able to find books..." });
  }
  res.status(200).send(bookDetail);
});

//  3) get books by author
router.get("/:author", async (req, res) => {
  const author = req.params.author; // Access the 'author' parameter from the URL

  console.log("Author being searched for:", author); // Log for debugging

  try {
    // Make sure you're querying the 'author' field, not '_id'
    const bookDetail = await Book.aggregate([
      { $match: { author: { $regex: new RegExp(req.params.author, "i") } } },
    ]);

    if (bookDetail.length === 0) {
      return res.status(404).send({ msg: "No books found for this author." });
    }

    res.status(200).send(bookDetail); // Return the found books
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ msg: "Server error", error: err.message });
  }
});

// Post METHOD
router.post("/", async (req, res) => {
  let newBook = new Book({
    bookName: req.body.bookName,
    author: req.body.author,
    description: req.body.description,
    price: req.body.price,
    publishedYear: req.body.publishedYear,
    bookQuantity: req.body.bookQuantity,
    isBorrowed: req.body.isBorrowed,
  });
  if (!newBook) {
    return res.status(400).send({ msg: "Unable to add book..." });
  }
  newBook = await newBook.save();
  res.status(200).send({ msg: "successfully added..." });
});

// put mETHOD....

// 1) update price and quantity

router.put("/:id", async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    {
      price: req.body.price,
      bookQuantity: req.body.bookQuantity,
    },
    { new: true }
  );
  if (!updatedBook) {
    return res.status(400).send({ msg: "unable to update" });
  }
  res.status(200).send(updatedBook);
});

router.delete("/:id", (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).send({ msg: "deleted book... " }))
    .catch((err) => res.status(400).send(err));
});
module.exports = router;
