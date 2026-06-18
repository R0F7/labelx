interface Props {
  step: number;
}

export default function ReleaseStepper({
  step,
}: Props) {
  const steps = [
    "Metadata",
    "Artwork",
    "Tracks",
    "Stores",
  ];

  return (
    <div className="relative py-6">
      <div className="absolute top-11 left-0 right-0 h-[2px] bg-border" />

      <div className="relative flex justify-between">
        {steps.map((title, index) => {
          const current = index + 1;

          return (
            <div
              key={title}
              className="flex flex-col items-center"
            >
              <div
                className={`
                  h-10
                  w-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  font-medium
                  border
                  ${
                    current <= step
                      ? "bg-primary text-white"
                      : "bg-background"
                  }
                `}
              >
                {current}
              </div>

              <span className="text-xs mt-2">
                {title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}