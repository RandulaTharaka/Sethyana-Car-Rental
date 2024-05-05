package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.SelfDriveReservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SelfDriveReservationRepository extends JpaRepository<SelfDriveReservation, Integer> {

    @Query("SELECT sd FROM SelfDriveReservation sd " +
            "WHERE (sd.sd_reservation_code LIKE CONCAT('%', :searchtext, '%') OR " +
            "sd.customer_id.first_name LIKE CONCAT('%', :searchtext, '%') OR " +
            "sd.customer_id.last_name LIKE CONCAT('%', :searchtext, '%') OR " +
            "CONCAT(sd.customer_id.first_name, ' ', sd.customer_id.last_name) LIKE CONCAT('%', :searchtext, '%') OR " +
            "sd.customer_id.company_name LIKE CONCAT('%', :searchtext, '%') OR " +
            "sd.vehicle_id.model_id.name LIKE CONCAT('%', :searchtext, '%') OR " +
            "sd.vehicle_id.license_plate LIKE CONCAT('%', :searchtext, '%') OR " +
            "sd.reservation_status_id.name LIKE CONCAT('%', :searchtext, '%'))")
    Page<SelfDriveReservation> findAll(@Param("searchtext") String searchtext, Pageable of);

    @Query(value = "SELECT CONCAT('SDR', lpad(substring(max(sdr.sd_reservation_code), 4, 10) + 1, 7, 0)) " +
            "FROM sethyana_car_rental.self_drive_reservation AS sdr;", nativeQuery = true)
    String getNextSDRCode();

    @Query(value = "SELECT sd FROM SelfDriveReservation sd " +
            "WHERE sd.vehicle_id.id=:vehicle_id AND sd.reservation_status_id = '7'")
    List<SelfDriveReservation> listByVehicleID(@Param("vehicle_id") int vehicle_id);

    @Query(value = "SELECT sd FROM SelfDriveReservation sd WHERE sd.vehicle_id.id = :vehicleId AND " +
            "sd.reservation_status_id='2' AND sd.expect_return_datetime > :returned_datetime")
    List<SelfDriveReservation> reservedListByVehicleIDAndReturnedDateTime(@Param("vehicleId") int vehicleId,
                                                                          @Param("returned_datetime") LocalDateTime returned_datetime);
}