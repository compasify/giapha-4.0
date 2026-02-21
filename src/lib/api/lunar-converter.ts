const PROXY = '/api/proxy';

interface LunarDate {
  lunar_year: number;
  lunar_month: number;
  lunar_day: number;
  is_leap_month: boolean;
}

interface SolarDate {
  solar_year: number;
  solar_month: number;
  solar_day: number;
}

export async function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth: boolean,
): Promise<SolarDate> {
  const res = await fetch(`${PROXY}/utilities/lunar_to_solar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lunar_year: lunarYear,
      lunar_month: lunarMonth,
      lunar_day: lunarDay,
      is_leap_month: isLeapMonth,
    }),
  });
  if (!res.ok) throw new Error('Không thể chuyển đổi ngày âm lịch');
  const json = await res.json();
  const solarDate: string = json.data.solar_date;
  const [y, m, d] = solarDate.split('-').map(Number);
  return { solar_year: y, solar_month: m, solar_day: d };
}

export async function solarToLunar(
  solarYear: number,
  solarMonth: number,
  solarDay: number,
): Promise<LunarDate> {
  const res = await fetch(`${PROXY}/utilities/solar_to_lunar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      solar_year: solarYear,
      solar_month: solarMonth,
      solar_day: solarDay,
    }),
  });
  if (!res.ok) throw new Error('Không thể chuyển đổi ngày dương lịch');
  const json = await res.json();
  return {
    lunar_year: json.data.lunar_year,
    lunar_month: json.data.lunar_month,
    lunar_day: json.data.lunar_day,
    is_leap_month: json.data.is_leap_month ?? false,
  };
}
