export default async function fetchSpeechServicesRegion() {
  const res = await fetch('/api/speechservices/token', { method: 'POST' })
  const { region } = await res.json();

  return region;
}
