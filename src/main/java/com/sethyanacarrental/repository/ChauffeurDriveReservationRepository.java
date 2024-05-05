package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.ChauffeurDriveReservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ChauffeurDriveReservationRepository extends JpaRepository<ChauffeurDriveReservation, Integer> {

    @Query("SELECT cd FROM ChauffeurDriveReservation cd WHERE " +
            "(cd.cd_reservation_code LIKE CONCAT('%', :searchtext, '%') OR " +
            "cd.customer_id.first_name LIKE CONCAT('%', :searchtext, '%') OR " +
            "cd.customer_id.last_name LIKE CONCAT('%', :searchtext, '%') OR " +
            "cd.customer_id.company_name LIKE CONCAT('%', :searchtext, '%')) AND " +
            "cd.driver_id.employee_id.id =:userid")
    Page<ChauffeurDriveReservation> findAll(@Param("searchtext") String searchtext, @Param("userid") Integer userid, Pageable of);
//  has written AS JPA class level Query: return type 'Page' // this query can't handle objects which are null passing

    @Query(value = "SELECT CONCAT('CDR', lpad(substring(max(cdr.cd_reservation_code), 4, 10) + 1, 7, 0)) FROM " +
            "sethyana_car_rental.chauffeur_drive_reservation AS cdr;", nativeQuery = true)
    String getNextCDRCode();

    @Query("SELECT NEW ChauffeurDriveReservation(cdr.id, cdr.cd_reservation_code, cdr.customer_id, " +
            "cdr.pick_up_location, cdr.drop_off_location, cdr.driver_id) " +
            "FROM ChauffeurDriveReservation cdr WHERE cdr.vehicle_id.id=:vehicle_id")
    List<ChauffeurDriveReservation> listByVehicle(@Param("vehicle_id") Integer vehicle_id);

    @Query(value = "SELECT cd FROM ChauffeurDriveReservation cd " +
            "WHERE cd.vehicle_id.id=:vehicleId AND cd.reservation_status_id = '7'")
    List<ChauffeurDriveReservation> listByVehicleID(int vehicleId);

    @Query(value = "SELECT cd FROM ChauffeurDriveReservation cd " +
            "WHERE cd.vehicle_id.id = :vehicleId AND cd.reservation_status_id='2' AND cd.expect_return_datetime > :returned_datetime")
    List<ChauffeurDriveReservation> reservedListByVehicleIDAndReturnedDateTime(int vehicleId, LocalDateTime returned_datetime);

    @Query("SELECT cd FROM ChauffeurDriveReservation cd WHERE " +
            "(cd.cd_reservation_code LIKE CONCAT('%', :searchtext, '%') OR " +
            "cd.customer_id.first_name LIKE CONCAT('%', :searchtext, '%') OR " +
            "cd.customer_id.last_name LIKE CONCAT('%', :searchtext, '%') OR " +
            "CONCAT(cd.customer_id.first_name, ' ', cd.customer_id.last_name) LIKE CONCAT('%', :searchtext, '%') OR " +
            "cd.customer_id.company_name LIKE CONCAT('%', :searchtext, '%') OR " +
            "cd.vehicle_id.model_id.name LIKE CONCAT('%', :searchtext, '%') OR " +
            "cd.vehicle_id.license_plate LIKE CONCAT('%', :searchtext, '%') OR " +
            "cd.driver_id.calling_name LIKE CONCAT('%', :searchtext, '%') OR " +
            "cd.reservation_status_id.name LIKE CONCAT('%', :searchtext, '%'))")
    Page<ChauffeurDriveReservation> findAll(@Param("searchtext") String searchtext, Pageable of);
}