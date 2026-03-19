const pingBtn = document.getElementById("ping");
const statusEl = document.getElementById("status");

async function ping() {
  statusEl.textContent = "Memproses...";
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    statusEl.textContent = data.ok ? "OK" : "Gagal";
  } catch (e) {
    statusEl.textContent = String(e?.message ?? e);
  }
}

pingBtn.addEventListener("click", (e) => {
  e.preventDefault();
  void ping();
});
