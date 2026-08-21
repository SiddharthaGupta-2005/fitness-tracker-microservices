package com.fitness.acitvityservices.exception;

public class ActivityNotFoundException extends RuntimeException {
    public ActivityNotFoundException(String message) {
        super(message);
    }
}