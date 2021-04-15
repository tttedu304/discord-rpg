let config = {
  player: ["☺", "☹"],
  reactions: ["◀", "▶", "🔽", "🔼", "❌", "🔴", "🔵", "📄", "✳", "🐛"],
  keys: [
    "left",
    "right",
    "down",
    "up",
    "exit",
    "cancel_exit",
    "confirm_exit",
    "menu",
    "interact",
    "test",
  ],
  UI: {
    labels: ["📥 Load", "📤 Save", "🔙 Return"], //📥 📤 🔙
  },
};

module.exports.get_config = () => {
  return config;
};
