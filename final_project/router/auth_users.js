const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  // A valid username should be a non-empty string
  return typeof username === 'string' && username.trim().length > 0;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  // A valid user should have a username and password that match an existing user
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

      const username = req.body.username;
      const password = req.body.password;
  
      // Check if username or password is missing
      if (!username || !password) {
          return res.status(404).json({ message: "Error logging in" });
      }
  
      // Authenticate user
      if (authenticatedUser(username, password)) {
          // Generate JWT access token
          let accessToken = jwt.sign({
              data: password
          }, 'access', { expiresIn: 60 * 60 });
  
          // Store access token and username in session
          req.session.authorization = {
              accessToken, username
          }
          return res.status(200).send("User successfully logged in");
      } else {
          return res.status(208).json({ message: "Invalid Login. Check username and password" });
      }



});



// example url // http://localhost:5000/customer/auth/review/1234567890
// input example // { "username": "john_doe", "review": "Great book!" }
// url example // http://localhost:5000/customer/auth/review/1234567890
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.body.username;
  // Check if the book exists
  if (!books[isbn]) { 
    return res.status(404).json({ message: "Book not found" });
  }
  // Check if the review is valid
  if (!review || typeof review !== 'string' || review.trim().length === 0
      || !username || typeof username !== 'string' || username.trim().length === 0) {
    return res.status(400).json({ message: "Invalid review or username" });
  }
  // Add the review to the book
  if (!books[isbn].reviews) { 
    books[isbn].reviews = {}; // Initialize reviews object if it doesn't exist
  }   

  // Add or update the review by username
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added successfully", book: books[isbn] });

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
//url example // http://localhost:5000/customer/auth/review/2
  // input example // { "username": "john_doe" }

  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  const isbn = req.params.isbn;
  const username = req.body.username;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has a review for this book
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  // Delete the review by username
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", book: books[isbn] });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
