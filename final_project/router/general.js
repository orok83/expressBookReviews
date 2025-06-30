const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if username is valid
  if (!(typeof username === 'string' && typeof password === 'string' && username.trim().length > 0 && password.trim().length > 0)) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  // Check if user already exists
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  // Add new user to the users array
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  const booksPromise = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    }
    else {
      reject({ message: "No books available" });
    }
  });

  booksPromise.then((books) => {
    res.status(200).json(books);
  }).catch((err) => {
    res.status(404).json(err);
  });

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  const bookPromise = new Promise((resolve, reject) => {
    if (book) {
      resolve(book);
    } else {
      reject({ message: "Book not found" });
    }
  });
  bookPromise.then((book) => {
    res.status(200).json(book);
  }).catch((err) => {
    res.status(404).json(err);
  });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

  const booksByAuthorPromise = new Promise((resolve, reject) => {
    const author = req.params.author;
    // Filter books by author
    const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject({ message: "No books found by this author" });
    }
  });

  booksByAuthorPromise.then((booksByAuthor) => {
    res.status(200).json(booksByAuthor);
  }).catch((err) => {
    res.status(404).json(err);
  });

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  bookByTitlePromise = new Promise((resolve, reject) => {
    // Get the title from request parameters
    if (!req.params.title) {
      reject({ message: "Title parameter is missing" });
    }
    // Filter books by title
    else {
      const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === req.params.title.toLowerCase());
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject({ message: "No books found with this title" });
      }
    }
  });
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
