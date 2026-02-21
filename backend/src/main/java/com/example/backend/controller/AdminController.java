package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.enums.UserRole;
import com.example.backend.exception.BusinessRuleException;
import com.example.backend.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Operations", description = "Manage users and approvals")
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/pending-users")
    @Operation(summary = "Get all users waiting for approval")
    public ResponseEntity<List<User>> getPendingUsers() {
        return ResponseEntity.ok(userRepository.findByIsApprovedFalseAndRoleNot(UserRole.ADMIN));
    }

    @PostMapping("/users/{id}/approve")
    @Operation(summary = "Approve a user account")
    public ResponseEntity<User> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("User not found"));
        
        user.setIsApproved(true);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/users/{id}/reject")
    @Operation(summary = "Reject/Delete a user account request")
    public ResponseEntity<String> rejectUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new BusinessRuleException("User not found");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User request rejected and deleted");
    }
}
