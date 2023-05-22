import { useOktaAuth } from "@okta/okta-react";
import HistoryModel from "../../../Models/HistoryModel";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { Pagination } from "../../Utils/Pagination";


export const HistoryPage = () => {
    const { authState } = useOktaAuth();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //histories
    const [histories, setHistories] = useState<HistoryModel[]>([]);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserHistories = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/histories/search/findBooksByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                }
                const historyResponse = await fetch(url, requestOptions);
                if (!historyResponse.ok) {
                    throw new Error('Something Went Wrong');
                }
                const historyResponseJSONs = await historyResponse.json();
                const myOBJs = await historyResponseJSONs._embedded.histories;
                const historiesOBJs : HistoryModel[] = [];
                historyResponseJSONs._embedded.histories.map((
                    x:{
                        id:number;
                        userEmail:string;
                        checkoutDate:string;
                        returnDate:string;
                        title:string;
                        author:string;
                        description:string;
                        img:string;
                    }
                )=>{
                    historiesOBJs.push({
                        id:x.id,
                        userEmail:x.userEmail,
                        checkoutDate:x.checkoutDate,
                        returnDate:x.returnDate,
                        title:x.title,
                        author:x.author,
                        description:x.description,
                        img:x.img,
                    })
                });
                setHistories(historyResponseJSONs._embedded.histories);
                setTotalPages(historyResponseJSONs.page.totalPages);
            }
            setIsLoadingHistory(false);
        }
        fetchUserHistories().catch((error: any) => {
            setHttpError(error.message);
            setIsLoadingHistory(false);
        })
    }, [authState, currentPage]);

    useEffect(() => {
        console.log(`Histories`);
        console.log(histories);
    }, [histories])

    if (isLoadingHistory) {
        return(
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    return (
        <div className="mt-2">
            {histories.length > 0 ?
                <>
                    <h5>Recent Histories: {histories.length}</h5>
                    {
                        Array.from({ length: histories.length }, (_, i) =>
                            <div key={histories[i].id}>
                                <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                                    <div className="row g-0">
                                        <div className="d-none d-lg-block">
                                            {histories[i].img ?
                                                <img src={histories[i].img} alt="book" width="123" height="196" />
                                                :
                                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} alt="book" width="123" height="196" />
                                            }
                                        </div>
                                        <div className="d-lg-none d-flex justify-content-center align-items-center">
                                            {histories[i].img ?
                                                <img src={histories[i].img} alt="book" width="123" height="196" />
                                                :
                                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} alt="book" width="123" height="196" />
                                            }
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="card-body">
                                            <h5 className="card-title">{histories[i].author}</h5>
                                            <h4>{histories[i].title}</h4>
                                            <p className='card-text'>{histories[i].description}</p>
                                            <hr />
                                            <p className="card-text">Checked out on: {histories[i].checkoutDate}</p>
                                            <p className='card-text'>Returned on: {histories[i].returnDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        )
                    }
                </>
                :
                <>
                    <h3>Currently No History: </h3>
                    <Link className='btn btn-primary' to={'search'}>Search for New Book</Link>
                </>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}