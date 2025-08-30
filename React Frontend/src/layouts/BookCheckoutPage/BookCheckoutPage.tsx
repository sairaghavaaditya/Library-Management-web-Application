import { useEffect, useReducer, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StrarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { setServers } from "dns";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import { METHODS } from "http";
import { useFormState } from "react-dom";
import ReviewRequestModel from "../../models/ReviewRequestModel";


export const BookCheckoutPage = () => {

    const {authState} = useOktaAuth();

    const [book,setBook]=useState<BookModel>();
    const [isLoading,setIsLoading]=useState(true);
    const [httpError,setHttpError]=useState(null);


    //review state

    const [reviews,setReviews]=useState<ReviewModel[]>([])
    const [totalStars,setTotalStars]=useState(0);
    const [isLoadingReview,setIsLoadingReview]=useState(true);

    const [isReviewLeft,setIsReviewLeft] = useState(false);
    const [isLoadingUserReview,setIsLoadingUserReview] = useState(true);


    //loans Count State
    const [currentLoansCount , setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Is Book Check Out?
    const [ischeckedout,setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut,setIsLoadingBookCheckedOut] = useState(true);

    const bookId = (window.location.pathname).split('/')[2];


    
    useEffect(()=>{

        const fetchBook = async () => {
     
 
 
         const baseUrl:string=`${process.env.REACT_APP_API}/books/${bookId}`;
 
 
         const response = await fetch(baseUrl);
 
         if (!response.ok){
             throw new Error('Something went wrong!');
         }
 
 
         const responseJson = await response.json();
 
        
 
         const loadedBook:BookModel={
            id:responseJson.id,
                 title:responseJson.title,
                 author: responseJson.author, 
                 description: responseJson.description, 
                 copies: responseJson.copies, 
                 copiesAvailable: responseJson.copiesAvailable, 
                 category: responseJson.category, 
                 img: responseJson.img,
         };
 
         
        
 
         setBook(loadedBook);
         setIsLoading(false);
 
 
 
        };
        fetchBook().catch((error: any) => {
         setIsLoading(false);
         setHttpError(error.message);
        })
     },[ischeckedout]);


     useEffect(()=> {
        const fetchBookReviews = async () => {
            const reviewUrl:string=`${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok){
                throw new Error('Something Went Wrong');

            }
            const responseJsonReviews= await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews:ReviewModel[]=[];

            let weightedStarReviews: number =0;

            for (const key in responseData){
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,

                });

                weightedStarReviews=weightedStarReviews+responseData[key].rating;
                
            }

            if (loadedReviews){
               const round = (Math.round((weightedStarReviews/loadedReviews.length)*2)/2).toFixed(1);
               setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);

     };
     fetchBookReviews().catch((error: any) => {
        setIsLoadingReview(false);
        setHttpError(error.message)
     })
    },[isReviewLeft]);


    useEffect(()=>{
        const fetchUserReviewBook = async () => {
            if(authState && authState.isAuthenticated){

            const url=`${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;
            const requestOptions ={
                method: "GET",
                headers : {
                   Authorization : `Bearer ${authState.accessToken?.accessToken}`,
                   'Content-Type':'application/json'
                }
               };

            const userReview = await fetch(url,requestOptions);

            if(!userReview.ok){
                throw new Error('Something went wrong!');
            }
            const userReviewResponseJson=await userReview.json();
            setIsReviewLeft(userReviewResponseJson);

        }
        setIsLoadingUserReview(false);
        
        }
        fetchUserReviewBook().catch((error:any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })


    },[authState]);



    useEffect(() => {

        const fetchUserCurrentLoansCount = async () => {


            if(authState && authState.isAuthenticated){
                const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
                
                const requestOptions ={
                 method: "GET",
                 headers : {
                    Authorization : `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type':'application/json'
                 }
                };
                const currentLoansCountResponse = await fetch(url,requestOptions);
                
                if(!currentLoansCountResponse.ok){
                    throw new Error("Something went wrong");
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
            }
            setIsLoadingCurrentLoansCount(false);
            
        }
            fetchUserCurrentLoansCount().catch((error:any) =>{
                 setIsLoadingCurrentLoansCount(false);
                 setHttpError(error.message);
            });
        
    },[authState,ischeckedout]);

    
    useEffect(()=>{
         const fetchUserCheckedOutBook = async () => {
            if(authState && authState.isAuthenticated){
                const url= `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser?bookId=${bookId}`;
                const requestOptions ={
                    method: "GET",
                    headers : {
                       Authorization : `Bearer ${authState.accessToken?.accessToken}`,
                       'Content-Type':'application/json'
                    }
                   };
                   const bookCheckedOut = await fetch(url,requestOptions);

                   if(!bookCheckedOut.ok){
                    throw new Error("Something went wrong");
                   }

                   const bookCheckedOutResponseJson = await bookCheckedOut.json();
                   console.log(bookCheckedOutResponseJson);

                   setIsCheckedOut(bookCheckedOutResponseJson);
            }



            setIsLoadingBookCheckedOut(false);

         }
         fetchUserCheckedOutBook().catch((error:any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
         })
    },[authState]);



    

    async function checkoutBook(){
        const url= `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${book?.id}`;


        const requestOptions = {

            method: 'PUT',
            headers:{
                Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
          }
        };
        const checkoutResponse = await fetch(url, requestOptions);
        console.log(checkoutResponse)
        if (!checkoutResponse.ok){
            throw new Error("Something went Wrong!")
        }
        setIsCheckedOut(true);

    }


    async function submitReview(starInput: number, reviewDescription: string) {
        let bookId: number = 0;
        if (book?.id) {
            bookId = book.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
        const url = `${process.env.REACT_APP_API}/reviews/secure`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsReviewLeft(true);
    }


    






    if(isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview){
        return (
            <div className="container m-5">
                <SpinnerLoading/>

            </div>
        )
    }

    if (httpError){
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
                    <div className="col-sm-2 col-md-3">
                        {book?.img?
                        <img src={book?.img} width='226' height='349' alt='Book'/>
                        :
                        <img src={require('./../../Images/BooksImages/book-epicreads-1000.png')} width='226' height='349' alt='Book'/>
                        }

                    </div>
                    <div className="col-4 col-md-4">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="'text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview Rating={totalStars} size={32}/>
                        </div>

                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount}
                        isAuthentication={authState?.isAuthenticated} isCheckedOut={ischeckedout}
                        checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>

                </div>
                <hr/>

                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false}/>

            </div>

            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center align-items-center">
                    {book?.img?
                            <img src={book?.img} width='226' height='349' alt='Book'/>
                            :
                            <img src={require('./../../Images/BooksImages/book-epicreads-1000.png')} width='226' height='349' alt='Book'/>
                            }

                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="'text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview Rating={totalStars} size={30}/>
                    </div>

                </div>
                <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount}
                    isAuthentication={authState?.isAuthenticated} isCheckedOut={ischeckedout}
                    checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                <hr/>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true}/>

            </div>

        </div>
    );
}