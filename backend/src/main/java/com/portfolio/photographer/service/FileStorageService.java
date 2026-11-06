package com.portfolio.photographer.service;

import com.portfolio.photographer.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class FileStorageService {

    private static final Set<String> ALLOWED =
            Set.of("jpg", "jpeg", "png", "webp");

    private static final long MAX_SIZE = 10L * 1024 * 1024;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private Path root() {
        return Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file was uploaded");
        }

        if (file.getSize() > MAX_SIZE) {
            throw new BadRequestException("File is too large. Max size is 10MB");
        }

        String original = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "" : file.getOriginalFilename()
        );

        int dot = original.lastIndexOf('.');
        if (dot < 0 || dot == original.length() - 1) {
            throw new BadRequestException("Invalid image extension");
        }

        String ext = original.substring(dot + 1).toLowerCase(Locale.ROOT);
        if (!ALLOWED.contains(ext)) {
            throw new BadRequestException("Only JPG, PNG and WebP images are allowed");
        }

        String id = UUID.randomUUID().toString();
        Path originals = root().resolve("originals");
        Path thumbnails = root().resolve("thumbnails");
        Path previews = root().resolve("previews");
        Path source = originals.resolve(id + "." + ext);

        try {
            Files.createDirectories(originals);
            Files.createDirectories(thumbnails);
            Files.createDirectories(previews);

            Files.copy(file.getInputStream(), source);

            convert(source, thumbnails.resolve(id + ".webp"), 800, 55);
            convert(source, previews.resolve(id + ".webp"), 1200, 65);

            return "/uploads/thumbnails/" + id + ".webp";
        } catch (Exception e) {
            deleteById(id);
            log.error("Image processing failed", e);
            throw new BadRequestException("Failed to process image");
        }
    }

    public String getThumbnailUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return null;

        if (imageUrl.startsWith("/uploads/thumbnails/")) {
            return imageUrl;
        }

        // Existing photos: generate WebP variants lazily.
        String filename = safeFilename(imageUrl);
        if (filename == null) return null;

        String id = filename.substring(0, filename.lastIndexOf('.'));
        Path legacy = root().resolve(filename).normalize();
        Path thumbnail = root().resolve("thumbnails").resolve(id + ".webp");

        try {
            if (Files.exists(thumbnail)) {
                return "/uploads/thumbnails/" + id + ".webp";
            }

            if (!legacy.startsWith(root()) || !Files.isRegularFile(legacy)) {
                return null;
            }

            Files.createDirectories(thumbnail.getParent());
            convert(legacy, thumbnail, 800, 55);

            Path preview = root().resolve("previews").resolve(id + ".webp");
            Files.createDirectories(preview.getParent());
            convert(legacy, preview, 1200, 65);

            return "/uploads/thumbnails/" + id + ".webp";
        } catch (Exception e) {
            log.error("Failed to generate legacy thumbnail: {}", imageUrl, e);
            return imageUrl;
        }
    }

    public String getPreviewUrl(String imageUrl) {
        String thumbnail = getThumbnailUrl(imageUrl);
        if (thumbnail == null ||
                !thumbnail.startsWith("/uploads/thumbnails/")) {
            return null;
        }

        String filename = thumbnail.substring(
                "/uploads/thumbnails/".length()
        );

        return "/uploads/previews/" + filename;
    }

    public void delete(String imageUrl) {
        String filename = safeFilename(imageUrl);
        if (filename == null) return;

        String id = filename.substring(0, filename.lastIndexOf('.'));

        deleteById(id);

        // Remove legacy file if this was an old upload.
        try {
            Files.deleteIfExists(root().resolve(filename).normalize());
        } catch (IOException e) {
            log.warn("Could not delete legacy image {}", filename, e);
        }
    }

    private String safeFilename(String url) {
        if (url == null || !url.startsWith("/uploads/")) return null;

        String filename = url.substring(url.lastIndexOf('/') + 1);

        if (!filename.matches("[a-zA-Z0-9._-]+") ||
                !filename.contains(".")) {
            return null;
        }

        return filename;
    }

    private void convert(Path source, Path destination,
                         int width, int quality) throws Exception {

        Process process = new ProcessBuilder(
                "cwebp", "-quiet",
                "-resize", String.valueOf(width), "0",
                "-q", String.valueOf(quality),
                source.toString(),
                "-o", destination.toString()
        ).redirectErrorStream(true).start();

        boolean finished = process.waitFor(60, TimeUnit.SECONDS);

        if (!finished) {
            process.destroyForcibly();
            throw new IOException("WebP conversion timed out");
        }

        if (process.exitValue() != 0 ||
                !Files.exists(destination) ||
                Files.size(destination) == 0) {
            throw new IOException("WebP conversion failed");
        }
    }

    private void deleteById(String id) {
        try {
            Path originals = root().resolve("originals");
            if (Files.isDirectory(originals)) {
                try (var files = Files.list(originals)) {
                    files.filter(p -> p.getFileName().toString().startsWith(id + "."))
                            .forEach(this::deleteQuietly);
                }
            }

            deleteQuietly(root().resolve("thumbnails").resolve(id + ".webp"));
            deleteQuietly(root().resolve("previews").resolve(id + ".webp"));
        } catch (IOException e) {
            log.warn("Failed to clean image files for {}", id, e);
        }
    }

    private void deleteQuietly(Path path) {
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.warn("Could not delete {}", path, e);
        }
    }
}
