// Get references to the HTML elements you'll interact with:
const booksListDiv = document.getElementById("booksList");
const fetchBooksBtn = document.getElementById("fetchBooksBtn");
const messageDiv = document.getElementById("message"); // Get reference to the message div
const apiBaseUrl = "http://localhost:3000";

// Function to fetch books from the API and display them
async function fetchBooks() {
  try {
    booksListDiv.innerHTML = "Loading books..."; // Show loading state
    messageDiv.textContent = ""; // Clear any previous messages (assuming a message div exists or add one)

    // Make a GET request to your API endpoint
    const response = await fetch(`${apiBaseUrl}/books`);

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      // Attempt to read error body if available, otherwise use status text
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    // Parse the JSON response
    const books = await response.json();

    // Clear previous content and display books
    booksListDiv.innerHTML = ""; // Clear loading message
    if (books.length === 0) {
      booksListDiv.innerHTML = "<p>No books found.</p>";
    } else {
      books.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-item");
        // Use data attributes or similar to store ID on the element if needed later
        bookElement.setAttribute("data-book-id", book.id);
        bookElement.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>ID: ${book.id}</p>
                    <button onclick="viewBookDetails(${book.id})">View Details</button>
                    <button onclick="editBook(${book.id})">Edit</button>
                    <button class="delete-btn" data-id="${book.id}">Delete</button>
                `;
        booksListDiv.appendChild(bookElement);
      });
      // Add event listeners for delete buttons after they are added to the DOM
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleDeleteClick);
      });
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    booksListDiv.innerHTML = `<p style="color: red;">Failed to load books: ${error.message}</p>`;
  }
}

// GET (View Details): fetch and show a single book by ID
async function viewBookDetails(bookId) {
  try {
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`);

    if (!response.ok) {
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    const book = await response.json();
    alert(`Book Details\n\nID: ${book.id}\nTitle: ${book.title}\nAuthor: ${book.author}`);
  } catch (error) {
    console.error("Error fetching book details:", error);
    messageDiv.textContent = `Failed to fetch book details: ${error.message}`;
    messageDiv.style.color = "red";
  }
}

function editBook(bookId) {
  console.log("Edit book with ID:", bookId);
  // In a real app, redirect to edit.html with the book ID
  window.location.href = `edit.html?id=${bookId}`; // Assuming you create edit.html
}

// DELETE: remove book via API and refresh list
async function handleDeleteClick(event) {
  const bookId = event.target.getAttribute("data-id");
  console.log("Attempting to delete book with ID:", bookId);
  // --- Start of code for learners to complete ---
  // TODO: Implement the fetch DELETE request here
  if (!confirm(`Delete book with ID ${bookId}?`)) {
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`, {
      method: "DELETE",
    });

  // TODO: Handle success (204) and error responses (404, 500)
    if (response.status === 204) {
      messageDiv.textContent = `Book ${bookId} deleted successfully.`;
      messageDiv.style.color = "green";
      // TODO: On successful deletion, remove the book element from the DOM
      fetchBooks();
      return;
    }

    const errorBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : { error: response.statusText };

    if (response.status === 404) {
      messageDiv.textContent = errorBody.error || "Book not found.";
      messageDiv.style.color = "red";
      return;
    }

    if (response.status === 500) {
      messageDiv.textContent = errorBody.error || "Server error deleting book.";
      messageDiv.style.color = "red";
      return;
    }

    messageDiv.textContent =
      errorBody.error || `Unexpected delete error (status ${response.status}).`;
    messageDiv.style.color = "red";
  } catch (error) {
    console.error("Error deleting book:", error);
    messageDiv.textContent = `Failed to delete book: ${error.message}`;
    messageDiv.style.color = "red";
  }
  // TODO: On successful deletion, remove the book element from the DOM
  // --- End of code for learners to complete ---
}

// Fetch books when the button is clicked
fetchBooksBtn.addEventListener("click", fetchBooks);

// Optionally, fetch books when the page loads
// window.addEventListener('load', fetchBooks); // Or call fetchBooks() directly