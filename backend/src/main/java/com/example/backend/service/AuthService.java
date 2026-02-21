package com.example.backend.service;

import com.example.backend.dto.AuthDTO;
import com.example.backend.entity.User;
import com.example.backend.enums.UserRole;
import com.example.backend.exception.BusinessRuleException;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new BusinessRuleException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessRuleException("User not found"));

        if (!user.getIsApproved()) {
            throw new BusinessRuleException("Account is pending approval from Admin");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getIsApproved());
        return new AuthDTO.AuthResponse(token, user.getEmail(), user.getName(), user.getPhone(), user.getAddress(), user.getRole(), user.getIsApproved());
    }

    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (request.getRole() == UserRole.ADMIN) {
            throw new BusinessRuleException("Cannot register as an ADMIN");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessRuleException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(request.getRole())
                .isApproved(false)
                .build();

        userRepository.save(user);

        // Do not generate token on register since they are pending approval, 
        // or return a basic token if required by frontend rules
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getIsApproved());
        return new AuthDTO.AuthResponse(token, user.getEmail(), user.getName(), user.getPhone(), user.getAddress(), user.getRole(), user.getIsApproved());
    }
}
