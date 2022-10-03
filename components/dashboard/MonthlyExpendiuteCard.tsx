import { Tooltip, useToken } from "@chakra-ui/react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const MonthlyExpendiuteCard = () => {
  const [blue200, blue500, teal200, teal500] = useToken("colors", [
    "blue.200",
    "teal.300",
    "blue.500",
    "teal.500",
  ]);
  const data = [{}];
  return (
    <>
      <AreaChart
        height={250}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={blue500} stopOpacity={0.8} />
            <stop offset="95%" stopColor={blue200} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <Area
          type="monotone"
          dataKey="pv"
          stroke={blue500}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </>
  );
};

export default MonthlyExpendiuteCard;
