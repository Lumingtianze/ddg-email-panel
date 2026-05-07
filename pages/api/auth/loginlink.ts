import { handler as errHandler } from '../../../lib/apiHandler'
import { ApiError } from '../../../lib/exceptions'
import { loginRequest } from '../../../lib/ddgEmailApi'

export const runtime = 'edge';

export default async function handler(req: Request) {
  if (req.method !== 'POST') return errHandler.onNoMatch();

  try {
    const { username } = await req.json();
    const result = await loginRequest(username);
    
    if (result.ok) {
      return new Response(JSON.stringify({ message: 'success' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    throw new ApiError(result.status, result.statusText);
  } catch (err) {
    return errHandler.onError(err);
  }
}