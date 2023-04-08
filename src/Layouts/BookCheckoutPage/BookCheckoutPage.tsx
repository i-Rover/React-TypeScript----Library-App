import { useEffect, useState } from "react";
import BookModel from "../../Models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../Models/ReviewModel";
import { LatestReview } from "./LatestReview";

export const BookCheckoutPage = () =>{
    const [book, setBook] = useState<BookModel>();
    const [isLoading, setLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    //review state
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);
    const bookId = (window.location.pathname).split('/')[2];
    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`
            const response = await fetch(baseUrl);
            if(!response.ok){
                throw new Error("something went wrong");
            }
            const responseJSONs = await response.json();
            const loadedBooks: BookModel = {
                id: responseJSONs.id,
                title: responseJSONs.title,
                author: responseJSONs.author,
                description: responseJSONs.description,
                copies: responseJSONs.copies,
                copiesAvailable: responseJSONs.copiesAvailable,
                img: responseJSONs.img,               
            };
            setBook(loadedBooks);
            setLoading(false);
        };
        fetchBooks().catch((error: any)=>{
            setLoading(false);
            setHttpError(error.message);
        })
    }, []);
    useEffect(()=>{
        const fetchReviews = async () =>{
            const reviewUrl : string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
            const responseReviews = await fetch(reviewUrl);
            if(!responseReviews){
                throw new Error("Something went wrong!");
            }
            const responseJSONsReviews = await responseReviews.json();
            const responseData = await responseJSONsReviews._embedded.reviews;
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
                weightedStarsReviews = weightedStarsReviews + x.rating;            
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

            if(loadedReview){
                const round = (Math.round((weightedStarsReviews / loadedReview.length)*2)/2).toFixed(1);
                console.log("round");
                console.log(round);
                setTotalStars(Number(round));
            }

            setReviews(loadedReview);
            setIsLoadingReview(false);
        };
        fetchReviews().catch((error:any)=>{
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, []);
    if(isLoading || isLoadingReview){
        return(
            <SpinnerLoading />
        )
    }
    if(httpError){
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }
    return(
        <div>
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='book'/>
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt='book'/>
                        }
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} />
                </div>
                <hr />
                <LatestReview reviews={reviews} bookId={book?.id} mobile={false}/>
            </div>
            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center align-item-center">
                {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='book'/>
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt='book'/>
                        }
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} />
                <hr />
                <LatestReview reviews={reviews} bookId={book?.id} mobile={true}/>
            </div>
        </div>
    );
}