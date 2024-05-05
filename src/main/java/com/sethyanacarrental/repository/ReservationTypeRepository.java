package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.ReservationType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationTypeRepository extends JpaRepository<ReservationType, Integer> {
}
