import type {ActionFunctionArgs, LoaderFunctionArgs} from "react-router";

const VERIFY_TOKEN = 'maja_verify_token';

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return new Response(challenge ?? '', { status: 200 });
    } else {
        return new Response('Failed validation. Make sure the validation tokens match.', { status: 403 });
    }
}

export async function action({ request }: ActionFunctionArgs) {
    const json = await request.json();

    console.log('Received Facebook webhook:', JSON.stringify(json));

    // TODO: REMOVE THIS AFTER MAJA
    const majaEntries = json.entry.filter((entry: any) => entry.id == '103299868047739');
    const freshsportEntries = json.entry.filter((entry: any) => entry.id == '1454510698173110');
    const perlaEntries = json.entry.filter((entry: any) => entry.id == '543848708808973');


    if (majaEntries.length > 0) {
        const majaJson = json;
        majaJson.entry = majaEntries;
        console.log('Forwarding request to majapp');

        fetch('https://maja-app.up.railway.app/api/fb/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(majaJson),
        }).catch((error) => {
            console.log('Error forwarding request to maja:', error);
        });
    }

    if (freshsportEntries.length > 0) {
        const freshsportJson = json;
        freshsportJson.entry = freshsportEntries;
        fetch('https://lajfka-freshsport-production.up.railway.app/webhooks/facebook/feed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(freshsportJson),
        }).catch((error) => {
            console.log('Error forwarding request to Freshsport:', error);
        });
    }

    if (perlaEntries.length > 0) {
        const perlaJson = json;
        perlaJson.entry = perlaEntries;
        fetch('https://lajfka-shopify-production.up.railway.app/webhooks/facebook/feed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(perlaJson),
        }).catch((error) => {
            console.log('Error forwarding request to Perla Mozambiku:', error);
        });
    }


    return new Response('ok', { status: 200 });
}
