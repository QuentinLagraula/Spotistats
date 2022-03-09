import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import styles from "../../styles/Home.module.css";

interface Data {
  day: string;
  time: number;
}

const Chart = ({ data, theme }: { data: Data[]; theme: string | null }) => {
  return (
    <div className={styles.chart}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <Tooltip
            cursor={false}
            content={({ active, payload }) => (
              <CustomTooltip active={active} payload={payload} />
            )}
          />

          <Line
            dot={false}
            type="monotone"
            dataKey="time"
            stroke={theme === "dark" ? "#1DB954" : "#0060df"}
            activeDot={{
              stroke: theme === "dark" ? "#191414" : "#ffffff",
              strokeWidth: 2,
              r: 4,
            }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

const CustomTooltip = ({
  active,
  payload,
}: {
  active: boolean | undefined;
  payload: Payload<ValueType, NameType>[] | undefined;
}) => {
  const [data] = payload || [];
  if (active && data?.payload) {
    return (
      <div>
        {data.payload.day} - {data.payload.time} minutes
      </div>
    );
  }

  return null;
};
