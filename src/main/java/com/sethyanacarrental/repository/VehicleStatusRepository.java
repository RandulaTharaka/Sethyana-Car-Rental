package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleStatusRepository extends JpaRepository<VehicleStatus, Integer> {
}
