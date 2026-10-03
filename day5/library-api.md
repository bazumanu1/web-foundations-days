# Library Books API

Base path: `/api/v1`

## Endpoints

- **List books**
  - Method and path: `GET /api/v1/books`
  - Description: Return a paginated list of books.
  - Success: `200 OK`

- **Get one book**
  - Method and path: `GET /api/v1/books/{bookId}`
  - Description: Return the book with the given ID.
  - Success: `200 OK`

- **Create a book**
  - Method and path: `POST /api/v1/books`
  - Description: Add a book to the library.
  - Example request body:
    ```json
    {
      "title": "The Left Hand of Darkness",
      "author": "Ursula K. Le Guin",
      "publishedYear": 1969,
      "isbn": "9780441007318"
    }
    ```
  - Success: `201 Created`

- **Update a book**
  - Method and path: `PATCH /api/v1/books/{bookId}`
  - Description: Update one or more fields on an existing book.
  - Example request body:
    ```json
    {
      "publishedYear": 1970
    }
    ```
  - Success: `200 OK`

- **Delete a book**
  - Method and path: `DELETE /api/v1/books/{bookId}`
  - Description: Remove the book with the given ID.
  - Success: `204 No Content`

- **List books by author**
  - Method and path: `GET /api/v1/books?author=Ursula%20K.%20Le%20Guin`
  - Description: Return books whose author matches the `author` query parameter.
  - Success: `200 OK`

## Error responses

- `400 Bad Request`: The create request is missing a required field, such as `title`.
- `404 Not Found`: The requested book ID does not exist, such as `GET /api/v1/books/9999`.