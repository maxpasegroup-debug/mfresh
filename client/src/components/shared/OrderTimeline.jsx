const steps = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered'];

export default function OrderTimeline({ status, timestamps = {} }) {
  const currentIndex = steps.indexOf(status);

  return (
    <div className="card p-4">
      {steps.map((step, index) => {
        const complete = index <= currentIndex;
        return (
          <div key={step} className="flex gap-3 pb-4 last:pb-0">
            <div className="flex flex-col items-center">
              <span
                className={`h-5 w-5 rounded-full border-2 ${
                  complete ? 'border-brand-green bg-brand-green' : 'border-brand-border bg-white'
                }`}
              />
              {index < steps.length - 1 ? (
                <span className={`h-8 w-0.5 ${complete ? 'bg-brand-green' : 'bg-brand-border'}`} />
              ) : null}
            </div>
            <div>
              <p className="text-sm font-black capitalize text-brand-text">{step.replaceAll('_', ' ')}</p>
              {timestamps[step] ? (
                <p className="text-xs font-semibold text-brand-muted">
                  {new Date(timestamps[step]).toLocaleString('en-IN')}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
