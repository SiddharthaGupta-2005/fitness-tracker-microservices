import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { getActivityDetail } from "../services/api";
import { Typography, Card, CardContent, Box, Button, CircularProgress, Alert } from "@mui/material";

const ActivityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(true);
    const pollCountRef = useRef(0);

    useEffect(() => {
        let isMounted = true;
        let timer = null;

        const fetchActivityDetail = async () => {
            try {
                const response = await getActivityDetail(id);
                if (isMounted) {
                    setRecommendation(response.data);
                    setIsGenerating(false);
                    setLoading(false);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    if (pollCountRef.current < 15) { // Poll for up to 30s
                        pollCountRef.current += 1;
                        if (isMounted) {
                            setIsGenerating(true);
                            setLoading(false);
                            timer = setTimeout(fetchActivityDetail, 2000);
                        }
                    } else {
                        if (isMounted) {
                            setIsGenerating(false);
                            setLoading(false);
                        }
                    }
                } else {
                    console.error("Error fetching recommendation", error);
                    if (isMounted) {
                        setIsGenerating(false);
                        setLoading(false);
                    }
                }
            }
        };

        fetchActivityDetail();

        return () => {
            isMounted = false;
            if (timer) clearTimeout(timer);
        };
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress />
                <Typography>Loading activity details...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/activities')} sx={{ mb: 2 }}>
                ← Back to Activities
            </Button>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>AI Recommendation & Analysis</Typography>

                    {isGenerating && !recommendation && (
                        <Box sx={{ my: 3, p: 3, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                            <CircularProgress size={36} sx={{ mb: 2 }} />
                            <Typography variant="h6" color="primary">
                                AI is analyzing your workout...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Processing your activity metrics through Gemini AI. This page will update automatically in a few seconds.
                            </Typography>
                        </Box>
                    )}

                    {recommendation && (
                        <>
                            <Typography variant="subtitle1" color="text.secondary">
                                Activity Type: {recommendation.activityType || "N/A"}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                                {recommendation.recommendation}
                            </Typography>

                            {recommendation.improvements && recommendation.improvements.length > 0 && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Suggested Improvements:</Typography>
                                    {Array.isArray(recommendation.improvements) ? (
                                        recommendation.improvements.map((item, idx) => (
                                            <Typography key={idx} variant="body2" sx={{ my: 0.5 }}>• {item}</Typography>
                                        ))
                                    ) : (
                                        <Typography variant="body2">{recommendation.improvements}</Typography>
                                    )}
                                </Box>
                            )}

                            {recommendation.suggestion && recommendation.suggestion.length > 0 && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Workout Suggestions:</Typography>
                                    {Array.isArray(recommendation.suggestion) ? (
                                        recommendation.suggestion.map((item, idx) => (
                                            <Typography key={idx} variant="body2" sx={{ my: 0.5 }}>• {item}</Typography>
                                        ))
                                    ) : (
                                        <Typography variant="body2">{recommendation.suggestion}</Typography>
                                    )}
                                </Box>
                            )}

                            {recommendation.safety && recommendation.safety.length > 0 && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Safety Tips:</Typography>
                                    {Array.isArray(recommendation.safety) ? (
                                        recommendation.safety.map((item, idx) => (
                                            <Typography key={idx} variant="body2" sx={{ my: 0.5 }}>• {item}</Typography>
                                        ))
                                    ) : (
                                        <Typography variant="body2">{recommendation.safety}</Typography>
                                    )}
                                </Box>
                            )}
                        </>
                    )}

                    {!isGenerating && !recommendation && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            No recommendation generated yet for this activity. Please check back shortly or retry.
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ActivityDetail;