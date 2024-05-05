package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.RefundableDepositStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefundableDepositStatusRepository extends JpaRepository<RefundableDepositStatus, Integer> {
}
