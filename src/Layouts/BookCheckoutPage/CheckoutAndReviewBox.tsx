import { Link } from "react-router-dom";
import BookModel from "../../Models/BookModel";
import { LeaveAReview } from "../Utils/LeaveAReview";

export const CheckoutAndReviewBox: 
React.FC<{
    book                : BookModel | undefined, 
    mobile              : boolean,
    currentLoansCount   : number,
    isCheckOut          : boolean,
    isAuthenticated     : any,
    checkoutBook        : any,
    isReviewLeft        : boolean,
    submitReview        : any,
    isSubmitReview      : boolean,
    }> 
    = (props) => {
    //check to render button checkout or already checkout
    function buttonRender(){
        if(props.isAuthenticated){
            if(!props.isCheckOut && props.currentLoansCount < 5){
                return(<button onClick={()=>props.checkoutBook()} className="btn btn-success btn-lg">Checkout</button>)
            }else if(props.isCheckOut){
                return(<p><b>Book Checked Out. Enjoy!</b></p>)
            }else if(!props.isCheckOut){
                return(<p className="text-danger">Too many books checked out.</p>)
            }
        }
        return (<Link to={'/login'} className='btn btn-success btn-lg'>Sign In</Link>)
    }
    const myButtonRender = () => {
        if(props.isAuthenticated){
            if(!props.isCheckOut && props.currentLoansCount < 5){
                return(<button onClick={()=>props.checkoutBook()} className="btn btn-success btn-lg">Checkout</button>)
            }else if(props.isCheckOut){
                return(<p><b>Book Checked Out. Enjoy!</b></p>)
            }else if(!props.isCheckOut){
                return(<p className="text-danger">Too many books checked out.</p>)
            }
        }
        return (<Link to={'/login'} className='btn btn-success btn-lg'>Sign In</Link>)       
    }
    const reviewRender = () => {
        if(props.isAuthenticated && !props.isReviewLeft){
            return(
                <p>
                    <LeaveAReview submitReview={props.submitReview} isSubmitReview={props.isSubmitReview}/>
                </p>
            )
        }else if(props.isAuthenticated && props.isReviewLeft){
            return(<p><b>Thank You for Your Review!</b></p>)
        }
        return (<div><hr /><p>Sign In to be Able to Leave a Review</p></div>)
    }
    return(
        <div className={props.mobile ? 'card d-flex mt-5' :'card col-3 container d-flex mb-5'}>
            <div className='card-body container'>
                <div className="mt-3">
                    <p>
                        <b>{props.currentLoansCount}/5</b>
                        books checked out
                    </p>
                    <hr />
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable>0?
                        <h4 className="text-success">
                            Available
                        </h4>
                        :
                        <h4 className="text-danger">
                            Wait List
                        </h4>
                    }
                    <div className="row">
                        <p className="col-6 lead">
                            <b>{props.book?.copies}&nbsp;</b>
                            Copies
                        </p>
                        <p className="col-6 lead">
                            <b>{props.book?.copiesAvailable}&nbsp;</b>
                            available
                        </p>
                    </div>
                </div>
                {/* <Link to='/#' className="btn btn-success btn-lg">Sign in</Link> */}
                {myButtonRender()}
                <hr />
                <p className='mt-3'>
                    This number can change until placing order has been complete.
                </p>
                <p>
                    {reviewRender()}
                </p>
            </div>
        </div>
    );
}