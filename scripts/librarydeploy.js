const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  // Deploy the Library contract
  const Library = await ethers.getContractFactory("Library");
  const library = await Library.deploy(deployer.address);

  console.log("Library contract deployed to:", library.address);

  await addBook(library);
  await updateBook(library);
  await deleteBook(library);
  await getBook(library);
}

async function addBook(library) {
  // Add books to the Library contract
  const adminAddress = await library.admin();
  console.log(`Admin address: ${adminAddress}`);

  const book1 = {
    ISBN: "1234567890",
    title: "Sample Book",
    year: 2023,
    author: "John Doe",
  };

  const book2 = {
    ISBN: "567891011",
    title: "Fruits",
    year: 2022,
    author: "Christian",
  };

  // Make sure to sign the transaction as the admin
  const admin = await ethers.getSigner(adminAddress);

  const tx1 = await library.connect(admin).addBook(
    book1.ISBN,
    book1.title,
    book1.year,
    book1.author
  );

  const tx2 = await library.connect(admin).addBook(
    book2.ISBN,
    book2.title,
    book2.year,
    book2.author
  );

  await tx1.wait();
  await tx2.wait();

  console.log("Books added to the Library contract");
}

async function updateBook(library) {
    // Update a book in the Library contract
    const adminAddress = await library.admin();
    const admin = await ethers.getSigner(adminAddress);
  
    const updatedBook = {
      ISBN: "1234567890",
      title: "Sports",
      year: 2021,
      author: "Albert",
    };
  
    const tx = await library.connect(admin).updateBook(
      updatedBook.ISBN,
      updatedBook.title,
      updatedBook.year,
      updatedBook.author
    );
  
    await tx.wait();
  
    console.log("Book updated in the Library contract");
  }
  
  async function deleteBook(library) {
    // Delete a book from the Library contract
    const adminAddress = await library.admin();
    const admin = await ethers.getSigner(adminAddress);
  
    const ISBNToDelete = "567891011";
  
    const tx = await library.connect(admin).deleteBook(ISBNToDelete);
  
    await tx.wait();
  
    console.log("Book deleted from the Library contract");
  }
  
  async function getBook(library) {
    // Get information about a book from the Library contract
    const ISBNToRetrieve = "1234567890";
    const bookInfo = await library.getBook(ISBNToRetrieve);
  
    console.log("Book Info:");
    console.log("ISBN:", bookInfo.ISBN);
    console.log("Title:", bookInfo.title);
    console.log("Year:", bookInfo.year);
    console.log("Author:", bookInfo.author);
  }  

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()

  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
