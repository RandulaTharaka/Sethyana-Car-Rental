package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReservationStatusRepository extends JpaRepository<ReservationStatus, Integer> {

    @Query("SELECT rs FROM ReservationStatus rs WHERE rs.id IN(1,2)")
    List<ReservationStatus> limitedList();
}
