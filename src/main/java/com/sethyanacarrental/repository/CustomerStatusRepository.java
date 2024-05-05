package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.CustomerStatus;
import com.sethyanacarrental.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerStatusRepository extends JpaRepository<CustomerStatus, Integer> {
}
