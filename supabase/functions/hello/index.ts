Deno.serve(async (req) => {
    const { name } = await req.json();
    const data = {
        message: `Hello bitch'N ${name}!`,
    };

    return new Response(
        JSON.stringify(data),
        { headers: { 'Content-Type': 'application/json' } },
    );
});

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
