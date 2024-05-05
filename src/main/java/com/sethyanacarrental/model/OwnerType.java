package com.sethyanacarrental.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "owner_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnerType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", unique = true)
    @Basic(optional = false)
    private String name;
}
