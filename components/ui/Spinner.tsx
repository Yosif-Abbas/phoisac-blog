function Spinner({ size = 2 }: { size?: number }) {
  return (
    <div className="spinnerContainer">
      <div className="spinner" style={{ height: `${size}rem`, width: `${size}rem` }}></div>
    </div>
  );
}

export default Spinner;
