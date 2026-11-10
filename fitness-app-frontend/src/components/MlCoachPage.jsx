import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid2,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { getMlRecommendation } from '../services/api';

const surface = {
  bgcolor: '#0F172A',
  color: '#F8FAFC',
  border: '1px solid rgba(255,255,255,.08)',
  borderRadius: 3
};

const innerCard = {
  bgcolor: '#1E293B',
  border: '1px solid rgba(255,255,255,.06)',
  borderRadius: 2,
  p: 2.5
};

export default function MlCoachPage() {
  const [data, setData] = useState({
    age: 24,
    weight: 70,
    height: 175,
    gender: 'MALE',
    fitnessLevel: 'INTERMEDIATE',
    goal: 'WEIGHT_LOSS',
    targetActivity: 'AUTO',
    dietaryPreference: 'STANDARD',
    weeklyWorkouts: 4,
    averageDuration: 45,
    averageCalories: 300
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const submit = async () => {
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const r = await getMlRecommendation(data);
      setResult(r.data);
    } catch (e) {
      setError(
        e.response?.data?.detail ||
        'ML model is not available yet. Train it with validated historical activity data first.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1050, mx: 'auto', px: 3, py: 4, color: '#F8FAFC' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AutoAwesomeRoundedIcon sx={{ color: '#38BDF8', fontSize: 36 }} />
          SmartFit AI & ML Coach
        </Typography>
        <Typography color="#94A3B8" sx={{ mt: 0.5 }}>
          Personalized activity recommendation, tailored weekly workout schedule, and clinical nutrition plan.
        </Typography>
      </Box>

      {/* Input Parameters Form */}
      <Card sx={{ ...surface, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, color: '#38BDF8' }}>
            Your Fitness Profile & Goals
          </Typography>

          <Stack spacing={2.5}>
            {/* Row 1: Age, Weight, Height, Gender */}
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <TextField
                  label="Age"
                  type="number"
                  value={data.age}
                  onChange={e => set('age', Number(e.target.value))}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <TextField
                  label="Weight (kg)"
                  type="number"
                  value={data.weight}
                  onChange={e => set('weight', Number(e.target.value))}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <TextField
                  label="Height (cm)"
                  type="number"
                  value={data.height}
                  onChange={e => set('height', Number(e.target.value))}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={data.gender}
                    label="Gender"
                    onChange={e => set('gender', e.target.value)}
                  >
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
            </Grid2>

            {/* Row 2: Target Activity & Primary Goal */}
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Target Activity</InputLabel>
                  <Select
                    value={data.targetActivity}
                    label="Target Activity"
                    onChange={e => set('targetActivity', e.target.value)}
                  >
                    <MenuItem value="AUTO">🤖 Recommend Best Activity (ML Model)</MenuItem>
                    <MenuItem value="WEIGHTLIFTING">🏋️ Weightlifting & Strength</MenuItem>
                    <MenuItem value="RUNNING">🏃 Running & Jogging</MenuItem>
                    <MenuItem value="CYCLING">🚴 Cycling</MenuItem>
                    <MenuItem value="SWIMMING">🏊 Swimming</MenuItem>
                    <MenuItem value="HIIT">⚡ High-Intensity Interval Training (HIIT)</MenuItem>
                    <MenuItem value="YOGA">🧘 Yoga & Mobility</MenuItem>
                    <MenuItem value="WALKING">🚶 Walking & Incline Rucking</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Primary Fitness Goal</InputLabel>
                  <Select
                    value={data.goal}
                    label="Primary Fitness Goal"
                    onChange={e => set('goal', e.target.value)}
                  >
                    <MenuItem value="WEIGHT_LOSS">🔥 Weight Loss / Fat Burn</MenuItem>
                    <MenuItem value="MUSCLE_GAIN">💪 Muscle Gain / Hypertrophy</MenuItem>
                    <MenuItem value="STRENGTH">🏋️ Maximum Strength</MenuItem>
                    <MenuItem value="ENDURANCE">⚡ Endurance & Stamina</MenuItem>
                    <MenuItem value="GENERAL_FITNESS">❤️ General Fitness & Longevity</MenuItem>
                    <MenuItem value="FLEXIBILITY">🧘 Flexibility & Joint Health</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
            </Grid2>

            {/* Row 3: Fitness Level, Dietary Preference, Frequency, Duration */}
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Fitness Level</InputLabel>
                  <Select
                    value={data.fitnessLevel}
                    label="Fitness Level"
                    onChange={e => set('fitnessLevel', e.target.value)}
                  >
                    <MenuItem value="BEGINNER">Beginner</MenuItem>
                    <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                    <MenuItem value="ADVANCED">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Dietary Preference</InputLabel>
                  <Select
                    value={data.dietaryPreference}
                    label="Dietary Preference"
                    onChange={e => set('dietaryPreference', e.target.value)}
                  >
                    <MenuItem value="STANDARD">Standard / High Protein</MenuItem>
                    <MenuItem value="VEGETARIAN">Vegetarian</MenuItem>
                    <MenuItem value="VEGAN">Vegan (Plant-Based)</MenuItem>
                    <MenuItem value="KETO">Keto / Low-Carb</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <TextField
                  label="Workouts / Week"
                  type="number"
                  value={data.weeklyWorkouts}
                  onChange={e => set('weeklyWorkouts', Math.min(6, Math.max(2, Number(e.target.value))))}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <TextField
                  label="Avg Duration (min)"
                  type="number"
                  value={data.averageDuration}
                  onChange={e => set('averageDuration', Number(e.target.value))}
                  fullWidth
                />
              </Grid2>
            </Grid2>

            {/* Submit Button */}
            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesomeRoundedIcon />}
              onClick={submit}
              disabled={busy}
              sx={{
                py: 1.5,
                bgcolor: '#0284C7',
                fontWeight: 700,
                fontSize: '1rem',
                '&:hover': { bgcolor: '#0369A1' }
              }}
            >
              {busy ? 'Generating Your Customized Plan…' : 'Generate Full Diet & Workout Plan'}
            </Button>

            {error && <Alert severity="warning">{error}</Alert>}
          </Stack>
        </CardContent>
      </Card>

      {/* Generated Plan Section */}
      {result && (
        <Box sx={{ mt: 4 }}>
          {/* Hero Overview Card */}
          <Card
            sx={{
              ...surface,
              mb: 3,
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
                <Box>
                  <Typography variant="overline" sx={{ color: '#38BDF8', letterSpacing: 1.5, fontWeight: 700 }}>
                    Selected Activity & Plan Focus
                  </Typography>
                  <Typography variant="h4" fontWeight={900} sx={{ color: '#F8FAFC', textTransform: 'capitalize' }}>
                    {result.recommendedActivity.toLowerCase()}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip label={`Goal: ${data.goal.replaceAll('_', ' ')}`} color="info" size="small" />
                    <Chip label={`Level: ${data.fitnessLevel}`} variant="outlined" size="small" sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#CBD5E1' }} />
                    <Chip label={`Confidence: ${(result.confidence * 100).toFixed(0)}%`} size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }} />
                  </Stack>
                </Box>

                <Grid2 container spacing={2} sx={{ minWidth: { md: 450 } }}>
                  <Grid2 size={6}>
                    <Box sx={{ ...innerCard, textAlign: 'center', py: 1.5 }}>
                      <LocalFireDepartmentRoundedIcon sx={{ color: '#F97316', mb: 0.5 }} />
                      <Typography variant="h5" fontWeight={800} color="#F8FAFC">
                        {result.dietPlan?.dailyCalories || 2000}
                      </Typography>
                      <Typography variant="caption" color="#94A3B8">
                        Daily Target Calories
                      </Typography>
                    </Box>
                  </Grid2>
                  <Grid2 size={6}>
                    <Box sx={{ ...innerCard, textAlign: 'center', py: 1.5 }}>
                      <WaterDropRoundedIcon sx={{ color: '#38BDF8', mb: 0.5 }} />
                      <Typography variant="h5" fontWeight={800} color="#F8FAFC">
                        {result.dietPlan?.hydrationLiters || 2.5}L
                      </Typography>
                      <Typography variant="caption" color="#94A3B8">
                        Hydration / Day
                      </Typography>
                    </Box>
                  </Grid2>
                </Grid2>
              </Stack>
            </CardContent>
          </Card>

          {/* Navigation Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              textColor="inherit"
              TabIndicatorProps={{ sx: { bgcolor: '#38BDF8', height: 3 } }}
            >
              <Tab
                icon={<RestaurantRoundedIcon />}
                iconPosition="start"
                label="Diet & Nutrition Plan"
                sx={{ fontWeight: 700, fontSize: '0.95rem' }}
              />
              <Tab
                icon={<FitnessCenterRoundedIcon />}
                iconPosition="start"
                label="Weekly Workout Schedule"
                sx={{ fontWeight: 700, fontSize: '0.95rem' }}
              />
            </Tabs>
          </Box>

          {/* Tab 1: Diet & Nutrition */}
          {activeTab === 0 && result.dietPlan && (
            <Stack spacing={3}>
              {/* Macro Breakdown */}
              <Card sx={surface}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: '#38BDF8' }}>
                    Daily Macronutrient Targets
                  </Typography>
                  <Typography variant="body2" color="#94A3B8" sx={{ mb: 2.5 }}>
                    {result.dietPlan.calorieNote} (BMR: {result.dietPlan.bmr} kcal | TDEE: {result.dietPlan.tdee} kcal)
                  </Typography>

                  <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                      <Box sx={{ ...innerCard, borderLeft: '4px solid #38BDF8' }}>
                        <Typography variant="caption" color="#94A3B8" fontWeight={600}>
                          PROTEIN ({result.dietPlan.macros.proteinPercent}%)
                        </Typography>
                        <Typography variant="h5" fontWeight={800} sx={{ my: 0.5 }}>
                          {result.dietPlan.macros.proteinGrams}g
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={result.dietPlan.macros.proteinPercent * 1.5}
                          sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#38BDF8' } }}
                        />
                      </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                      <Box sx={{ ...innerCard, borderLeft: '4px solid #F59E0B' }}>
                        <Typography variant="caption" color="#94A3B8" fontWeight={600}>
                          CARBOHYDRATES ({result.dietPlan.macros.carbsPercent}%)
                        </Typography>
                        <Typography variant="h5" fontWeight={800} sx={{ my: 0.5 }}>
                          {result.dietPlan.macros.carbsGrams}g
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={result.dietPlan.macros.carbsPercent * 1.2}
                          sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#F59E0B' } }}
                        />
                      </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                      <Box sx={{ ...innerCard, borderLeft: '4px solid #10B981' }}>
                        <Typography variant="caption" color="#94A3B8" fontWeight={600}>
                          HEALTHY FATS ({result.dietPlan.macros.fatPercent}%)
                        </Typography>
                        <Typography variant="h5" fontWeight={800} sx={{ my: 0.5 }}>
                          {result.dietPlan.macros.fatGrams}g
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={result.dietPlan.macros.fatPercent * 1.5}
                          sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#10B981' } }}
                        />
                      </Box>
                    </Grid2>
                  </Grid2>
                </CardContent>
              </Card>

              {/* Meals List */}
              <Card sx={surface}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#38BDF8' }}>
                    Personalized Meal Breakdown ({data.dietaryPreference})
                  </Typography>

                  <Stack spacing={2}>
                    {result.dietPlan.meals.map((meal, idx) => (
                      <Box key={idx} sx={innerCard}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight={700} color="#F1F5F9">
                            {meal.name}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: { xs: 0.5, sm: 0 } }}>
                            <Chip label={`~${meal.targetCalories} kcal`} size="small" sx={{ bgcolor: 'rgba(249, 115, 22, 0.15)', color: '#FB923C' }} />
                            <Chip label={`Protein: ${meal.proteinEst}`} size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }} />
                          </Stack>
                        </Stack>
                        <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.06)' }} />
                        <Stack spacing={0.6}>
                          {meal.items.map((item, itemIdx) => (
                            <Typography key={itemIdx} variant="body2" color="#CBD5E1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span style={{ color: '#38BDF8' }}>•</span> {item}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Nutrition Guidelines */}
              <Card sx={surface}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, color: '#10B981', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleRoundedIcon /> Diet & Hydration Rules
                  </Typography>
                  <Stack spacing={1}>
                    {result.dietPlan.guidelines.map((g, i) => (
                      <Typography key={i} variant="body2" color="#CBD5E1">
                        <b>{i + 1}.</b> {g}
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* Tab 2: Workout Plan */}
          {activeTab === 1 && result.activityPlan && (
            <Stack spacing={3}>
              {/* Weekly Schedule */}
              <Card sx={surface}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonthRoundedIcon /> 7-Day Training Schedule ({result.activityPlan.workoutsPerWeek} Workout Days)
                  </Typography>

                  <Stack spacing={2}>
                    {result.activityPlan.weeklySchedule.map((day, idx) => {
                      const isWorkout = day.type === 'WORKOUT';
                      return (
                        <Box
                          key={idx}
                          sx={{
                            ...innerCard,
                            borderLeft: isWorkout ? '4px solid #38BDF8' : '4px solid #A855F7',
                            bgcolor: isWorkout ? '#1E293B' : '#141E33'
                          }}
                        >
                          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 1 }}>
                            <Box>
                              <Typography variant="caption" sx={{ color: isWorkout ? '#38BDF8' : '#C084FC', fontWeight: 800 }}>
                                {day.day}
                              </Typography>
                              <Typography variant="subtitle1" fontWeight={700} color="#F8FAFC">
                                {day.title}
                              </Typography>
                            </Box>
                            <Stack direction="row" spacing={1} sx={{ mt: { xs: 0.5, sm: 0 } }}>
                              <Chip
                                label={day.type}
                                size="small"
                                sx={{
                                  bgcolor: isWorkout ? 'rgba(56, 189, 248, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                                  color: isWorkout ? '#38BDF8' : '#C084FC',
                                  fontWeight: 700
                                }}
                              />
                              <Chip label={day.duration} size="small" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#94A3B8' }} />
                            </Stack>
                          </Stack>
                          <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.06)' }} />
                          <Stack spacing={0.6}>
                            {day.exercises.map((ex, exIdx) => (
                              <Typography key={exIdx} variant="body2" color="#CBD5E1">
                                <span style={{ color: isWorkout ? '#38BDF8' : '#C084FC' }}>›</span> {ex}
                              </Typography>
                            ))}
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>

              {/* Warm-Up & Cool-Down Protocols */}
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Card sx={surface}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5, color: '#F59E0B' }}>
                        ⚡ Dynamic Warm-Up (5–10 mins)
                      </Typography>
                      <Stack spacing={1}>
                        {result.activityPlan.warmup.map((w, i) => (
                          <Typography key={i} variant="body2" color="#CBD5E1">
                            • {w}
                          </Typography>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Card sx={surface}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5, color: '#38BDF8' }}>
                        🧘 Cool-Down & Mobility (5 mins)
                      </Typography>
                      <Stack spacing={1}>
                        {result.activityPlan.cooldown.map((c, i) => (
                          <Typography key={i} variant="body2" color="#CBD5E1">
                            • {c}
                          </Typography>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid2>
              </Grid2>

              {/* Progression & Safety Tips */}
              <Card sx={surface}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, color: '#10B981', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TipsAndUpdatesRoundedIcon /> Progression & Recovery Rules
                  </Typography>
                  <Stack spacing={1}>
                    {result.activityPlan.progressionTips.map((tip, i) => (
                      <Typography key={i} variant="body2" color="#CBD5E1">
                        <b>{i + 1}.</b> {tip}
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}

          <Typography variant="caption" color="#64748B" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
            {result.disclaimer}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
