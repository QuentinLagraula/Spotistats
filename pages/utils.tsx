import { Play, Stats } from "./interfaces";

const unitsOfTime: { [unit: string]: number } = {
  minutes: 60,
  hours: 60 * 60,
  days: 60 * 60 * 24,
  months: 60 * 60 * 24 * 30.4167,
};

export const getNextTimeUnit = (currentUnit: string) => {
  const units = Object.keys(unitsOfTime);
  const currentUnitIndex = units.findIndex((unit) => unit === currentUnit);
  return units[currentUnitIndex + 1] || units[0];
};

export const convertTime = (time: number, unit: string) =>
  parseInt((time / (1000 * unitsOfTime[unit])).toFixed(), 10);

export const getTime = (plays: Play[], unit: string) => {
  let time = 0;
  plays.forEach((play) => (time += play.msPlayed));
  return convertTime(time, unit);
};

export const getGraphData = (plays: Play[]) => {
  const stats: { [day: string]: number } = {};
  plays.forEach((play) => {
    const day = play.endTime.slice(0, 10);
    stats[day] = (stats[day] || 0) + play.msPlayed;
  });
  return Object.entries(stats).map(([day, time]) => ({
    day,
    time: convertTime(time, "minutes"),
  }));
};

export const getKeyStats = (
  plays: Play[],
  key: string,
  loadSize: number | boolean = 1
) => {
  const stats: { [unit: string]: Stats } = {};
  plays.forEach((play) => {
    const previousStat = stats[play[key]];

    if (previousStat)
      return (stats[play[key]] = {
        count: previousStat.count + 1,
        msPlayed: previousStat.msPlayed + play.msPlayed,
        artistName: play.artistName,
        other: {
          ...previousStat.other,
          ...{
            [play.trackName]: (previousStat?.other?.[play.trackName] || 1) + 1,
          },
        },
      });

    stats[play[key]] = {
      count: 1,
      msPlayed: play.msPlayed,
      artistName: play.artistName,
      other: { [play.trackName]: 1 },
    };
  });

  const values = Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
  if (loadSize !== false && loadSize) values.length = (loadSize as number) * 20;
  return values;
};
