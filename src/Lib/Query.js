export default function (params) {
    return Object.keys(params)
        .map(k => k + "=" + encodeURIComponent(params[k]))
        .join("&");
}