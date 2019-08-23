export default async function fetchDirectLineToken() {
  const res = await fetch('/api/directline/token', { method: 'POST' })
  const { token } = await res.json();

  return token;
}
