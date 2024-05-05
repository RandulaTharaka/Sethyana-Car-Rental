package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.CustomerPayment;
import com.sethyanacarrental.model.CustomerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportRepository extends JpaRepository<CustomerPayment, Integer> {

    @Query(value = "SELECT YEAR(cp.paid_date_time), DATE(cp.paid_date_time), SUM(cp.paid) " + // Creating columns
            "FROM sethyana_car_rental.customer_payment AS cp " +
            "WHERE DATE(cp.paid_date_time) BETWEEN ?1 AND ?2 " + // Select dates between parsed dates
            "GROUP BY YEAR(cp.paid_date_time), DATE(cp.paid_date_time);",
            // Group by all non-aggregate columns used in SELECT statement
            // (Reason SQL needs to know how to group the raws when aggregating data (You have use one aggregated function SUM))
            nativeQuery = true)
    List dailyRevenue(String sdate, String enddate);

    @Query(value = "SELECT YEAR(cp.paid_date_time),WEEK(cp.paid_date_time, 1), " + // 1 = starts with week 1 instead 0
            "SUM(cp.paid) FROM sethyana_car_rental.customer_payment AS cp " +
            "WHERE DATE(cp.paid_date_time) BETWEEN ?1 AND ?2  " +
            "GROUP BY YEAR(cp.paid_date_time), WEEK(cp.paid_date_time, 1);",
            nativeQuery = true)
    List weeklyRevenue(String sdate, String enddate);

    @Query(value = "SELECT YEAR(cp.paid_date_time), MONTHNAME(cp.paid_date_time), SUM(cp.paid) " +
            "FROM sethyana_car_rental.customer_payment AS cp " +
            "WHERE DATE(cp.paid_date_time) BETWEEN ?1 AND ?2 " +
            "GROUP BY YEAR(cp.paid_date_time), MONTHNAME(cp.paid_date_time);",
            nativeQuery = true)
    List monthlyRevenue(String sdate, String enddate);

    @Query(value = "SELECT YEAR(cp.paid_date_time) AS year1, YEAR(cp.paid_date_time) AS year2, SUM(cp.paid) " +
            "FROM sethyana_car_rental.customer_payment AS cp " +
            "WHERE DATE(cp.paid_date_time) BETWEEN ?1 AND ?2 " +
            "GROUP BY YEAR(cp.paid_date_time), YEAR(cp.paid_date_time);",
            nativeQuery = true)
    List yearlyRevenue(String sdate, String enddate);
}
