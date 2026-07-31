package com.example.JobPortal.config;

import com.example.JobPortal.user.entity.Role;
import com.example.JobPortal.user.entity.User;
import com.example.JobPortal.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        User user = userRepository.findByEmail(email);
        if (user == null) {

            user = new User();

            user.setEmail(email);
            user.setUsername(name);
            user.setPassword(
                    new BCryptPasswordEncoder().encode(UUID.randomUUID().toString())
            );
            user.setRole(Role.JOB_SEEKER);
            user.setCreatedAt(LocalDateTime.now());

            userRepository.save(user);
        }
        String token = jwtUtil.generateToken(user.getEmail());
        response.sendRedirect(
                "http://localhost:5173/oauth-success?token=" + token
        );
    }
}
