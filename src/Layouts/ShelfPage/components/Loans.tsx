import { useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import ShelfCurrentLoans from "../../../Models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import BookModel from "../../../Models/BookModel";

export const Loans = () =>{
    const {authState} = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    //current loans
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);

    useEffect(()=>{
        const fetchUserCurrentLoans = async() =>{
            if(authState && authState.isAuthenticated){
                const url = `http://localhost:8080/api/books/secure/currentloans`;
                const requestOptions = {
                    method  : 'GET',
                    headers : {
                        Authorization   :   `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type'  :   'application/json'
                    }
                };
                const shelfCurrentLoansResponse =  await fetch(url, requestOptions);
                if(!shelfCurrentLoansResponse.ok){
                    throw new Error('Something Went Wrong!');
                }
                const shelfCurrentLoansResponseResponseJSONs = await shelfCurrentLoansResponse.json();
                const shelfARRs : ShelfCurrentLoans[] = [];
                shelfCurrentLoansResponseResponseJSONs.map((x:{
                    book:BookModel;
                    daysLeft:number;})=>{
                    shelfARRs.push({
                        book:x.book,
                        daysLeft:x.daysLeft,
                    });
                });
                setShelfCurrentLoans(shelfCurrentLoansResponseResponseJSONs);
                setShelfCurrentLoans(shelfARRs);
                console.log(shelfCurrentLoans);
            }
            setIsLoadingUserLoans(false);
        }

        fetchUserCurrentLoans().catch((error: any)=>{
            setIsLoadingUserLoans(false);
            setHttpError(error.message);
        });
        window.scrollTo(0,0);
    },[authState]);

    if(isLoadingUserLoans){
        return(
            <SpinnerLoading/>
        );
    }

    if(httpError){
        return(
            <div className="container m-5">
                <p>
                    {httpError}
                </p>
            </div>
        );
    }

    return(
        <div>
            {/* Desktop */}
            <div className="d-none d-lg-block mt-2">
                {
                    shelfCurrentLoans.length>0?
                        <>
                            <h5>
                                Current Loans:
                            </h5>
                            {
                                shelfCurrentLoans.map(shelfCurrentLoan=>{
                                    <div key={shelfCurrentLoan.book.id}>
                                        <div className="row mt-3 mb-3">
                                            <div className="col-4 col-md-4 container">
                                                {
                                                    shelfCurrentLoan.book?.img?
                                                    <img src={shelfCurrentLoan.book?.img} width='226' height='349' alt='Book'/>
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
                                                            shelfCurrentLoan.daysLeft > 0 &&
                                                            <p className="text-secondary">
                                                                Due In {shelfCurrentLoan.daysLeft} Days.
                                                            </p>
                                                        }
                                                        {
                                                            shelfCurrentLoan.daysLeft === 0 &&
                                                            <p className="text-success">
                                                                Due Today.
                                                            </p>
                                                        }
                                                        {
                                                            shelfCurrentLoan.daysLeft < 0 &&
                                                            <p className="text-danger">
                                                                Past due by {shelfCurrentLoan.daysLeft} Days.
                                                            </p>
                                                        }
                                                        <div className="list-group mt-3">
                                                            <button className="list-group-item list-group-item-action" aria-current='true' 
                                                            data-bs-toggle='modal' data-bs-target={`#modal${shelfCurrentLoan.book.id}`}>
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
                                                    <Link className="btn btn-primary" to={`/checkout/${shelfCurrentLoan.book.id}`}>
                                                        Leave A Review
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                         
                                    </div>
                                })
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
        </div>
    );
}