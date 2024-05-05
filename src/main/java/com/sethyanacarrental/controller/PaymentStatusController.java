package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.PaymentStatus;
import com.sethyanacarrental.repository.PaymentStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/payment_status")
public class PaymentStatusController {

    @Autowired
    private PaymentStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PaymentStatus> paymentStatusList() {
        return dao.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }
}
