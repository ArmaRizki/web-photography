package com.portfolio.photographer.config;

import com.portfolio.photographer.entity.Admin;
import com.portfolio.photographer.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        System.out.println("==================================");
        System.out.println("DataInitializer Started");
        System.out.println("==================================");

        long count = adminRepository.count();
        System.out.println("Admin Count = " + count);

        if (count == 0) {
            try {
                Admin admin = new Admin();

                admin.setUsername("admin");
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("admin123"));

                adminRepository.saveAndFlush(admin);

                System.out.println("Admin Saved Successfully");
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("Admin Already Exists");
        }
    }
}