package com.sethyanacarrental.util;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;

// This class return the JSON type response of sending email and sms, and sd,cd reservations saving.
@Data
public class Response{
    @JsonProperty("reservation") // used to make the JSON output more predictable
    private String reservation;

    @JsonProperty("sms")
    private String sms;

    @JsonProperty("email")
    private String email;

    public String convertToJSON(){
        // Convert Java Object to JSON with Jackson library
        String jsonString = null;
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            jsonString = objectMapper.writeValueAsString(this);
        }catch (JsonProcessingException ex){
            jsonString = "JSON conversion failed with Jackson" + ex.getMessage();
        }
        return jsonString;
    }
}
