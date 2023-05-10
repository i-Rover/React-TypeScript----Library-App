import { useEffect, useState } from "react";
import ReviewModel from "../../../Models/ReviewModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Review } from "../Review";
import { Pagination } from "../../Utils/Pagination";

export const ReviewListPage:React.FC<{}> = (props) =>{
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const bookId = (window.location.pathname).split('/')[2];

    //Get Specific Review About This Book
    useEffect(() => {
        const fetchReviews = async () =>{
            const reviewUrl : string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;
            const responseReviews = await fetch(reviewUrl);
            if(!responseReviews){
                throw new Error("Something went wrong!");
            }
            const responseJSONsReviews = await responseReviews.json();
            const responseData = await responseJSONsReviews._embedded.reviews;

            //Pagination
            setTotalAmountOfReviews(responseJSONsReviews.page.totalElements);
            setTotalPages(responseJSONsReviews.page.totalPages);
            
            const loadedReview : ReviewModel[] = [];
            let weightedStarsReviews : number = 0;
            responseData.map(
                (x: { id: any; 
                    userEmail: any; 
                    date: any; 
                    rating: any; 
                    bookId: any; 
                    reviewDescription: any; })=>{
                        loadedReview.push({
                            id          :   x.id,
                            userEmail   :   x.userEmail,
                            date        :   x.date,
                            rating      :   x.rating,
                            book_id     :   x.bookId,
                            reviewDescription   :   x.reviewDescription,
                });             
            });
            // for(let key in responseData){
            //     loadedReview.push({
            //         id          :   responseData[key].id,
            //         userEmail   :   responseData[key].userEmail,
            //         date        :   responseData[key].date,
            //         rating      :   responseData[key].rating,
            //         book_id     :   responseData[key].bookId,
            //         reviewDescription   :   responseData[key].reviewDescription,
            //     });
            //     weightedStarsReviews = weightedStarsReviews + responseData[key].rating;
            //     console.log("weightedStarsReviews");
            //     console.log(weightedStarsReviews);
            //     console.log("rating");
            //     console.log(responseData[key].rating);
            // }

            setReviews(loadedReview);
            setIsLoading(false);
        };
        fetchReviews().catch((error:any)=>{
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage]);

    if(isLoading){
        return (
            <SpinnerLoading />
        )
    }

    if(httpError){
        return(
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? reviewsPerPage * currentPage : totalAmountOfReviews;
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    return(
        <div className='container m-5'>
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
            </p>
            <div className='row'>
                {reviews.map(review => (
                    <Review review={review} key={review.id}/>
                ))}
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}