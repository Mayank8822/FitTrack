import React, { useEffect, useState } from 'react';
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Stack, TextField, Typography } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import { commentOnCommunityActivity, getCommunityFeed, likeCommunityActivity } from '../services/api';

const panel = { bgcolor: '#0F172A', color: '#F8FAFC', border: '1px solid rgba(255,255,255,.08)', borderRadius: 3 };
export default function CommunityPage() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState('');
  const load = async () => {
    try { setLoading(true); const { data } = await getCommunityFeed(); setFeed(Array.isArray(data) ? data : []); setError(''); }
    catch (e) { setError(e.response?.data?.message || 'Could not load the public community feed.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const like = async (id) => {
    try { setBusy(id); await likeCommunityActivity(id); await load(); }
    catch { setError('Unable to like this activity.'); } finally { setBusy(''); }
  };
  const comment = async (id) => {
    const content = (drafts[id] || '').trim(); if (!content) return;
    try { setBusy(id); await commentOnCommunityActivity(id, content); setDrafts(v => ({ ...v, [id]: '' })); await load(); }
    catch { setError('Unable to post your comment.'); } finally { setBusy(''); }
  };
  return <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 4 }, py: 4, color: '#F8FAFC' }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
      <Box><Typography variant="h4" fontWeight={800}>Community</Typography><Typography color="#94A3B8">Discover workouts shared publicly by other athletes.</Typography></Box>
      <Button onClick={load} variant="outlined" sx={{ color: '#10E760', borderColor: '#10E760' }}>Refresh</Button>
    </Stack>
    <Alert severity="info" sx={{ my: 2 }}>Only workouts explicitly marked Public are shown. Your own workouts remain private unless you choose to share them.</Alert>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}><CircularProgress /></Box> :
      feed.length === 0 ? <Card sx={panel}><CardContent><Typography fontWeight={700}>No public workouts yet</Typography><Typography color="#94A3B8">When members share a workout publicly, it will appear here.</Typography></CardContent></Card> :
      <Stack spacing={2}>{feed.map(item => <Card key={item.id} sx={panel}><CardContent>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: '#10E760', color: '#07110A' }}>{String(item.userId || 'A').slice(0,1).toUpperCase()}</Avatar>
          <Box flex={1}><Typography fontWeight={700}>{`Athlete ${String(item.userId || '').slice(0,6)}`}</Typography><Typography variant="caption" color="#94A3B8">{item.startTime ? new Date(item.startTime).toLocaleString() : 'Workout'}</Typography></Box>
          <Chip size="small" label="PUBLIC" sx={{ color: '#10E760', bgcolor: 'rgba(16,231,96,.1)' }} />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}><DirectionsRunRoundedIcon sx={{ color: '#10E760' }}/><Typography variant="h6" fontWeight={700}>{String(item.type || 'Workout').replaceAll('_',' ')}</Typography></Stack>
        <Stack direction="row" spacing={3} flexWrap="wrap" mb={2}>
          <Typography color="#CBD5E1">{item.distanceKm ?? item.additionalMetrics?.distanceKm ?? '—'} km</Typography>
          <Typography color="#CBD5E1">{item.duration ?? '—'} min</Typography>
        </Stack>
        <Divider sx={{ borderColor: 'rgba(255,255,255,.1)', mb: 1 }}/>
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
          <Button startIcon={<FavoriteRoundedIcon />} onClick={() => like(item.id)} disabled={busy === item.id} sx={{ color: '#F472B6' }}>Like · {item.likes || 0}</Button>
          <Typography color="#94A3B8" variant="body2"><ChatBubbleOutlineRoundedIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: .5 }}/>{item.comments?.length || 0} comments</Typography>
        </Stack>
        {(item.comments || []).map(c => <Typography key={c.id} variant="body2" sx={{ py: .5, color: '#CBD5E1' }}><b>{String(c.userId || 'Athlete').slice(0,8)}:</b> {c.content}</Typography>)}
        <Stack direction="row" spacing={1} mt={1}><TextField fullWidth size="small" placeholder="Write a supportive comment..." value={drafts[item.id] || ''} onChange={e => setDrafts(v => ({ ...v, [item.id]: e.target.value }))} inputProps={{ maxLength: 500 }} sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }}/><Button variant="contained" onClick={() => comment(item.id)} disabled={busy === item.id || !(drafts[item.id] || '').trim()}>Post</Button></Stack>
      </CardContent></Card>)}</Stack>}
  </Box>;
}
