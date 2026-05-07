import { handler as errHandler } from '../../../lib/apiHandler'
import { ApiError } from '../../../lib/exceptions'
import { login as ddgLogin, getAccessToken } from '../../../lib/ddgEmailApi'

export const runtime = 'edge';

export default async function handler(req: Request) {
  if (req.method !== 'POST') return errHandler.onNoMatch();

  try {
    const { username, otp } = await req.json();
    if (!username || !otp) {
      throw new ApiError(400, 'Duck Address and OTP are required');
    }

    const result = await ddgLogin(username, otp);
    const data = await result.json() as any;

    if (result.ok) {
      const accessResult = await getAccessToken(data.token);
      const accessData = await accessResult.json();
      
      if (accessResult.ok) {
        return new Response(JSON.stringify(accessData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw new ApiError(accessResult.status, accessResult.statusText);
    }
    throw new ApiError(result.status, result.statusText);
  } catch (err) {
    return errHandler.onError(err);
  }
}