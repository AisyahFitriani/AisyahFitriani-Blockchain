const { expect } = require("chai");

describe("Library", function () {
  let library;
  let admin;
  const ISBN = "1234567890";
  const title = "Sample Book";
  const year = 2023;
  const author = "John Doe";

  before(async function () {
    // Deploy Library contract and get the admin account
    [admin] = await ethers.getSigners();
    let Library = await ethers.getContractFactory("Library");
    library = await Library.deploy();
  });

  describe("addBook", function () {
    it("Should add a book successfully", async function () {
      await library.addBook(ISBN, title, year, author);
      const book = await library.books(ISBN);
      expect(book.ISBN).to.equal(ISBN);
      expect(book.title).to.equal(title);
      expect(book.year).to.equal(year);
      expect(book.author).to.equal(author);
    });

    it("Should revert if book with same ISBN already exists", async function () {
      await expect(
        library.addBook(ISBN, "Another Book", 2024, "Jane Smith")
      ).to.be.revertedWith("Book with this ISBN already exists");
    });
  });

  describe("updateBook", function () {
    it("Should update a book successfully", async function () {
      const newTitle = "Updated Book";
      await library.updateBook(ISBN, newTitle, 2025, "Alice Johnson");
      const book = await library.books(ISBN);
      expect(book.title).to.equal(newTitle);
    });

    it("Should revert if book does not exist", async function () {
      await expect(
        library.updateBook("9876543210", "Updated Book", 2025, "Alice Johnson")
      ).to.be.revertedWith("Book with this ISBN does not exist");
    });
  });

  describe("deleteBook", function () {
    it("Should delete a book successfully", async function () {
      await library.deleteBook(ISBN);
      const book = await library.books(ISBN);
      expect(book.ISBN).to.equal("");
    });

    it("Should revert if book does not exist", async function () {
      await expect(library.deleteBook("9876543210")).to.be.revertedWith(
        "Book with this ISBN does not exist"
      );
    });
  });

  describe("getBook", function () {
    it("Should retrieve book information successfully", async function () {
      await library.addBook(ISBN, title, year, author);
      const [isbn, bookTitle, bookYear, bookAuthor] = await library.getBook(
        ISBN
      );
      expect(isbn).to.equal(ISBN);
      expect(bookTitle).to.equal(title);
      expect(bookYear).to.equal(year);
      expect(bookAuthor).to.equal(author);
    });

    it("Should revert if book does not exist", async function () {
      await expect(library.getBook("9876543210")).to.be.revertedWith(
        "Book with this ISBN does not exist"
      );
    });
  });
});
