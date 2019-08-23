export default async function fetchSpeechServicesToken() {
  const res = await fetch('/api/speechservices/token', { method: 'POST' })
  const { token } = await res.json();

  return token;
}
