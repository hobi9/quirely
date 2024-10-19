package com.quirely.backend.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Slf4j
@Aspect
@Component
public class LogginAspect {

    @Pointcut("execution(public * com.quirely.backend.service.*.*(..))")
    private void servicePointcut() {}

    @Around(value = "servicePointcut()")
    public Object logAroundService(ProceedingJoinPoint joinPoint) throws Throwable {
        Signature signature = joinPoint.getSignature();
        Class<?> targetClass = joinPoint.getTarget().getClass();
        Object[] args = joinPoint.getArgs();

        log.info("Calling {}.{} with arguments: {}", targetClass.getSimpleName(), signature.getName(), Arrays.toString(args));
        Object result = joinPoint.proceed();
        log.info("Called {}.{} with result: {}", targetClass.getSimpleName(), signature.getName(), result);
        return result;
    }
}
