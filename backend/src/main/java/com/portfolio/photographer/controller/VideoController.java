package com.portfolio.photographer.controller;

import com.portfolio.photographer.dto.VideoRequest;
import com.portfolio.photographer.dto.VideoResponse;
import com.portfolio.photographer.service.VideoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @GetMapping("/api/public/videos")
    public ResponseEntity<List<VideoResponse>> getAll() {
        return ResponseEntity.ok(videoService.getAll());
    }

    @PostMapping("/api/admin/videos")
    public ResponseEntity<VideoResponse> create(@Valid @RequestBody VideoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(videoService.create(request));
    }

    @PutMapping("/api/admin/videos/{id}")
    public ResponseEntity<VideoResponse> update(@PathVariable Long id, @Valid @RequestBody VideoRequest request) {
        return ResponseEntity.ok(videoService.update(id, request));
    }

    @DeleteMapping("/api/admin/videos/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        videoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
