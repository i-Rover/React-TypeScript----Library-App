import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import MessageModel from "../../../Models/MessageModel";
import { Pagination } from "../../Utils/Pagination";

export const Messages = () => {
    const {authState} = useOktaAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [messages, setMessages] = useState<MessageModel[]>([]);

    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(()=>{
        const fetchUserMessages = async() =>{
            if(authState?.isAuthenticated && authState){
                const url = `http://localhost:8080/api/messageses/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage-1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method:'GET',
                    headers:{
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const messagesResponse = await fetch(url, requestOptions);
                if(!messagesResponse.ok){
                    throw new Error('Something Went Wrong');
                }
                const messageResponseJSONs = await messagesResponse.json();
                setMessages(messageResponseJSONs._embedded.messageses);
                setTotalPages(messageResponseJSONs.page.totalPages);
            }
            setIsLoading(false);
        }
        fetchUserMessages().catch((error:any)=>{
            setIsLoading(false);
            setHttpError(error.message);
        });
        window.scrollTo(0,0);
    },[authState, currentPage]);

    useEffect(()=>{
        console.log(`messageses`);
        console.log(messages);
    });

    if(isLoading){
        return(
            <SpinnerLoading />
        );
    }

    if(httpError){
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }
    const paginate = (pageNumber:number) => setCurrentPage(pageNumber);
    return(
        <div className="mt-2">
            {messages.length>0?
            <>
                <h5>Current Q/A:{messages.length}</h5>
                {Array.from({ length: messages.length }, (_, i) => 
                    <div key={messages[i].id}>
                    <div className='card mt-2 shadow p-3 bg-body rounded'>
                        <h5>Case #{messages[i].id} : {messages[i].title}</h5>
                        <h6>{messages[i].userEmail}</h6>
                        <p>{messages[i].question}</p>
                        <hr />
                        <div>
                            <h5>Response:</h5>
                            {messages[i].response && messages[i].adminEmail?
                                <>
                                    <h6>{messages[i].adminEmail} (admin)</h6>
                                    <p>{messages[i].response}</p>
                                </>
                            :
                               <p><i>Pending Response from Administartion. Please Be Patient</i></p> 
                            }
                        </div>
                    </div>
                </div>                    
                )}
            </>
            : <h5>All Questions You Submit Will be Shown Here</h5>    }
            <div className="mt-3"></div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}