import React from "react";

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

const units = {
  SECOND: ONE_SECOND,
  MINUTE: ONE_MINUTE,
  HOUR: ONE_HOUR,
  DAY: ONE_DAY,
} as const;

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  remainingTime: number;
};

type DateInput = string | number | Date;

const getTotalRemainingInUnit = (
  remainingTime: number,
  unit: keyof typeof units
) => {
  return Math.floor(remainingTime / units[unit]);
};

function zeroPad(value: number): string {
  const valueString = value.toString();
  if (valueString.length >= 2) {
    return valueString;
  } else {
    return valueString.padStart(2, "0");
  }
}

function formatCountdown(dateInput: DateInput): Countdown {
  const now = new Date().getTime();
  let timestamp: number;

  if (typeof dateInput === "string" || dateInput instanceof Date) {
    timestamp = new Date(dateInput).getTime();
  } else {
    timestamp = dateInput;
  }

  const remainingTime = timestamp - now;

  if (remainingTime > 0) {
    const seconds = getTotalRemainingInUnit(remainingTime, "SECOND") % 60;
    const minutes = getTotalRemainingInUnit(remainingTime, "MINUTE") % 60;
    const hours = getTotalRemainingInUnit(remainingTime, "HOUR") % 24;
    const days = getTotalRemainingInUnit(remainingTime, "DAY");

    return { days, hours, minutes, seconds, remainingTime };
  } else {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, remainingTime: 0 };
  }
}

const CountdownContext = React.createContext({
  date: 0,
  countdown: { days: 0, hours: 0, minutes: 0, seconds: 0, remainingTime: 0 },
});

const useCountdown = () => {
  const context = React.useContext(CountdownContext);
  if (!context) {
    throw new Error("useCountdown must be used within a CountdownProvider");
  }
  return context;
};

export const Root: React.FC<{
  children: React.ReactNode;
  timestamp: string | number | Date;
  onComplete?: () => void;
}> = ({ children, timestamp, onComplete }) => {
  const [countdown, setCountdown] = React.useState<Countdown>(
    formatCountdown(timestamp)
  );

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown(formatCountdown(timestamp));
    }, 1000);

    if (countdown.remainingTime === 0) {
      onComplete?.();
    }

    return () => clearInterval(intervalId);
  }, [timestamp, countdown.remainingTime, onComplete]);

  return (
    <CountdownContext.Provider value={{ date: 0, countdown }}>
      {children}
    </CountdownContext.Provider>
  );
};

interface CountdownItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  isZeroPad?: boolean;
  hideIfZero?: boolean;
}

export const Days: React.FC<CountdownItemProps> = ({
  isZeroPad = false,
  hideIfZero = false,
  ...props
}) => {
  const { countdown } = useCountdown();

  const daysLeft = isZeroPad ? zeroPad(countdown.days) : countdown.days;
  if (hideIfZero && countdown.days === 0) {
    return null;
  }
  return <span {...props}>{daysLeft}</span>;
};

export const Hours: React.FC<CountdownItemProps> = ({
  isZeroPad,
  ...props
}) => {
  const { countdown } = useCountdown();
  const hoursLeft = isZeroPad ? zeroPad(countdown.hours) : countdown.hours;
  return <span {...props}>{hoursLeft}</span>;
};

export const Seconds: React.FC<CountdownItemProps> = ({
  isZeroPad = false,
  ...props
}) => {
  const { countdown } = useCountdown();
  const secondsLeft = isZeroPad
    ? zeroPad(countdown.seconds)
    : countdown.seconds;
  return <span {...props}>{secondsLeft}</span>;
};

export const Minutes: React.FC<CountdownItemProps> = ({
  isZeroPad,
  ...props
}) => {
  const { countdown } = useCountdown();
  const minutesLeft = isZeroPad
    ? zeroPad(countdown.minutes)
    : countdown.minutes;
  return <span {...props}>{minutesLeft}</span>;
};

export const DaysInHours: React.FC<CountdownItemProps> = ({
  isZeroPad,
  ...props
}) => {
  const { countdown } = useCountdown();
  const daysInHours = countdown.days * 24 + countdown.hours;
  const displayDaysInHours = isZeroPad ? zeroPad(daysInHours) : daysInHours;
  return <span {...props}>{displayDaysInHours}</span>;
};

export const TestDiv = () => {
  const [date, setDate] = React.useState<number>(0);
  return <div>{date}</div>;
};
