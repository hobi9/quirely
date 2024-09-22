package com.quirely.backend.constants;

import lombok.experimental.UtilityClass;

@UtilityClass
public class SessionConstants {
    public static final String SESSION_COOKIE_NAME = "x-session-id";
    public static final String SESSION_COOKIE_PATH = "/";
    public static final int SESSION_MAX_AGE = 60 * 60 * 24 * 30; //1 month
    public static final String SESSION_USER_ID_ATTRIBUTE = "userId";
}
