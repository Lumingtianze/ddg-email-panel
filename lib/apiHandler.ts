
import { ApiError } from "./exceptions";

const handler = {
  onError: (err: unknown) => {
    // 处理已知的自定义 API 错误
    if (err instanceof ApiError) {
      const result = {
        statusCode: err.statusCode,
        message: err.message,
        code: err.data?.code || -1,
      };
      return new Response(JSON.stringify(result), {
        status: err.statusCode,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 处理未捕获的意外错误
    console.error(err);
    return new Response(
      JSON.stringify({ 
        message: "Unexpected error", 
        statusCode: 500 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  },
  onNoMatch: () => {
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  },
};

export { handler };