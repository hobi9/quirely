package com.quirely.backend.exception;

import com.quirely.backend.dto.ErrorDto;
import com.quirely.backend.exception.types.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> handleException(MethodArgumentNotValidException ex) {
        log.info("Validation Exception", ex);
        var errors = new HashMap<String, String>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return ResponseEntity.badRequest().body(new ErrorDto("Validation failed", errors));
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorDto> handleException(ApiException ex) {
        log.warn("API Exception", ex);
        return ResponseEntity.status(ex.getHttpStatus()).body(new ErrorDto(ex.getMessage(), ex.getErrors()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> handleException(Exception ex) {
        log.error("Unhandled exception: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorDto("Internal server error"));
    }

}
