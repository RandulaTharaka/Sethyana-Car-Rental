package com.sethyanacarrental.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "color")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Color {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", unique = true)
    @Basic(optional = false)
    private String name;

    @Column(name = "color_code", unique = true)
    @Basic(optional = false)
    private String color_code;

/*    @OneToMany(cascade = CascadeType.ALL, mappedBy = "color_id", fetch = FetchType.LAZY, orphanRemoval = true) //orphanRemoval: for update
    private List<ModelHasColor> modelHasColorList;*/
}
