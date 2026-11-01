// Static assets ignore Range requests, which iOS Safari needs to play video.
const RANGE = /^bytes=(\d*)-(\d*)$/;

function parseRange(header, size) {
    const match = RANGE.exec(header || "");
    if (!match || (!match[1] && !match[2])) return null;
    const start = match[1] ? Number(match[1]) : Math.max(size - Number(match[2]), 0);
    const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    return start <= end ? { start, end } : null;
}

export default {
    async fetch(request, env) {
        const asset = await env.ASSETS.fetch(request.url);
        const header = request.headers.get("Range");
        if (!header || asset.status !== 200) return asset;

        const body = await asset.arrayBuffer();
        const range = parseRange(header, body.byteLength);
        const headers = new Headers(asset.headers);
        headers.set("Accept-Ranges", "bytes");
        if (!range) {
            headers.set("Content-Range", `bytes */${body.byteLength}`);
            return new Response(null, { status: 416, headers });
        }
        headers.set("Content-Range", `bytes ${range.start}-${range.end}/${body.byteLength}`);
        headers.set("Content-Length", String(range.end - range.start + 1));
        return new Response(body.slice(range.start, range.end + 1), { status: 206, headers });
    }
};
