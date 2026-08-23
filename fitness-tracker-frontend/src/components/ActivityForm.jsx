import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import { addActivity } from '../services/api';

const ActivityForm = ({ onActivitiesAdded }) => {

  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: "",
    caloriesBurned: "",
    additionalMetrics: {},
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      await addActivity({
        ...activity,
        userId: userId,
        duration: Number(activity.duration),
        caloriesBurned: Number(activity.caloriesBurned),
        startTime: new Date().toISOString()
      });
      if (onActivitiesAdded) {
        onActivitiesAdded();
      }
      setActivity({ type: "RUNNING", duration: "", caloriesBurned: "", additionalMetrics: {} });

    } catch (error) {
      console.error("Error adding activities", error);
    }

  }
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <FormControl>
        <InputLabel>Activity Type</InputLabel>
        <Select value={activity.type} onChange={(e) => setActivity({ ...activity, type: e.target.value })}>
          <MenuItem value="RUNNING">Running</MenuItem>
          <MenuItem value="WALKING">Walking</MenuItem>
          <MenuItem value="SWIMMING">Swimming</MenuItem>
        </Select>
      </FormControl>
      <TextField fullWidth
        label="Duration (minutes)"
        value={activity.duration}
        onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
        type="number"
        required
        margin="normal"
      />
      <TextField fullWidth
        label="Calories Burned"
        value={activity.caloriesBurned}
        onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
        type="number"
        required
        margin="normal"
      />
      <Button type="submit" variant="contained">Add Activity</Button>

    </Box>
  )
}




export default ActivityForm