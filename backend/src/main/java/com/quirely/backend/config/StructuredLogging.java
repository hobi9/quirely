package com.quirely.backend.config;

import ch.qos.logback.classic.spi.ILoggingEvent;
import com.quirely.backend.constants.MDCKeys;
import org.slf4j.MDC;
import org.springframework.boot.json.JsonWriter;
import org.springframework.boot.logging.structured.StructuredLogFormatter;

public class StructuredLogging implements StructuredLogFormatter<ILoggingEvent> {

    private final JsonWriter<ILoggingEvent> writer = JsonWriter.<ILoggingEvent>of((members) -> {
        members.add("level", ILoggingEvent::getLevel);
        members.add("time", ILoggingEvent::getTimeStamp);
        members.add("message", ILoggingEvent::getFormattedMessage);

        members.add(MDCKeys.REQUEST_ID, () -> MDC.get(MDCKeys.REQUEST_ID));
        members.add(MDCKeys.SESSION_ID, () -> MDC.get(MDCKeys.SESSION_ID));

    }).withNewLineAtEnd();

    @Override
    public String format(ILoggingEvent event) {
        return this.writer.writeToString(event);
    }
}
