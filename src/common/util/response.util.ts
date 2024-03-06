export default class ResponseHelper {
  static response = (subject: string, content: string, field?: string) => {
    return field
      ? content + '.' + field + '.' + subject
      : content + '.' + subject;
  };
}
