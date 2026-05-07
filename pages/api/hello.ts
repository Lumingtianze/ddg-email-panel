export const runtime = 'edge';

export default async function handler() {
  return new Response(JSON.stringify({ name: 'John Doe' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}