package com.epicreads.spring_boot_library.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;
import com.okta.spring.boot.oauth.Okta;


@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Disable CSRF (not recommended for production unless using stateless APIs)
        http.csrf(csrf -> csrf.disable());

        // Secure endpoints under /epicreads/books/secure/**
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/epicreads/books/secure/**",
                        "epicreads/reviews/secure/**",
                        "epicreads/messages/secure/**",
                        "epicreads/admin/secure/**")
                .authenticated()
                .anyRequest().permitAll()
        );

        // Enable OAuth2 Resource Server with JWT authentication
        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        // Add CORS configuration
        http.cors(cors -> {});

        // Set Content Negotiation Strategy
        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        // Customize 401 Unauthorized response
        Okta.configureResourceServer401ResponseBody(http);

        return http.build();
    }
}
