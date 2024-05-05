package com.sethyanacarrental.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "self_drive_reservation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelfDriveReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "sd_reservation_code", unique = true)
    @Basic(optional = false)
    private String sd_reservation_code;

    @Column(name = "pick_up_datetime")
    @Basic(optional = false)
    private LocalDateTime pick_up_datetime;

    @Column(name = "required_rental_days")
    @Basic(optional = false)
    private Integer required_rental_days;

    @Column(name = "required_additional_hours")
    private Integer required_additional_hours;

    @Column(name = "expect_return_datetime")
    @Basic(optional = false)
    private LocalDateTime expect_return_datetime;

    @Column(name = "other_pick_up_location")
    private String other_pick_up_location;

    @Column(name = "pick_up_charge")
    private BigDecimal pick_up_charge;

    @Column(name = "package_price")
    @Basic(optional = false)
    private BigDecimal package_price;

    @Column(name = "package_refundable_deposit")
    @Basic(optional = false)
    private BigDecimal package_refundable_deposit;

    @Column(name = "package_km")
    @Basic(optional = false)
    private Integer package_km;

    @Column(name = "additional_km_price")
    @Basic(optional = false)
    private BigDecimal additional_km_price;

    @Column(name = "additional_hour_price")
    @Basic(optional = false)
    private BigDecimal additional_hour_price;

    @Column(name = "trip_notes")
    private String trip_notes;

    @Column(name = "added_date_time")
    @Basic(optional = false)
    private LocalDateTime added_date_time;

    @Column(name = "updated_date_time")
    private LocalDateTime updated_date_time;

    @Column(name = "pick_up_odometer")
    private Integer pick_up_odometer;

    @Column(name = "return_odometer")
    private Integer return_odometer;

    @Column(name = "return_datetime")
    private LocalDateTime return_datetime;

    @Column(name = "final_rental_days")
    private Integer final_rental_days;

    @Column(name = "final_additional_hours")
    private Integer final_additional_hours;

    @Column(name = "travelled_km")
    private Integer travelled_km;

    @Column(name = "granted_km")
    private Integer granted_km;

    @Column(name = "additional_km")
    private Integer additional_km;

    @Column(name = "rental_amount")
    private BigDecimal rental_amount;

    @Column(name = "paid_amount")
    private BigDecimal paid_amount;

    @Column(name = "due_balance")
    private BigDecimal due_balance;

    @JoinColumn(name = "pick_up_location_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private PickUpLocation pick_up_location_id;

    @JoinColumn(name = "return_location_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private ReturnLocation return_location_id;

    @JoinColumn(name = "vehicle_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Vehicle vehicle_id;

    @JoinColumn(name = "package_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Package package_id;

    @JoinColumn(name = "package_duration_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private PackageDuration package_duration_id;

    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Customer customer_id;

    @JoinColumn(name = "reservation_status_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private ReservationStatus reservation_status_id;

    @JoinColumn(name = "payment_status_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private PaymentStatus payment_status_id;

    @JoinColumn(name = "added_by", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee added_by;

    @JoinColumn(name = "updated_by", referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private Employee updated_by;

    public SelfDriveReservation(String nextSDRCode) {
        this.sd_reservation_code = nextSDRCode;
    }
}

