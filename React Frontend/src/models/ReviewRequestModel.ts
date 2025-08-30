class ReviewRequestModel{
    rating:number;
    bookId: number;
    reviewDescription?:String;

    constructor(rating:number,bookId:number,reviewDescription:String){
        this.rating = rating;
        this.bookId=bookId;
        this.reviewDescription=reviewDescription;
    }
}
export default ReviewRequestModel;