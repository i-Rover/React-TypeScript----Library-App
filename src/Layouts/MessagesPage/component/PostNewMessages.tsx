import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import MessageModel from "../../../Models/MessageModel";

export const PostNewMessages = () => {
    const { authState } = useOktaAuth();
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    const submitNewQuestion = async () => {
        const url = `http://localhost:8080/api/messages/secure/add/message`;
        if (authState?.isAuthenticated && title !== '' && question !== '') {
            const messageRequestModel: MessageModel = new MessageModel(title, question, false);
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageRequestModel)
            };
            const submitNewQuestionResponse = await fetch(url, requestOptions);
            if (!submitNewQuestionResponse.ok) {
                throw new Error('Something Went Wrong');
            }
            setTitle('');
            setQuestion('');
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }
    return (
        <div className="card mt-3">
            <div className="card-header">
                Ask Question to Luv 2 Read Admin
            </div>
            <div className="card-body">
                <form action="" method="post">
                    {displayWarning &&
                        <div className="alert alert-danger" role="alert">
                            All Fields Must Be Filled Out
                        </div>
                    }
                    {displaySuccess &&
                        <div className="alert alert-success" role="alert">
                            Question added succesffully
                        </div>
                    }
                    <div className="mb-3">
                        <label htmlFor="">
                            Title
                        </label>
                        <input type="text" className="form-control" id="exampleFormControlInput1"
                            placeholder="Title" onChange={e => setTitle(e.target.value)} value={title} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Question</label>
                        <textarea className="form-control" id="exampleFormControlTextArea1"
                            rows={3} onChange={e => setQuestion(e.target.value)}
                            value={question}></textarea>
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary mt-3" onClick={submitNewQuestion}>
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}