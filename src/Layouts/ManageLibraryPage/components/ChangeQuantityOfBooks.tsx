import { useEffect, useState } from "react";
import BookModel from "../../../Models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";

export const ChangeQuantityOfBooks = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [bookDelete, setBookDelete] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `http://localhost:8080/api/books?page=${currentPage - 1}&size=${booksPerPage}`

            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error("something went wrong");
            }

            const responseJSONs = await response.json();
            const responseData = responseJSONs._embedded.books;
            setTotalAmountOfBooks(responseJSONs.page.totalElements);
            setTotalPages(responseJSONs.page.totalPages);
            const loadedBooks: BookModel[] = [];
            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    img: responseData[key].img,
                });
            }
            setBooks(loadedBooks);
            setLoading(false);
        };
        fetchBooks().catch((error: any) => {
            setLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage, bookDelete]);

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ?
        booksPerPage * currentPage : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const deleteBook = () => setBookDelete(!bookDelete);

    if(isLoading){
        return(
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    return(
        <div className="container mt-5">
            {totalAmountOfBooks > 0 ?
                <>
                    <div className="mt-3">
                        <h3>Number of Result:({totalAmountOfBooks})</h3>
                        <p>
                            {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                        </p>
                        {Array.from({ length: books.length }, (_, i) =>
                            <ChangeQuantityOfBook book={books[i]} key={books[i].id} deleteBook={deleteBook}/>
                        )
                        }
                    </div>
                </>
                :
                ""
            }
            <div className="mt-2"></div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}