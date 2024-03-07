export default class ResponseHelper {
  static response = (content: string, field: string) => {
    return field + '.' + content;
  };
}
