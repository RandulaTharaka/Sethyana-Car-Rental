package com.sethyanacarrental.util;


import java.lang.annotation.Retention;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Retention(RUNTIME)
public @interface RegexPattern {

    String regexp() default "";

    String message() default "";

}
