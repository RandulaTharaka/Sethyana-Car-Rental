package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.RefundableDepositStatus;
import com.sethyanacarrental.repository.RefundableDepositStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/refundable_deposit_status")
public class RefundableDepositStatusController {

    @Autowired
    private RefundableDepositStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<RefundableDepositStatus> refundableDepositStatusList() {
        return dao.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }
}
