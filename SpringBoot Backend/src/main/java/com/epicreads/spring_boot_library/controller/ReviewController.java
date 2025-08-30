package com.epicreads.spring_boot_library.controller;

import com.epicreads.spring_boot_library.requestmodels.ReviewRequest;
import com.epicreads.spring_boot_library.service.ReviewService;
import com.epicreads.spring_boot_library.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/epicreads/reviews")
public class ReviewController {

    private ReviewService reviewService;

    public ReviewController (ReviewService reviewService){
        this.reviewService= reviewService;
    }

    @GetMapping("/secure/user/book")
    public boolean reviewBookbyUser(@RequestHeader(value = "Authorization") String token,
                                    @RequestParam Long bookId) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token,"\"sub\"");

        if(userEmail==null){
            throw new Exception("User Email is Missing");
        }
        return reviewService.userReviewListed(userEmail,bookId);
    }

    @PostMapping("/secure")
    public void postReview(@RequestHeader(value = "Authorization") String token,
                           @RequestBody ReviewRequest reviewRequest) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token,"\"sub\"");
        if(userEmail == null){
            throw new Exception("User email is missing");
        }
        reviewService.postReview(userEmail,reviewRequest);
    }
}
