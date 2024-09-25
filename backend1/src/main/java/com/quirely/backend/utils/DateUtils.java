package com.quirely.backend.utils;

import lombok.experimental.UtilityClass;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@UtilityClass
public class DateUtils {
    private static final ZoneId ZONE_ID = ZoneId.of("UTC");

    public static LocalDateTime getCurrentDateTime() {
        return ZonedDateTime.now(ZONE_ID).toLocalDateTime();
    }
}
