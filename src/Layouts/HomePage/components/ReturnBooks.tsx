import { Link } from "react-router-dom";
import BookModel from "../../../Models/BookModel";

export const ReturnBooks: React.FC<{book: BookModel}> = (props) =>{
    return(
        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="text-center">
                {
                    props.book.img?
                    <img 
                    src={props.book.img} 
                        alt="" width="151" 
                        height="233" 
                    />
                    :
                    <img 
                    src={
                        require('./../../../Images/BooksImages/book-luv2code-1000.png')} 
                        alt="" width="151" 
                        height="233" 
                    />
                }
                <h6 className="mt-2">{props.book.title}</h6>
                <p>{props.book.author}</p>
                <Link className="btn main-color text-white" to={`checkout/${props.book.id}`}>Reserve</Link>
            </div>
        </div>
    );
};