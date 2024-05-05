package com.sethyanacarrental.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "invoice_number", unique = true)
    @Basic(optional = false)
    private String invoice_number;

    @Column(name = "required_rental_period_charge")
    private BigDecimal required_rental_period_charge;

    @Column(name = "required_additional_hour_charges_total")
    private BigDecimal required_additional_hour_charges_total;

    @Column(name = "rental_period_charge")
    private BigDecimal rental_period_charge;

    @Column(name = "additional_hour_charges_total")
    private BigDecimal additional_hour_charges_total;

    @Column(name = "additional_km_charges_total")
    private BigDecimal additional_km_charges_total;

    @Column(name = "pick_up_charge")
    private BigDecimal pick_up_charge;

    @Column(name = "additional_charges")
    private BigDecimal additional_charges;

    @Column(name = "fine")
    private BigDecimal fine;

    @Column(name = "sub_total")
    private BigDecimal sub_total;

    @Column(name = "discount")
    private BigDecimal discount;

    @Column(name = "discount_percentage")
    private BigDecimal discount_percentage;

    @Column(name = "total_payable")
    @Basic(optional = false)
    private BigDecimal total_payable;

    @Column(name = "refund_due")
    private BigDecimal refund_due;

    @Column(name = "cash")
    @Basic(optional = false)
    private BigDecimal cash;

    @Column(name = "change_amount")
    private BigDecimal change_amount;

    @Column(name = "paid")
    @Basic(optional = false)
    private BigDecimal paid;

    @Column(name = "due_balance")
    private BigDecimal due_balance;

    @Column(name = "paid_date_time")
    @Basic(optional = false)
    private LocalDateTime paid_date_time;

    @JoinColumn(name = "reservation_type_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private ReservationType reservation_type_id;

    @JoinColumn(name = "chauffeur_drive_reservation_id", referencedColumnName = "id")

    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private ChauffeurDriveReservation chauffeur_drive_reservation_id;

    @JoinColumn(name = "self_drive_reservation_id", referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private SelfDriveReservation self_drive_reservation_id;

    @JoinColumn(name = "refundable_deposit_status_id", referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private RefundableDepositStatus refundable_deposit_status_id;

    @JoinColumn(name = "payment_status_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private PaymentStatus payment_status_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    public CustomerPayment(String nextPayInvoiceNo) {
        this.invoice_number = nextPayInvoiceNo;
    }
}


