package com.sethyanacarrental.service;

import com.sethyanacarrental.model.SMS;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

@Component
public class SMSService {
    public static final String ACCOUNT_SID = "ACa230e2bc24b49725fb2a2f14c23cb00b";
    public static final String AUTH_TOKEN = "5a846799b5370346c7d75aa4b3afdb22";
    public static final String FROM_NUMBER = "+12513020712";

    public void send(SMS sms) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Message message = Message.creator(
                new PhoneNumber(sms.getTo()),
                new PhoneNumber(FROM_NUMBER),
                sms.getMessage())
                .create();
    }

    public void receive(MultiValueMap<String, String> smscallback) {

    }
}
