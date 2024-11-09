// bismillah bisa
document.addEventListener("DOMContentLoaded", function () {
  // dapetin element HTML
  const bookForm = document.getElementById("bookForm");
  const bookFormSubmit = document.getElementById("bookFormSubmit");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  // bikin array buat nyimpen daftar bukunya
  let books = [];

  // meriksa data buku di localstorage
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks);
  }

  // fungsi buat nyimpen data buku ke localstorage
  function saveBooksToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  // handle submit form buat manbahin bukunya
  bookForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // dapertin nilai input form
    const bookFormTitle = document.getElementById("bookFormTitle").value;
    const bookFormAuthor = document.getElementById("bookFormAuthor").value;
    const bookFormYear = document.getElementById("bookFormYear").value;
    const bookFormIsComplete =
      document.getElementById("bookFormIsComplete").checked;

    // meriksa buku apakah judul yang sama udah ada
    const isDuplicate = books.some((book) => book.title === bookFormTitle);

    if (isDuplicate) {
      alert("Buku dengan judul yang sama sudah ada di dalam daftar!!!");
    } else {
      // bikin object buku baru
      const book = {
        id: new Date().getTime(),
        title: bookFormTitle,
        author: bookFormAuthor,
        year: bookFormYear,
        isComplete: bookFormIsComplete,
      };

      // nambahin buku ke daftar dan nyimpen ke localstorage
      books.push(book);
      saveBooksToLocalStorage();
      // perbarui tampilan rak bukunya
      updateBookShelf();

      // kosongin input form kalo udah ditambahin bukunya
      document.getElementById("bookFormTitle").value = "";
      document.getElementById("bookFormAuthor").value = "";
      document.getElementById("bookFormYear").value = "";
      document.getElementById("bookFormIsComplete").checked = false;
    }
  });

  // fungsi buat memperbarui tampilan rak buku
  function updateBookShelf() {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    for (const book of books) {
      const bookItem = createBookItem(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookItem);
      } else {
        incompleteBookList.appendChild(bookItem);
      }
    }
    saveBooksToLocalStorage();
  }

  // buat menghapus buku berdasarkan idnya
  function removeBook(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        alert('anda yakin akan menghapus buku tersebut ?')
      books.splice(index, 1);
      saveBooksToLocalStorage();
      updateBookShelf();
    }
  }

  // fungsi untuk mengganti status selesai / belum selesai membaca bukunya
  function toggleIsComplete(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books[index].isComplete = !books[index].isComplete;
      saveBooksToLocalStorage();
      updateBookShelf();
    }
  }

  // handle submit form untuk pencarian buku
  const searchBook = document.getElementById("searchBook");
  const searchBookTitle = document.getElementById("searchBookTitle");

  searchBook.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchBookTitle.value.toLowerCase().trim();

    const searchResult = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.year.toString().includes(query)
      );
    });
    updateSearchResults(searchResult);
  });

  // fungsi buat perbarui tampilan hasil pencarian
  function updateSearchResults(result) {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    for (const book of result) {
      const bookItem = createBookItem(book);
      const childBookItem = createBookItem(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookItem);
        completeBookList.appendChild(childBookItem);
      } else {
        incompleteBookList.appendChild(bookItem);
        incompleteBookList.appendChild(childBookItem);
      }
    }
  }

  // fungsi untuk bikin element buku daftar
  function createBookItem(book) {
    const bookItem = document.createElement("div");
    bookItem.className = "book-item";

    const actionButtons = document.createElement("div");
    actionButtons.className = "action";

    const title = document.createElement("h3");
    title.textContent = book.title;
    title.style.color = "#eb5e28";

    const author = document.createElement("p");
    author.textContent = "Penulis : " + book.author;
    author.style.color = "#ccc5b9";
    author.style.marginBottom = "10px";

    const year = document.createElement("p");
    year.textContent = "Tahun : " + book.year;
    year.style.color = "#ccc5b9";
    year.style.marginBottom = "1rem";

    const removeButton = createActionButton("Hapus", "red", function () {
      removeBook(book.id);
    });

    let toggleButton;
    if (book.isComplete) {
      toggleButton = createActionButton(
        "Belum selesai dibaca",
        "green",
        function () {
          toggleIsComplete(book.id);
        }
      );
    } else {
      toggleButton = createActionButton("Selesai dibaca", "red", function () {
        toggleIsComplete(book.id);
      });
    }

    removeButton.style.padding = "10px";
    removeButton.style.margin = "10px";
    removeButton.style.borderRadius = "10px";
    removeButton.style.border = "0";
    removeButton.style.backgroundColor = "#eb5e28";
    removeButton.style.color = "white";
    removeButton.style.fontWeight = "bold";

    toggleButton.style.padding = "10px";
    toggleButton.style.borderRadius = "10px";
    toggleButton.style.border = "0";
    toggleButton.style.backgroundColor = "#1d1d1d";
    toggleButton.style.color = "white";
    toggleButton.style.fontWeight = "bold";

    actionButtons.appendChild(toggleButton);
    actionButtons.appendChild(removeButton);

    bookItem.appendChild(title);
    bookItem.appendChild(author);
    bookItem.appendChild(year);
    bookItem.appendChild(actionButtons);

    return bookItem;
  }

  // Fungsi untuk membuat elemen tombol aksi
  function createActionButton(text, className, clickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener("click", clickHandler);
    return button;
  }

  // Memperbarui tampilan rak buku saat halaman dimuat
  updateBookShelf();
});
