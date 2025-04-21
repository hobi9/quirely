package com.quirely.backend.config;

import com.quirely.backend.constants.MDCKeys;
import org.slf4j.MDC;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.zalando.logbook.Logbook;

import static org.zalando.logbook.core.Conditions.*;
import static org.zalando.logbook.json.JsonPathBodyFilters.jsonPath;

@Configuration
public class LogbookConfig {

    @Bean
    public Logbook logbook() {
        return Logbook.builder()
                .condition(exclude(
                        requestTo("/v3/api-docs/**"),
                        requestTo("/swagger-ui/**"),
                        requestTo("/swagger-ui.html")))
                .bodyFilter(jsonPath("$.password").replace("[REDACTED]"))
                .correlationId(_ ->  MDC.get(MDCKeys.REQUEST_ID))
                .build();
    }

}
