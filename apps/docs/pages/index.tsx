import * as Countdown from "ui";

export default function Docs() {
  return (
    <div>
      <Countdown.Root
        timestamp={1682765185000}
        onComplete={() => {
          console.log("timer finished");
        }}
      >
        <Countdown.Days hideIfZero />
        :
        <Countdown.Hours />
        :
        <Countdown.Minutes />
        :
        <Countdown.Seconds isZeroPad />
      </Countdown.Root>
    </div>
  );
}
