package com.example.JobPortal.ai.controller;

import com.example.JobPortal.ai.dto.ChatRequest;
import com.example.JobPortal.ai.dto.ChatResponse;
import com.example.JobPortal.ai.service.AIService;
import com.example.JobPortal.ai.service.ResumeAnalyzerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @Autowired
    private ResumeAnalyzerService resumeAnalyzerService;

    // Day 2 - Chat API
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {

        String response = aiService.chat(request.getPrompt());

        return ResponseEntity.ok(new ChatResponse(response));
    }

    // Day 3 - Resume Analyzer API
    @PostMapping("/analyze-resume")
    public ResponseEntity<String> analyzeResume(
            @RequestParam("resume") MultipartFile resume
    ) throws IOException {

        String analysis = resumeAnalyzerService.analyzeResume(resume);

        return ResponseEntity.ok(analysis);
    }
}