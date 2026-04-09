export default function Spinner({ size = 3 }: { size?: number }) {
  return (
    <div className="spinnerContainer">
      <div
        className="spinner"
        style={{ height: `${size}rem`, width: `${size}rem` }}
      ></div>
    </div>
  );
}
