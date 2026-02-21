package com.example.backend.config;

import com.example.backend.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/api-docs/**", "/swagger-ui.html","/v3/api-docs/**").permitAll()

                        // Admin routes (approval, view users) - Requires ADMIN role
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Require both ROLE and APPROVED authority for these endpoints
                        // Read-only analytics for financial analyst + Admin
                        .requestMatchers(HttpMethod.GET, "/api/analytics/**").access((authentication, context) -> {
                            boolean hasRole = authentication.get().getAuthorities().stream()
                                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_FINANCE"));
                            boolean isApproved = authentication.get().getAuthorities().stream()
                                    .anyMatch(a -> a.getAuthority().equals("APPROVED"));
                            return new org.springframework.security.authorization.AuthorizationDecision(hasRole && isApproved);
                        })

                        // Drivers management - Safety + Admin
                        .requestMatchers("/api/drivers/**").access((authentication, context) -> {
                            boolean hasRole = authentication.get().getAuthorities().stream()
                                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_SAFETY"));
                            boolean isApproved = authentication.get().getAuthorities().stream()
                                    .anyMatch(a -> a.getAuthority().equals("APPROVED"));
                            return new org.springframework.security.authorization.AuthorizationDecision(hasRole && isApproved);
                        })

                        // Trips - Dispatcher + Admin
                        .requestMatchers("/api/trips/**").access((authentication, context) -> {
                            boolean hasRole = authentication.get().getAuthorities().stream()
                                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_DISPATCHER"));
                            boolean isApproved = authentication.get().getAuthorities().stream()
                                    .anyMatch(a -> a.getAuthority().equals("APPROVED"));
                            return new org.springframework.security.authorization.AuthorizationDecision(hasRole && isApproved);
                        })
                        
                        // Default fallback requiring only authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
