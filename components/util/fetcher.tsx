export const fetcher = async (url, data = undefined) => {

    const res = await fetch(window.location.origin + url, {
        method: data ? 'POST' : 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        // const response = res.json()
        throw new Error(`An error occurred while fetching the data: ${res.status}`)
    }

    return res.json();
}