import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { deleteActivity, getActivities } from "../services/api";

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    const fetchActivities = async () => {
        try {
            const response = await getActivities();
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent opening the activity details page
        try {
            await deleteActivity(id);
            setActivities(prev => prev.filter(act => act.id !== id));
        } catch (error) {
            console.error("Error deleting activity:", error);
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Your Activities ({activities.length})
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {activities.map((activity) => (
                    <Grid item xs={12} sm={6} md={3} key={activity.id}>
                        <Card 
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow: 4
                                }
                            }}
                            onClick={() => navigate(`/activities/${activity.id}`)}
                        >
                            <CardContent>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {activity.type}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ⏱️ Duration: <strong>{activity.duration} mins</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    🔥 Calories: <strong>{activity.calories ?? activity.caloriesBurned ?? 0} kcal</strong>
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
                                <Button 
                                    size="small" 
                                    variant="text" 
                                    color="primary"
                                    onClick={() => navigate(`/activities/${activity.id}`)}
                                >
                                    View AI Insights
                                </Button>
                                <Button 
                                    size="small" 
                                    variant="outlined" 
                                    color="error"
                                    onClick={(e) => handleDelete(e, activity.id)}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {activities.length === 0 && (
                <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    No activities recorded yet. Add your first workout above!
                </Typography>
            )}
        </Box>
    );
};

export default ActivityList;
