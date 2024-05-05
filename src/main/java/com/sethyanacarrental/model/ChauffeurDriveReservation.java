package com.sethyanacarrental.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "chauffeur_drive_reservation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChauffeurDriveReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "cd_reservation_code", unique = true)
    @Basic(optional = false)
    private String cd_reservation_code;

    @Column(name = "expect_pick_up_datetime")
    @Basic(optional = false)
    private LocalDateTime expect_pick_up_datetime;

    @Column(name = "pick_up_location")
    @Basic(optional = false)
    private String pick_up_location;

    @Column(name = "pick_up_charge")
    private BigDecimal pick_up_charge;

    @Column(name = "drop_off_location")
    @Basic(optional = false)
    private String drop_off_location;

    @Column(name = "stop_location_1")
    private String stop_location_1;

    @Column(name = "stop_location_2")
    private String stop_location_2;

    @Column(name = "stop_location_3")
    private String stop_location_3;

    @Column(name = "package_price")
    @Basic(optional = false)
    private BigDecimal package_price;

    @Column(name = "package_km")
    @Basic(optional = false)
    private Integer package_km;

    @Column(name = "expect_return_datetime")
    @Basic(optional = false)
    private LocalDateTime expect_return_datetime;

    @Column(name = "additional_km_price")
    @Basic(optional = false)
    private BigDecimal additional_km_price;

    @Column(name = "additional_hour_price")
    @Basic(optional = false)
    private BigDecimal additional_hour_price;

    @Column(name = "added_date_time")
    @Basic(optional = false)
    private LocalDateTime added_date_time;

    @Column(name = "updated_date_time")
    private LocalDateTime updated_date_time;

    @Column(name = "trip_notes")
    private String trip_notes;

    @Column(name = "pick_up_odometer")
    private Integer pick_up_odometer;

    @Column(name = "drop_off_odometer")
    private Integer drop_off_odometer;

    @Column(name = "trip_start_datetime")
    private LocalDateTime trip_start_datetime;

    @Column(name = "trip_end_datetime")
    private LocalDateTime trip_end_datetime;

    @Column(name = "final_trip_distance_km")
    private Integer final_trip_distance_km;

    @Column(name = "final_trip_duration")
    private Integer final_trip_duration;

    @Column(name = "additional_km")
    private Integer additional_km;

    @Column(name = "additional_duration")
    private Integer additional_duration;

    @Column(name = "rental_amount")
    @Basic(optional = false)
    private BigDecimal rental_amount;

    @Column(name = "paid_amount")
    private BigDecimal paid_amount;

    @Column(name = "due_balance")
    private BigDecimal due_balance;

    @JoinColumn(name = "driver_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)

    private Driver driver_id;

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

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "updated_by", referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private Employee updated_by;

    public ChauffeurDriveReservation(String nextCDRCode) {
        this.cd_reservation_code = nextCDRCode;
    }

    public ChauffeurDriveReservation(Integer id, String cd_reservation_code, Customer customer_id, String pick_up_location, String drop_off_location, Driver driver_id) {
        this.id = id;
        this.cd_reservation_code = cd_reservation_code;
        this.customer_id = customer_id;
        this.pick_up_location = pick_up_location;
        this.drop_off_location = drop_off_location;
        this.driver_id = driver_id;
    }
}

