function wait(ms: number): Promise<undefined> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function handler(_req: Request): Response {
    const body = new ReadableStream({
        async start(controller) {
            for (let i = 0; i < 5; i++) {
                await wait(500);
                console.log('count', i);
                controller.enqueue(
                    new TextEncoder().encode(`data: { "count": ${i} }\n`),
                );
            }
            console.log('closing');
            controller.close();
        },
        cancel() {
            // cancel read
        },
    });

    return new Response(body, {
        headers: {
            'content-type': 'text/event-stream; charset=utf-8',
            // 'x-content-type-options': 'nosniff',
        },
    });
}
Deno.serve(handler);

/* spell-checker: disable */

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/hello' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'

// local dev curl
// `
// curl \
//   -i --location --request POST \
//   'https://zekxhqiqlnzydflpmddi.supabase.co/functions/v1/hello' \
//   --header 'Content-Type: application/json' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpla3hocWlxbG56eWRmbHBtZGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU5MTg3OTMsImV4cCI6MjAwMTQ5NDc5M30.ON3_y07S6C1hZfmLoz1GdsmCuaiTkEnffDnIFsYAUbA' \
//   --data '{"name":"Grok N Functions"}'

// `

// prod curl
// `
// curl -i --location --request POST 'https://zekxhqiqlnzydflpmddi.supabase.co/functions/v1/hello' --header 'Content-Type: application/json' --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpla3hocWlxbG56eWRmbHBtZGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU5MTg3OTMsImV4cCI6MjAwMTQ5NDc5M30.ON3_y07S6C1hZfmLoz1GdsmCuaiTkEnffDnIFsYAUbA' --data '{"name":"Grok N Functions"}'
// `

/* spell-checker: enable */
