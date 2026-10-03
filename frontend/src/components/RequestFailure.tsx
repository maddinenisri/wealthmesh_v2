interface RequestFailureProps {
  title: string;
  message: string;
  retry: () => void;
}

export function RequestFailure({ title, message, retry }: RequestFailureProps) {
  return (
    <div className="failure">
      <div role="alert">
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      <button onClick={retry}>Try again</button>
    </div>
  );
}
