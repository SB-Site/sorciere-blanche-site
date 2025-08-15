export default async (req, res) => {
  const response = await fetch("https://cskhhttnmjfmieqkayzg.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNza2hodHRubWpmbWllcWtheXpnIiwicm9sZSI6imFub24iLCJpAXQiOjE3NTQzMTk1NDgsImV4cCI6MjA2OTg5NTU0OH0.or26KhHzKJ7oPYu0tQrXLIMwpBxZmHqGwC5rfGKrADI");
  if (response.ok) {
    res.status(200).json({ message: "Ping Supabase OK" });
  } else {
    res.status(500).json({ error: "Ping Supabase failed" });
  }
};