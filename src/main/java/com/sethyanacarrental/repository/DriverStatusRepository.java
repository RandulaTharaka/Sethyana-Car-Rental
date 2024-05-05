package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.DriverStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverStatusRepository extends JpaRepository<DriverStatus, Integer> {
}
