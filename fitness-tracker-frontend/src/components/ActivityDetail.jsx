import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getActivityDetail } from "../services/api";
import { Typography, Card, CardContent, Box, Button } from "@mui/material";

const ActivityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivityDetail = async () => {
            try {
                const response = await getActivityDetail(id);
                setRecommendation(response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setRecommendation(null);
                } else {
                    console.error("Error fetching recommendation", error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchActivityDetail();
    }, [id]);

    if (loading) {
        return <Typography sx={{ p: 2 }}>Loading recommendations...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/activities')} sx={{ mb: 2 }}>
                ← Back to Activities
            </Button>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>AI Recommendation & Analysis</Typography>
                    {recommendation ? (
                        <>
                            <Typography variant="subtitle1" color="text.secondary">
                                Activity Type: {recommendation.activityType || "N/A"}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                {recommendation.recommendation}
                            </Typography>
                            {recommendation.improvements && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h6">Suggested Improvements:</Typography>
                                    {Array.isArray(recommendation.improvements) ? (
                                        recommendation.improvements.map((item, idx) => (
                                            <Typography key={idx} variant="body2">• {item}</Typography>
                                        ))
                                    ) : (
                                        <Typography variant="body2">{recommendation.improvements}</Typography>
                                    )}
                                </Box>
                            )}
                            {recommendation.safetySuggestions && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h6">Safety Tips:</Typography>
                                    {Array.isArray(recommendation.safetySuggestions) ? (
                                        recommendation.safetySuggestions.map((item, idx) => (
                                            <Typography key={idx} variant="body2">• {item}</Typography>
                                        ))
                                    ) : (
                                        <Typography variant="body2">{recommendation.safetySuggestions}</Typography>
                                    )}
                                </Box>
                            )}
                        </>
                    ) : (
                        <Typography color="text.secondary">
                            No recommendation generated yet for this activity. AI processing may still be underway.
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ActivityDetail;