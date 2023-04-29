import * as Countdown from "ui";

export default function Web() {
  return (
    <div>
      <h1>Web</h1>
      <Countdown.Root
        timestamp={1682765185000}
        onComplete={() => {
          console.log("timer finished");
        }}
      >
        <Countdown.DaysInHours />
        :
        <Countdown.Minutes />
        :
        <Countdown.Seconds isZeroPad />
      </Countdown.Root>
    </div>
  );
}
