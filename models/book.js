const mongoose = require("mongoose");
const bookSchema = mongoose.Schema({
  bookName: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  publishedYear: {
    type: "String",
    default: "unknown",
  },
  bookQuantity: {
    type: Number,
    default: 1,
  },
  isBorrowed: {
    type: Boolean,
    default: false,
  },
//   borrowedBy:{
//     type:mongoose.Schema.ObjectId,
//     ref:'User',
//     default:''
//   }
});
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
