import { useEffect, useState } from "react";
import BookModel from "../../../Models/BookModel";
import { useOktaAuth } from "@okta/okta-react";

export const ChangeQuantityOfBook:React.FC<{
    book: BookModel,
    deleteBook:any,
}> = (props, key) => {
    const {authState} = useOktaAuth();
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);
    const [isDelete, setIsDelete] = useState(false);
    useEffect(()=>{
        const fetchBookInState = () => {
            props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
            props.book.copiesAvailable ? setRemaining(props.book.copiesAvailable) : setRemaining(0);
        }
        fetchBookInState();
    },[]);

    const increaseQuantity = async() => {
        const url = `http://localhost:8080/api/admin/secure/increase/book/quantity?bookId=${props.book.id}`;
        const requestOptions = {
            method:'PUT',
            headers:{
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const quantityUpdateResponse = await fetch(url, requestOptions);
        if(!quantityUpdateResponse.ok){
            throw new Error('Something Went Wrong')
        }
        setQuantity(quantity + 1);
        setRemaining(quantity + 1);
    }

    const decreaseQuantity = async() => {
        const url = `http://localhost:8080/api/admin/secure/decrease/book/quantity?bookId=${props.book.id}`;
        const requestOptions = {
            method:'PUT',
            headers:{
                Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        }
        const quantityUpdateResponse = await fetch(url, requestOptions);
        if(!quantityUpdateResponse.ok){
            throw new Error('Something Went Wrong');
        }
        setQuantity(quantity - 1);
        setRemaining(quantity - 1);
    }

    const deleteBook = async() => {
        setIsDelete(true);
        const url = `http://localhost:8080/api/admin/secure/delete/book?bookId=${props.book.id}`;
        const requestOptions = {
            method:'DELETE',
            headers:{
                Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        }
        const updateResponse = await fetch(url, requestOptions);
        if(!updateResponse.ok){
            throw new Error('Something Went Wrong');
        }
        props.deleteBook(); 
        setIsDelete(false);    
    }

    return(
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2">
                    <div className="d-none d-lg-block">
                        {props.book.img?
                            <img src={props.book.img} alt="Book" width="123" height="196" />
                            :
                            <img src={require("./../../../Images/BooksImages/book-luv2code-1000.png")} alt="book" width="123" height="196" />
                        }
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                        {props.book.img?
                            <img src={props.book.img} alt="Book" width="123" height="196" />
                            :
                            <img src={require("./../../../Images/BooksImages/book-luv2code-1000.png")} alt="book" width="123" height="196" />
                        }                        
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{props.book.author}</h5>
                        <h4>{props.book.title}</h4>
                        <p className="card-text">{props.book.description}</p>
                    </div>
                </div>
                <div className="mt col-md-4">
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Book Remaining: <b>{remaining}</b></p>
                    </div>
                </div>
                <div className="mt-3 col-md-1">
                    <div className="d-flex justify-content-start" style={{width:10000}}>
                        {isDelete?
                            <button className="m-1 btn btn-md btn-danger" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </button>
                            :
                            <button onClick={deleteBook} className="m-1 btn btn-md btn-danger">Delete</button>
                        }
                    </div>
                </div>
                <div className="btn-group-vertical">
                    <button onClick={increaseQuantity} className="m1 btn btn-md btn-primary">Add Quantity</button>
                    <button onClick={decreaseQuantity} className="m1 btn btn-md btn-secondary">Decrease Quantity</button>
                </div>
            </div>
        </div>
    );
}