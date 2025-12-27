function Button({ children, onClick, variant = "primary" }) {
  const styles =
    variant === "primary"
      ? "bg-cyan-500 hover:bg-cyan-400"
      : "border border-cyan-500 hover:bg-cyan-500/20";

  return (
    <button
      onClick={onClick}
      className={`${styles} px-5 py-2 rounded-lg transition transform hover:scale-105`}
    >
      {children}
    </button>
  );
}

export default Button;
