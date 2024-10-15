export interface SendMailOptions {
  recipient?: string;
  userId: number;
  subject: string;
  plainText: string;
  htmlContent: string;
  verificationCode: string;
  type: string;
}
