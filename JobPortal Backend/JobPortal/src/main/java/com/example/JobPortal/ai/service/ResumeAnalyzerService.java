package com.example.JobPortal.ai.service;

import com.example.JobPortal.ai.pdf.PdfReaderUtil;
import com.example.JobPortal.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ResumeAnalyzerService {

    @Autowired
    private FileUploadUtil fileUploadUtil;

    @Autowired
    private PdfReaderUtil pdfReaderUtil;

    @Autowired
    private AIService aiService;

    public String analyzeResume(MultipartFile resume) throws IOException {

        // Step 1: Save the uploaded PDF
        String filePath = fileUploadUtil.saveFile(resume);

        // Step 2: Extract text from PDF
        String resumeText = pdfReaderUtil.extractText(filePath);

        // Step 3: Create AI Prompt
        String prompt = """
                You are an expert HR recruiter.

                Analyze the following resume.

                Resume:
                %s

                Return your response in the following format:

                Strengths:
                - ...

                Weaknesses:
                - ...

                Missing Skills:
                - ...

                Suggestions:
                - ...
                """.formatted(resumeText);

        // Step 4: Send to Gemini
        return aiService.chat(prompt);
    }
}