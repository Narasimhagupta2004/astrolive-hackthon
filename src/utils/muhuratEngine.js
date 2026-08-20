import { intents, freeformKeywords, buildPanchang14, findHoraBlock, fmtHour, houseFor } from '../data/muhuratData';
import { rashis } from '../data/appData';
import { askGeminiJSON, isGeminiConfigured } from './geminiClient';

export function resolveIntent({ intentId, intentText }) {
  if (intentId) {
    const preset = intents.find((i) => i.id === intentId);
    if (preset) return preset;
  }
  const text = (intentText || '').toLowerCase().trim();
  if (!text) return intents[0];
  for (const [id, keywords] of Object.entries(freeformKeywords)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return intents.find((i) => i.id === id);
    }
  }
  return { ...intents[0], id: 'generic', label: text || 'a new beginning', reasoningHook: 'a fresh, auspicious start' };
}

function scoreDay(day, intent) {
  let score = 3;
  if (intent.preferredNakshatras.includes(day.nakshatra)) score += 3;
  if (intent.preferredTithis.some((t) => day.tithi === t)) score += 2;
  if (intent.avoidWeekdays.includes(day.weekday)) score -= 3;
  return score;
}

function pickTimeWindow(day, intent) {
  for (const horaName of intent.preferredHoras) {
    const block = findHoraBlock(day.date, day.weekday, horaName);
    if (!block) continue;
    if (block.startHour + 1 <= day.rahuKaal.startHour || block.startHour >= day.rahuKaal.endHour) {
      const endHour = block.startHour + 1.5;
      const endWithinRahu = endHour > day.rahuKaal.startHour && block.startHour < day.rahuKaal.endHour;
      const finalEnd = endWithinRahu ? day.rahuKaal.startHour : endHour;
      return { hora: horaName, start: fmtHour(block.startHour), end: fmtHour(finalEnd) };
    }
  }
  return { hora: 'Abhijit', start: day.abhijitMuhurta.start, end: day.abhijitMuhurta.end };
}

function ratingFor(score) {
  if (score >= 8) return 'Excellent';
  if (score >= 5) return 'Good';
  return 'Auspicious';
}

function computeRules({ intent, rashiId }) {
  const panchang = buildPanchang14();
  const rashiHouse = houseFor(rashiId, rashis, intent.houseAffinity);

  const scored = panchang.map((day) => ({ day, score: scoreDay(day, intent) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return scored.map(({ day, score }) => {
    const timeWindow = pickTimeWindow(day, intent);
    const rating = ratingFor(score);
    const rashiPhrase = rashiHouse
      ? `Aligns with your ${rashiHouse.rashiLabel} rashi's ${rashiHouse.houseNumber}th house of ${rashiHouse.houseMeaning}.`
      : 'A universally auspicious window.';
    const reason = `${timeWindow.hora === 'Abhijit' ? 'Abhijit Muhurta' : timeWindow.hora + ' hora'} during ${day.nakshatra} nakshatra — ${intent.reasoningHook}. Avoids Rahu Kaal (${day.rahuKaal.start}-${day.rahuKaal.end}). ${rashiPhrase}`;

    return {
      dateLabel: day.dateLabel,
      timeWindow: `${timeWindow.start} – ${timeWindow.end}`,
      nakshatra: day.nakshatra,
      hora: timeWindow.hora,
      tithi: day.tithi,
      rating,
      score,
      reason
    };
  });
}

// Ground Gemini on our panchang JSON so it can only pick dates that exist,
// not hallucinate them. The rashi/house context personalises the reasoning.
async function computeWithGemini({ intent, rashiId }) {
  const panchang = buildPanchang14();
  const rashiObj = rashis.find((r) => r.id === rashiId);
  const rashiHouse = houseFor(rashiId, rashis, intent.houseAffinity);
  const rashiLine = rashiObj
    ? `User rashi: ${rashiObj.label} (${rashiObj.en}, ${rashiObj.symbol}). For this intent it engages the ${intent.houseAffinity}th house of ${rashiHouse?.houseMeaning || 'life'}.`
    : 'User has not shared their rashi — give universally auspicious windows.';

  const systemPrompt = `You are Guruji, a warm, experienced Vedic astrologer specialising in muhurat (electional astrology). Given a user's intent, rashi (moon sign), and the next 14 days of authentic panchang data, you recommend the 3 most auspicious date-time windows.

Rules:
- Pick 3 different dates from the provided panchang (no repeats).
- Time windows should be 60-90 min, avoid Rahu Kaal, prefer good horas for the intent.
- Reasoning should mention: the nakshatra + hora + why it suits the intent, the fact that Rahu Kaal is avoided, and how it aligns with the user's rashi/house.
- Speak with confident warmth, like a family pandit — never generic.
- Ratings: Excellent (best), Good, Auspicious (weakest of the three).

Return STRICT JSON in this exact shape (no prose outside JSON):
{ "windows": [
  { "dateLabel": "Thursday, 22 Aug", "timeWindow": "10:47 – 12:15", "nakshatra": "Pushya", "hora": "Guru", "tithi": "Panchami", "rating": "Excellent", "reason": "..." },
  ...
]}`;

  const userPrompt = `Intent: ${intent.label} (${intent.reasoningHook}).
${rashiLine}

Next 14 days panchang (JSON):
${JSON.stringify(panchang, null, 0)}

Recommend the 3 best muhurat windows.`;

  const data = await askGeminiJSON({ systemPrompt, userPrompt });
  if (!data?.windows || !Array.isArray(data.windows) || data.windows.length < 1) {
    throw new Error('Gemini returned invalid windows shape');
  }
  return data.windows.slice(0, 3).map((w) => ({
    dateLabel: String(w.dateLabel || '—'),
    timeWindow: String(w.timeWindow || '—'),
    nakshatra: String(w.nakshatra || '—'),
    hora: String(w.hora || '—'),
    tithi: String(w.tithi || '—'),
    rating: ['Excellent', 'Good', 'Auspicious'].includes(w.rating) ? w.rating : 'Auspicious',
    reason: String(w.reason || '')
  }));
}

export async function computeMuhurats({ intentId, intentText, rashiId }) {
  const intent = resolveIntent({ intentId, intentText });

  if (isGeminiConfigured()) {
    try {
      const windows = await computeWithGemini({ intent, rashiId });
      return { windows, intent, poweredBy: 'gemini' };
    } catch (err) {
      console.warn('[Muhurat] Gemini call failed, falling back to rules engine:', err.message);
    }
  }

  const windows = computeRules({ intent, rashiId });
  return { windows, intent, poweredBy: 'rules' };
}
