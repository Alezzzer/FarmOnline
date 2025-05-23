package com.example.basta.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	
	    private final JwtTokenProvider jwtTokenProvider;
	    private final UserDetailsService userDetailsService;

	    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, 
	                                 UserDetailsService userDetailsService) {
	        this.jwtTokenProvider = jwtTokenProvider;
	        this.userDetailsService = userDetailsService;
	    }

	    @Override
	    protected void doFilterInternal(HttpServletRequest request, 
	                                   HttpServletResponse response, 
	                                   FilterChain filterChain)
	            throws ServletException, IOException {
	        
	        try {
	            String token = getTokenFromRequest(request);
	            
	            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
	                String username = jwtTokenProvider.getUsername(token);
	                
	                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
	                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
	                    
	                    UsernamePasswordAuthenticationToken authToken = 
	                        new UsernamePasswordAuthenticationToken(
	                            userDetails, 
	                            null,
	                            userDetails.getAuthorities());
	                    
	                    authToken.setDetails(
	                        new WebAuthenticationDetailsSource().buildDetails(request));
	                    
	                    SecurityContextHolder.getContext().setAuthentication(authToken);
	                }
	            }
	        } catch (Exception ex) {
	            logger.error("Cannot set user authentication", ex);
	        }
	        
	        filterChain.doFilter(request, response);
	    }

	    private String getTokenFromRequest(HttpServletRequest request) {
	        String bearerToken = request.getHeader("Authorization");
	        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
	            return bearerToken.substring(7);
	        }
	        return null;
	    }
	}