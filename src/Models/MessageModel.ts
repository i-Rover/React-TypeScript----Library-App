export default class MessageModel{
    title?:string;
    question?:string;
    id?:number;
    userEmail?:string;
    adminEmail?:string;
    response?:string;
    closed?:boolean;
    constructor(title:string, question:string, closed:boolean){
        this.title = title;
        this.question = question;
        this.closed = closed;
    }
}