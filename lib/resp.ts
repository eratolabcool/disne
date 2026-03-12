export function respData(data: unknown) {
  return respJson(0, "ok", data ?? []);
}

export function respOk() {
  return respJson(0, "ok");
}

export function respErr(message: string) {
  return respJson(-1, message);
}

export function respJson<T>(code: number, message: string, data?: T) {
  const json: { code: number; message: string; data?: T } = { code, message };
  if (data !== undefined) {
    json.data = data;
  }
  return Response.json(json);
}
