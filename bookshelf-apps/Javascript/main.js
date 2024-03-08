document.addEventListener("DOMContentLoaded", function () {
    const inputBookForm = document.getElementById("inputBook");
    const searchBookForm = document.getElementById("searchBook");

    inputBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    searchBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBook();
    });

    loadBooks();

    function addBook() {
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = parseInt(document.getElementById("inputBookYear").value);
        const isComplete = document.getElementById("inputBookIsComplete").checked;

        const book = {
            id: generateUniqueId(),
            title: title,
            author: author,
            year: year,
            isComplete: isComplete
        };

        if (isComplete) {
            addToCompleteShelf(book);
        } else {
            addToIncompleteShelf(book);
        }

        saveBookToLocalStorage(book); 
        inputBookForm.reset();
    }

    function addToIncompleteShelf(book) {
        const shelf = document.getElementById("incompleteBookshelfList");
        const bookItem = createBookItem(book);
        shelf.appendChild(bookItem);
    }

    function addToCompleteShelf(book) {
        const shelf = document.getElementById("completeBookshelfList");
        const bookItem = createBookItem(book);
        shelf.appendChild(bookItem);
    }

    function createBookItem(book) {
        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");
        bookItem.id = book.id;

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.textContent = "Penulis: " + book.author;

        const year = document.createElement("p");
        year.textContent = "Tahun: " + book.year;

        const action = document.createElement("div");
        action.classList.add("action");

        const toggleButton = document.createElement("button");
        toggleButton.textContent = book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
        toggleButton.classList.add(book.isComplete ? "green" : "red");
        toggleButton.addEventListener("click", function () {
            toggleBookStatus(book.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Hapus buku";
        deleteButton.classList.add("red");
        deleteButton.addEventListener("click", function () {
            deleteBook(book.id);
        });

        action.appendChild(toggleButton);
        action.appendChild(deleteButton);

        bookItem.appendChild(title);
        bookItem.appendChild(author);
        bookItem.appendChild(year);
        bookItem.appendChild(action);

        return bookItem;
    }

    function toggleBookStatus(bookId) {
        const bookItem = document.getElementById(bookId);
        const isComplete = bookItem.querySelector(".action button").textContent === "Belum selesai di Baca";

        if (isComplete) {
            document.getElementById("incompleteBookshelfList").appendChild(bookItem);
        } else {
            document.getElementById("completeBookshelfList").appendChild(bookItem);
        }

        bookItem.querySelector(".action button").textContent = isComplete ? "Selesai dibaca" : "Belum selesai di Baca";
        bookItem.querySelector(".action button").classList.toggle("green");
        bookItem.querySelector(".action button").classList.toggle("red");

        updateBookInLocalStorage(bookId, { isComplete: !isComplete }); // Update book status in localStorage
    }

    function deleteBook(bookId) {
        Swal.fire({
            title: "Apakah Anda yakin ingin menghapus buku ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus saja!",
            cancelButtonText: "Tidak, batalkan!"
        }).then((result) => {
            if (result.isConfirmed) {
                const bookItem = document.getElementById(bookId);
                bookItem.parentNode.removeChild(bookItem);
                removeBookFromLocalStorage(bookId);
                Swal.fire("Buku dihapus!", "", "success");
            }
        });
    }
    
    
    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }

    function searchBook() {
        const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
        const bookItems = document.querySelectorAll(".book_item h3");
        bookItems.forEach(function (item) {
            const title = item.textContent.toLowerCase();
            const bookItem = item.closest(".book_item");
            if (title.includes(searchTitle)) {
                bookItem.style.display = "block";
            } else {
                bookItem.style.display = "none";
            }
        });
    }

    function saveBookToLocalStorage(book) {
        let books = JSON.parse(localStorage.getItem("books")) || [];
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    function loadBooks() {
        let books = JSON.parse(localStorage.getItem("books")) || [];
        books.forEach(function (book) {
            if (book.isComplete) {
                addToCompleteShelf(book);
            } else {
                addToIncompleteShelf(book);
            }
        });
    }

    function updateBookInLocalStorage(bookId, updatedProperties) {
        let books = JSON.parse(localStorage.getItem("books")) || [];
        const index = books.findIndex(book => book.id === bookId);
        if (index !== -1) {
            books[index] = { ...books[index], ...updatedProperties };
            localStorage.setItem("books", JSON.stringify(books));
        }
    }
    
    function removeBookFromLocalStorage(bookId) {
        let books = JSON.parse(localStorage.getItem("books")) || [];
        const index = books.findIndex(book => book.id === bookId);
        if (index !== -1) {
            books.splice(index, 1);
            localStorage.setItem("books", JSON.stringify(books));
        }
    }
});
