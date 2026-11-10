import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { getFitnessProfile, updateFitnessProfile } from '../services/api';
const surface = { bgcolor: '#0F172A', color: '#F8FAFC', border: '1px solid rgba(255,255,255,.08)', borderRadius: 3 };
export default function FitnessProfilePage() {
  const [form,setForm] = useState({}); const [loading,setLoading] = useState(true); const [saving,setSaving] = useState(false); const [message,setMessage] = useState('');
  useEffect(()=>{ getFitnessProfile().then(r=>setForm(r.data||{})).catch(()=>setMessage('Unable to load your profile.')).finally(()=>setLoading(false)); },[]);
  const change=(key,value)=>setForm(v=>({...v,[key]:value}));
  const save=async()=>{ setSaving(true); setMessage(''); try { const r=await updateFitnessProfile(form); setForm(r.data); setMessage('Profile and privacy settings saved.'); } catch(e){setMessage(e.response?.data?.message||'Unable to save profile.');} finally{setSaving(false);} };
  if(loading) return <Box sx={{display:'flex',justifyContent:'center',p:8}}><CircularProgress/></Box>;
  return <Box sx={{maxWidth:900,mx:'auto',px:3,py:4,color:'#F8FAFC'}}><Typography variant="h4" fontWeight={800} mb={1}>Fitness profile</Typography><Typography color="#94A3B8" mb={3}>Personalize your fitness goals and choose what can be shared.</Typography>
    {message && <Alert severity={message.includes('saved')?'success':'error'} sx={{mb:2}}>{message}</Alert>}
    <Card sx={surface}><CardContent><Stack spacing={2}>
      <Stack direction={{xs:'column',sm:'row'}} spacing={2}>
        <TextField label="Age" type="number" value={form.age??''} onChange={e=>change('age',e.target.value?Number(e.target.value):null)} fullWidth/>
        <TextField label="Height (cm)" type="number" value={form.heightCm??''} onChange={e=>change('heightCm',e.target.value?Number(e.target.value):null)} fullWidth/>
        <TextField label="Weight (kg)" type="number" value={form.weightKg??''} onChange={e=>change('weightKg',e.target.value?Number(e.target.value):null)} fullWidth/>
      </Stack>
      <FormControl fullWidth><InputLabel>Fitness level</InputLabel><Select value={form.fitnessLevel||'BEGINNER'} label="Fitness level" onChange={e=>change('fitnessLevel',e.target.value)}><MenuItem value="BEGINNER">Beginner</MenuItem><MenuItem value="INTERMEDIATE">Intermediate</MenuItem><MenuItem value="ADVANCED">Advanced</MenuItem></Select></FormControl>
      <FormControl fullWidth><InputLabel>Fitness goal</InputLabel><Select value={form.fitnessGoal||'GENERAL_FITNESS'} label="Fitness goal" onChange={e=>change('fitnessGoal',e.target.value)}>{['WEIGHT_LOSS','MUSCLE_GAIN','ENDURANCE','GENERAL_FITNESS','STRENGTH','FLEXIBILITY'].map(v=><MenuItem key={v} value={v}>{v.replaceAll('_',' ')}</MenuItem>)}</Select></FormControl>
      <Stack direction={{xs:'column',sm:'row'}} spacing={2}><TextField fullWidth label="Daily step goal" type="number" value={form.dailyStepGoal??8000} onChange={e=>change('dailyStepGoal',Number(e.target.value))}/><TextField fullWidth label="Daily calorie target" type="number" value={form.dailyCalorieGoal??2000} onChange={e=>change('dailyCalorieGoal',Number(e.target.value))}/></Stack>
      <Typography variant="h6" fontWeight={700}>Privacy controls</Typography>
      {[
        ['shareActivities','Enable public activity sharing'],
      ].map(([key,label])=><Stack key={key} direction="row" alignItems="center" justifyContent="space-between"><Typography>{label}</Typography><input type="checkbox" checked={Boolean(form[key])} onChange={e=>change(key,e.target.checked)} /></Stack>)}
      <Alert severity="info">Your activities are private by default. Public sharing is an explicit choice for each workout; enabling the profile setting does not publish old private workouts.</Alert>
      <Button variant="contained" onClick={save} disabled={saving}>{saving?'Saving…':'Save profile'}</Button>
    </Stack></CardContent></Card></Box>;
}
