import { useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import ShelfCurrentLoans from "../../../Models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import BookModel from "../../../Models/BookModel";
import { LoanModal } from "./LoanModal";

export const Loans = () => {
    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    //current loans
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
    const [checkout, setCheckOut] = useState(false);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/currentloans`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const shelfCurrentLoansResponse = await fetch(url, requestOptions);
                if (!shelfCurrentLoansResponse.ok) {
                    throw new Error('Something Went Wrong!');
                }
                const data = await shelfCurrentLoansResponse.json();
                const shelfARRs: ShelfCurrentLoans[] = [];
                data.map((x: {
                    book: BookModel;
                    daysLeft: number;
                }) => {
                    shelfARRs.push({
                        book: x.book,
                        daysLeft: x.daysLeft,
                    });
                });
                setShelfCurrentLoans(data);
                setIsLoadingUserLoans(false);
            }
        }

        fetchUserCurrentLoans().catch((error: any) => {
            setIsLoadingUserLoans(false);
            setHttpError(error.message);
        });
        window.scrollTo(0, 0);
    }, [authState, checkout]);

    // useEffect(()=>{
    //     console.log(`setShelfCurrentLoans`, shelfCurrentLoans);
    //     setShelfCurrentLoans(shelfCurrentLoans);
    // },[shelfCurrentLoans]);

    if (isLoadingUserLoans) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>
                    {httpError}
                </p>
            </div>
        );
    }

    const returnBook = async(bookId:number) => {
        const url = `http://localhost:8080/api/books/secure/return?bookId=${bookId}`;
        const requestOptions = {
            method  :   'PUT',
            headers : {
                Authorization   : `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type'  : 'application/json'
            }
        };
        const returnResponse = await fetch(url, requestOptions);
        if(!returnResponse.ok){
            throw new Error("Something Went Wrong!")
        }
        setCheckOut(!checkout);
    }

    const renewLoan = async(bookId:number) => {
        const url = `http://localhost:8080/api/books/secure/renew/loan?bookId=${bookId}`;
        const requestOptions = {
            method  : 'PUT',
            headers : {
                Authorization   : `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type'  : 'application/json'
            }
        };
        const returnResponse = await fetch(url, requestOptions);
        if(!returnResponse.ok){
            throw new Error("Something Went Wrong!");
        }
        setCheckOut(!checkout);
    }

    return (
        <div>
            {/* Desktop */}
            <div className="d-none d-lg-block mt-2">
                {
                    shelfCurrentLoans.length > 0 ?
                        <>
                            <h5>
                                Current Loans: {shelfCurrentLoans.length}
                            </h5>
                            {
                                Array.from({ length: shelfCurrentLoans.length }, (_, i) =>
                                    <div key={shelfCurrentLoans[i].book.id}>
                                        <div className="row mt-3 mb-3">
                                            <div className="col-4 col-md-4 container">
                                                {
                                                    shelfCurrentLoans[i].book?.img ?
                                                        <img src={shelfCurrentLoans[i].book?.img} width='226' height='349' alt='Book' />
                                                        :
                                                        <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                                            width='226' height='349' alt='Book'
                                                        />
                                                }
                                            </div>
                                            <div className="card col-3 col-md-3 container d-flex">
                                                <div className="card-body">
                                                    <div className="mt-3">
                                                        <h4>Loans Options</h4>
                                                        {
                                                            shelfCurrentLoans[i].daysLeft > 0 &&
                                                            <p className="text-secondary">
                                                                Due In {shelfCurrentLoans[i].daysLeft} Days.
                                                            </p>
                                                        }
                                                        {
                                                            shelfCurrentLoans[i].daysLeft === 0 &&
                                                            <p className="text-success">
                                                                Due Today.
                                                            </p>
                                                        }
                                                        {
                                                            shelfCurrentLoans[i].daysLeft < 0 &&
                                                            <p className="text-danger">
                                                                Past due by {shelfCurrentLoans[i].daysLeft} Days.
                                                            </p>
                                                        }
                                                        <div className="list-group mt-3">
                                                            <button className="list-group-item list-group-item-action" aria-current='true'
                                                                data-bs-toggle='modal' data-bs-target={`#modal${shelfCurrentLoans[i].book.id}`}>
                                                                Manage Loans
                                                            </button>
                                                            <Link to={'search'} className='list-group-item list-group-item-action'>
                                                                Search More Books?
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <p className="mt-3 ">
                                                        Help Other Find Their Adventure by Reviewing Your Loans
                                                    </p>
                                                    <Link className="btn btn-primary" to={`/checkout/${shelfCurrentLoans[i].book.id}`}>
                                                        Leave A Review
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <LoanModal shelfCurrentLoan={shelfCurrentLoans[i]} mobile={false} 
                                        returnBook={returnBook} renewLoan={renewLoan}/>
                                    </div>
                                )
                            }
                        </>
                        :
                        <>
                            <h3 className="mt-3">
                                Currently No Loans
                            </h3>
                            <Link className='btn btn-primary' to={`search`}>
                                Search for A New Book
                            </Link>
                        </>
                }
            </div>
            {/* Mobile */}
            <div className="container d-lg-none mt-2">
                {
                    shelfCurrentLoans.length > 0 ?
                        <>
                            <h5 className='mb-3'>
                                Current Loans: {shelfCurrentLoans.length}
                            </h5>
                            {
                                Array.from({ length: shelfCurrentLoans.length }, (_, i) =>
                                    <div key={shelfCurrentLoans[i].book.id}>
                                        <div className="d-flex justify-content-center align-items-center">
                                            {
                                                shelfCurrentLoans[i].book?.img ?
                                                    <img src={shelfCurrentLoans[i].book?.img} width='226' height='349' alt='Book' />
                                                    :
                                                    <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                                        width='226' height='349' alt='Book'
                                                    />
                                            }
                                        </div>
                                        <div className="card d-flex mt-5 mb-3">
                                            <div className="card-body container">
                                                <div className="mt-3">
                                                    <h4>Loans Options</h4>
                                                    {
                                                        shelfCurrentLoans[i].daysLeft > 0 &&
                                                        <p className="text-secondary">
                                                            Due In {shelfCurrentLoans[i].daysLeft} Days.
                                                        </p>
                                                    }
                                                    {
                                                        shelfCurrentLoans[i].daysLeft === 0 &&
                                                        <p className="text-success">
                                                            Due Today.
                                                        </p>
                                                    }
                                                    {
                                                        shelfCurrentLoans[i].daysLeft < 0 &&
                                                        <p className="text-danger">
                                                            Past due by {shelfCurrentLoans[i].daysLeft} Days.
                                                        </p>
                                                    }
                                                    <div className="list-group mt-3">
                                                        <button className="list-group-item list-group-item-action" aria-current='true'
                                                            data-bs-toggle='modal' data-bs-target={`#mobilemodal${shelfCurrentLoans[i].book.id}`}>
                                                            Manage Loans
                                                        </button>
                                                        <Link to={'search'} className='list-group-item list-group-item-action'>
                                                            Search More Books?
                                                        </Link>
                                                    </div>
                                                </div>
                                                <hr />
                                                <p className="mt-3 ">
                                                    Help Other Find Their Adventure by Reviewing Your Loans
                                                </p>
                                                <Link className="btn btn-primary" to={`/checkout/${shelfCurrentLoans[i].book.id}`}>
                                                    Leave A Review
                                                </Link>
                                            </div>
                                        </div>
                                        <hr />
                                        <LoanModal shelfCurrentLoan={shelfCurrentLoans[i]} mobile={true} 
                                        returnBook={returnBook} renewLoan={renewLoan}/>
                                    </div>
                                )
                            }
                        </>
                        :
                        <>
                            <h3 className="mt-3">
                                Currently No Loans
                            </h3>
                            <Link className='btn btn-primary' to={`search`}>
                                Search for A New Book
                            </Link>
                        </>
                }
            </div>
        </div>
    );
}