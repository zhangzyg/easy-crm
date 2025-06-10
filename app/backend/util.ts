export function genCustomerId(): string {
    return `C${crypto.randomUUID().replaceAll('-','').substring(0, 10)}`;
}

export function genProjectId(): string {
    return `P${crypto.randomUUID().replaceAll('-','').substring(0, 10)}`;
}