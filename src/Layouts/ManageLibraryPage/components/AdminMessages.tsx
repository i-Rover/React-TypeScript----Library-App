import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../Models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import {AdminMessage} from './AdminMessage';
import AdminMessageRequest from "../../../Models/AdminMessageRequest";
export const AdminMessages = () => {
    const {authState} = useOktaAuth();
    //normal loading pieces
    const[isLoadingMessages, setIsLoadingMessages] = useState(true);
    const[httpError, setHttpError] = useState(null);

    //messages endpoint state
    const[messages, setMessages] = useState<MessageModel[]>([]);
    const[messagesPerPage] = useState(5);

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    //recall useEffect
    const [btnSubmit, setBtnSubmit] = useState(false);


    useEffect(()=>{
        const fetchUserMessages = async () =>{ 
            if(authState && authState.isAuthenticated){
                const url = `http://localhost:8080/api/messageses/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method:'GET',
                    headers:{
                        Authorization:`Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type':'application/json'
                    },
                }
                const messagesResponse = await fetch(url, requestOptions);
                if(!messagesResponse.ok){
                    throw new Error('Something Went Wrong');
                }
                const messageResponseJSONs = await messagesResponse.json();
                setMessages(messageResponseJSONs._embedded.messageses);
                setTotalPages(messageResponseJSONs.page.totalPages);
            }
            setIsLoadingMessages(false);
        }
        fetchUserMessages().catch((error:any)=>{
            setIsLoadingMessages(false);
            setHttpError(error.messages);
        });
        window.scrollTo(0,0);
    },[authState, currentPage, btnSubmit]);

    if(isLoadingMessages){
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

    const submitResponseToQuestion = async(id:number, response: string) => {
        const url = `http://localhost:8080/api/messages/secure/admin/message`;
        if(authState && authState.isAuthenticated && id !==null && response !==''){
            const messageAdminRequestsModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            const requestOptions = {
                method:"PUT",
                headers:{
                    "Authorization" : `Bearer ${authState?.accessToken?.accessToken}`,
                    "Content-Type"  : "application/json"
                },
                body: JSON.stringify(messageAdminRequestsModel)
            };
            const messageAdminRequestsModelResponse = await fetch(url, requestOptions); 
            if(!messageAdminRequestsModelResponse.ok){
                throw new Error("Something Went Wrong!");
            }
            setBtnSubmit(!btnSubmit);
        }
    }

    const paginate = (pageNumber:number) => setCurrentPage(pageNumber);

    return(
        <div className="mt-3">
            {messages.length>0?
                <>
                    <h5>
                        Pending Q/A:
                    </h5>
                    {
                        Array.from({ length: messages.length }, (_, i) => 
                            <AdminMessage message={messages[i]} key={messages[i].id} submitResponseToQuestion={submitResponseToQuestion}/>
                        )
                    }
                </>
            :
                <h5>No Pending Question</h5>
            }
            <div className="mt-2"></div>
            {totalPages>1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}