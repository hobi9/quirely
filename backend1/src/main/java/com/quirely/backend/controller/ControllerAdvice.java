package com.quirely.backend.controller;

import com.quirely.backend.exception.NonUniqueUserException;
import com.quirely.backend.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ControllerAdvice {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    public ResponseEntity<Map<String, String>> handleException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NonUniqueUserException.class)
    @ResponseBody
    public ResponseEntity<Map<String, String>> handleException(NonUniqueUserException ex) {
        Map<String, String> errors = new HashMap<>();

        errors.put("message", "User with email" + ex.getEmail() + " already exists");
        errors.put("key", "Non unique user");

        return new ResponseEntity<>(errors, HttpStatus.CONFLICT);
    }

    //TODO: remove hashmap, this is just temporary
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseBody
    public ResponseEntity<Map<String, String>> handleException(UserNotFoundException ex) {
        Map<String, String> errors = new HashMap<>();

        errors.put("message", "User is not found");
        errors.put("key", "User not found");

        return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
    }
}
