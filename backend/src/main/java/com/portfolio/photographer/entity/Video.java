package com.portfolio.photographer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "videos")
public class Video extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String videoUrl; // YouTube/Vimeo link

    private String thumbnailUrl;

    @Column(nullable = false)
    private Integer displayOrder = 0;
}
