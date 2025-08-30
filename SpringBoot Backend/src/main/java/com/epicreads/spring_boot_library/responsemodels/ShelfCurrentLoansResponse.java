package com.epicreads.spring_boot_library.responsemodels;


import com.epicreads.spring_boot_library.entity.Book;

public class ShelfCurrentLoansResponse {
    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public int getDaysLeft() {
        return daysLeft;
    }

    public void setDaysLeft(int daysLeft) {
        this.daysLeft = daysLeft;
    }

    public ShelfCurrentLoansResponse(Book book, int daysLeft){
        this.book=book;
        this.daysLeft=daysLeft;
    }

    private Book book;

    private int daysLeft;
}
