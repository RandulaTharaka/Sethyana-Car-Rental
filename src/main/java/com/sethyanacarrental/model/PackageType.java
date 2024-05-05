package com.sethyanacarrental.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "package_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PackageType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", unique = true)
    @Basic(optional = false)
    private String name;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "package_id", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<PackageHasModel> packageHasModelList;
}
