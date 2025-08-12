const fetch = require("node-fetch");
exports.handler = async () => {
try {
const response = await fetch("https://cskhhttnmjfmieqkayzg.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNza2hodHRubWpmbWllcWtheXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMTk1NDgsImV4cCI6MjA2OTg5NTU0OH0.or26KhHzKJ7oPYu0tQrXLIMwpBxZmHqGwC5rfGKrADI");
if (response.ok) {
return { statusCode: 200, body: "Ping Supabase OK" };
}
return { statusCode: 500, body: "Ping Supabase failed" };
} catch (error) {
return { statusCode: 500, body: "Error: " + error.message };
}
};
