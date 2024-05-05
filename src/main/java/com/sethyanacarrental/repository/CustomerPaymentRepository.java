package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.CustomerPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerPaymentRepository extends JpaRepository<CustomerPayment, Integer> {

    @Query(value = "SELECT CONCAT('PAY', lpad(substring(max(pay.invoice_number), 4, 10) + 1, 7, 0)) " +
            "FROM sethyana_car_rental.customer_payment AS pay;", nativeQuery = true)
    String getNextInvoiceNo();

    @Query("SELECT cp FROM CustomerPayment cp WHERE cp.payment_status_id='2' AND cp.self_drive_reservation_id.id=:reservation_id")
    CustomerPayment getAdvancePayment(@Param("reservation_id") int reservation_id);

    @Query("SELECT cp FROM CustomerPayment cp WHERE cp.payment_status_id='4' AND cp.self_drive_reservation_id.id=:reservation_id")
    CustomerPayment getCompletedPayment(int reservation_id);

    @Query("SELECT cp FROM CustomerPayment cp WHERE " +
            "(cp.invoice_number LIKE CONCAT('%', :searchtext, '%') OR " +
            "cp.reservation_type_id.name LIKE CONCAT('%', :searchtext, '%') OR " +
            "cp.payment_status_id.name LIKE CONCAT('%', :searchtext, '%'))")
    Page<CustomerPayment> findAll(@Param("searchtext") String searchtext, Pageable of);
}


