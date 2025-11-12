import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: process.env.MAIL_MESSAGE_HOST as string,
  port: parseInt(process.env.MAIL_MESSAGE_PORT!, 10),
  auth: {
    user: process.env.MAIL_MESSAGE_EMAIL as string,
    pass: process.env.MAIL_MESSAGE_PASS as string,
  },
});

export const verifyAccountMessage = (code: string): string => {
  const html = `
    <div style="background-color:#F9FAFB;padding:40px 0;font-family:Arial,sans-serif">
      <div style="max-width:500px;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);overflow:hidden">
        
        <div style="background:#2E8B57;color:#ffffff;padding:20px;text-align:center">
          <h1 style="margin:0;font-size:22px;font-weight:600;letter-spacing:0.5px">
            Recoshop
          </h1>
        </div>

        <div style="padding:30px;text-align:center;color:#1A1A1A">
          <h2 style="margin-top:0;margin-bottom:16px;font-size:20px;color:#1A1A1A">
            Verify Your Account
          </h2>
          <p style="margin-bottom:20px;font-size:15px;line-height:1.6">
            Welcome to Recoshop! Please use the code below to verify your account and get started:
          </p>

          <div style="display:inline-block;background:#2E8B57;color:#ffffff;
            font-size:20px;font-weight:bold;letter-spacing:4px;
            padding:12px 24px;border-radius:8px;margin-bottom:20px">
            ${code}
          </div>

          <p style="margin:0;font-size:14px;color:#6b7280">
            This code will expire in <strong>7 days</strong>.
          </p>
          
          <p style="margin-top:20px;font-size:14px;color:#C44536">
            If you did not request this, please ignore this email.
          </p>
        </div>

      </div>
    </div>
  `;

  return html;
};

export const forgotPasswordMessage = (code: string): string => {
  const html = `
    <div style="background-color:#F9FAFB;padding:40px 0;font-family:Arial,sans-serif">
      <div style="max-width:500px;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);overflow:hidden">
        
        <div style="background:#2E8B57;color:#ffffff;padding:20px;text-align:center">
          <h1 style="margin:0;font-size:22px;font-weight:600;letter-spacing:0.5px">
            Recoshop
          </h1>
        </div>

        <div style="padding:30px;text-align:center;color:#1A1A1A">
          <h2 style="margin-top:0;margin-bottom:16px;font-size:20px;color:#1A1A1A">
            Reset Your Password
          </h2>
          <p style="margin-bottom:20px;font-size:15px;line-height:1.6">
            You requested to reset your password. Please use the code below to set a new password:
          </p>

          <div style="display:inline-block;background:#2E8B57;color:#ffffff;
            font-size:20px;font-weight:bold;letter-spacing:4px;
            padding:12px 24px;border-radius:8px;margin-bottom:20px">
            ${code}
          </div>

          <p style="margin:0;font-size:14px;color:#6b7280">
            This code will expire in <strong>1 hour</strong>.
          </p>
          
          <p style="margin-top:20px;font-size:14px;color:#C44536">
            If you did not request this, please ignore this email.
          </p>
        </div>

      </div>
    </div>
  `;

  return html;
};

export const sendEmail = async (email: string, title: string, msg: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `Recoshop <Support>`,
      to: email,
      subject: title,
      html: msg,
    });
  } catch (err) {
    console.log(err)
  }
}
