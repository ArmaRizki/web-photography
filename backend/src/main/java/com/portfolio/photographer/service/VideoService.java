package com.portfolio.photographer.service;

import com.portfolio.photographer.dto.VideoRequest;
import com.portfolio.photographer.dto.VideoResponse;
import com.portfolio.photographer.entity.Video;
import com.portfolio.photographer.exception.ResourceNotFoundException;
import com.portfolio.photographer.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;

    public List<VideoResponse> getAll() {
        return videoRepository.findAllByOrderByDisplayOrderAsc().stream().map(this::toResponse).toList();
    }

    @Transactional
    public VideoResponse create(VideoRequest request) {
        Video v = new Video();
        apply(v, request);
        return toResponse(videoRepository.save(v));
    }

    @Transactional
    public VideoResponse update(Long id, VideoRequest request) {
        Video v = videoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video", id));
        apply(v, request);
        return toResponse(videoRepository.save(v));
    }

    @Transactional
    public void delete(Long id) {
        if (!videoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Video", id);
        }
        videoRepository.deleteById(id);
    }

    private void apply(Video v, VideoRequest request) {
        v.setTitle(request.title());
        v.setVideoUrl(request.videoUrl());
        v.setThumbnailUrl(request.thumbnailUrl());
        v.setDisplayOrder(request.displayOrder() == null ? 0 : request.displayOrder());
    }

    private VideoResponse toResponse(Video v) {
        return new VideoResponse(v.getId(), v.getTitle(), v.getVideoUrl(), v.getThumbnailUrl(), v.getDisplayOrder());
    }
}
