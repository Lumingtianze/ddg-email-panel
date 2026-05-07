import { handler as errHandler } from '../../lib/apiHandler'
import { ApiError } from '../../lib/exceptions'
import { generateAddresses } from '../../lib/ddgEmailApi'

export const runtime = 'edge';

export default async function handler(req: Request) {
  if (req.method !== 'POST') return errHandler.onNoMatch();

  try {
    const authorization = req.headers.get('authorization');
    if (!authorization || !authorization.includes('Bearer ')) {
      throw new ApiError(401, 'Unauthorized');
    }
    
    const token = authorization.replace('Bearer ', '');
    const result = await generateAddresses(token);
    const data = await result.json();

    if (result.ok) {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    throw new ApiError(result.status, result.statusText);
  } catch (err) {
    return errHandler.onError(err);
  }
}