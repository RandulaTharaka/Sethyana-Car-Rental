package com.sethyanacarrental.controller;

import com.sethyanacarrental.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //make controller class readable to servlet
@RequestMapping(value = "/report")
public class ReportController {

    @Autowired
    private ReportRepository dao;

    // revenue Report by given start date end date with type [/report/revenue_report?sdate=2022-01-01&edate=2022-05-08&type=Monthly]
    @GetMapping(value = "/revenue_report", params = {"sdate", "edate", "type"}, produces = "application/json")
    public List revenueReport(@RequestParam("sdate") String sdate, @RequestParam("edate") String edate, @RequestParam("type") String type) {

        if (type.equals("Daily")) {
            return dao.dailyRevenue(sdate, edate);
        } else if (type.equals("Weekly")) {
            return dao.weeklyRevenue(sdate, edate);
        } else if (type.equals("Monthly")) {
            return dao.monthlyRevenue(sdate, edate);
        }else if (type.equals("Yearly")) {
            return dao.yearlyRevenue(sdate, edate);
        } else
            return null;
    }
}
