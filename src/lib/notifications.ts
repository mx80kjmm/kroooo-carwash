
const LINE_NOTIFY_API = 'https://notify-api.line.me/api/notify';

export async function sendLineNotify(message: string) {
    const token = process.env.LINE_NOTIFY_TOKEN;
    if (!token) {
        console.warn('LINE_NOTIFY_TOKEN is not set. Skipping notification.');
        return;
    }

    try {
        const params = new URLSearchParams();
        params.append('message', message);

        const response = await fetch(LINE_NOTIFY_API, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('LINE Notify Failed:', error);
        }
    } catch (err) {
        console.error('Error sending LINE Notify:', err);
    }
}
