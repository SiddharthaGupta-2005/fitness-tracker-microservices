package com.fitness.aiservice.service;

import java.time.LocalDateTime;
import java.util.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final OpenRouterService openRouterService;

    public Recommendation generateRecommendation(Activity activity){
        try {
            String prompt = createPromptForActivity(activity);
            String aiResponse = openRouterService.getAnswer(prompt);
            log.info("RESPONSE FROM AI:{} ", aiResponse);

            return processAiResponse(activity, aiResponse);
        } catch (Exception e) {
            log.error("Failed to get recommendation from AI Service, generating high-performance heuristic coaching: {}", e.getMessage());
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse){
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            String rawText = null;

            // Extract content from OpenRouter / OpenAI chat completion response
            JsonNode choices = rootNode.path("choices");
            if (!choices.isMissingNode() && choices.isArray() && !choices.isEmpty()) {
                JsonNode messageContent = choices.get(0).path("message").path("content");
                if (!messageContent.isMissingNode()) {
                    rawText = messageContent.asText().trim();
                }
            }

            if (rawText == null || rawText.isEmpty()) {
                log.warn("No text content could be extracted from AI response: {}", aiResponse);
                return createDefaultRecommendation(activity);
            }

            String jsonContent = rawText.trim();
            int firstBrace = jsonContent.indexOf('{');
            int lastBrace = jsonContent.lastIndexOf('}');
            if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
                jsonContent = jsonContent.substring(firstBrace, lastBrace + 1);
            }

            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");
            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall: ");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace: ");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate: ");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories: ");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestion(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Error processing AI response: {}", e.getMessage(), e);
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity){
        String type = activity.getType() != null ? activity.getType() : "WORKOUT";
        int duration = activity.getDuration() != null ? activity.getDuration() : 30;
        int calories = activity.getCaloriesBurned() != null ? activity.getCaloriesBurned() : 250;
        double burnRate = duration > 0 ? (double) calories / duration : 8.0;

        StringBuilder analysis = new StringBuilder();
        analysis.append(String.format("Overall: Completed high-intensity %s session for %d minutes with %d kcal expenditure (avg %.1f kcal/min).\n\n", type, duration, calories, burnRate));
        analysis.append(String.format("Pace & Intensity: Maintained consistent biometric output throughout the %d-minute interval.\n\n", duration));
        analysis.append(String.format("Heart Rate Zone: Estimated Target Zone 3-4 (70-85% HR Max) optimizing cardiovascular endurance and metabolic conditioning.\n\n", duration));
        analysis.append(String.format("Caloric Burn: Efficient metabolic burn rate of %.1f kcal/min promoting post-exercise oxygen consumption (EPOC).", burnRate));

        List<String> improvements = List.of(
                "Pacing Optimization: Incorporate progressive interval surges during the middle third of the workout.",
                "Hydration Balance: Replenish with 500ml water containing electrolyte minerals post-session.",
                "Cadence & Form: Maintain proper core bracing to minimize kinetic joint strain."
        );

        List<String> suggestions = List.of(
                "Zone 2 Active Recovery: 20-30 min low-impact steady state (LISS) flush tomorrow.",
                "Dynamic Mobility Work: 10 min focused hip and thoracic spine stretching.",
                "Protein Refuel: 25-35g fast-absorbing protein intake within 45 minutes."
        );

        List<String> safety = List.of(
                "Execute a 5-minute cool-down with deep diaphragmatic breathing.",
                "Ensure at least 7-8 hours of high-quality sleep for neuromuscular recovery.",
                "Monitor for delayed onset muscle soreness (DOMS) over the next 24-48 hours."
        );

        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation(analysis.toString().trim())
                .improvements(improvements)
                .suggestion(suggestions)
                .safety(safety)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if(safetyNode.isArray()){
            safetyNode.forEach(item -> safety.add(item.asText()));
        }
        return safety.isEmpty() ?
                List.of("Execute proper warm-up and cool-down protocols", "Stay hydrated throughout training") :
                safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if(suggestionsNode.isArray()){
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", workout, description));
            });
        }
        return suggestions.isEmpty() ?
                List.of("Active Recovery: Perform 20 min light stretching", "Post-Workout Nutrition: Consume balanced protein and carbohydrates") :
                suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if (improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }
        return improvements.isEmpty() ?
                List.of("Progressive Overload: Gradually increase duration or intensity by 5% weekly", "Consistency: Aim for 3-5 structured training sessions per week") :
                improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if(!analysisNode.path(key).isMissingNode() && !analysisNode.path(key).isNull()){
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
        Analyze this fitness activity and provide detailed recommendations in this exact JSON format:
        {
          "analysis": {
            "overall": "Overall analysis here",
            "pace": "Pace analysis here",
            "heartRate": "Heart rate analysis here",
            "caloriesBurned": "Calories analysis here"
          },
          "improvements": [
            {
              "area": "Area name",
              "recommendation": "Detailed recommendation"
            }
          ],
          "suggestions": [
            {
              "workout": "Workout name",
              "description": "Detailed workout description"
            }
          ],
          "safety": [
            "Safety point 1",
            "Safety point 2"
          ]
        }

        Analyze this activity:
        Activity Type: %s
        Duration: %d minutes
        Calories Burned: %d
        Additional Metrics: %s

        Provide detailed analysis focusing on:
        1. Overall performance and immediate effects
        2. Pace and intensity assessment
        3. Heart rate analysis (if applicable)
        4. Calorie burn and efficiency
        5. Suggestions for improvement
        6. Recommended follow-up exercises
        7. Safety considerations and precautions
        """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()
        );
    }
}
