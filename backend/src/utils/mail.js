import Mailgen from "mailgen";
import nodemailer from "nodemailer";

export const EmailVerificationMail = (username, EmailVerificationURL) => ({
  body: {
    name: username,
    intro: "Welcome to the app! We are glad to have you on board.",
    action: {
      instruction: "To verify your account, click below:",
      button: {
        color: "#22BC66",
        text: "Verify Email",
        link: EmailVerificationURL,
      },
    },
    outro: "If you have any questions, just reply to this email.",
  },
});

export const PasswordResetMail = (username, PasswordResetURL) => ({
  body: {
    name: username,
    intro: "You requested a password reset.",
    action: {
      instruction: "Click below to reset your password:",
      button: {
        color: "#22BC66",
        text: "Reset Password",
        link: PasswordResetURL,
      },
    },
    outro: "Didn't request this? Ignore the email.",
  },
});

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://mailgen.js/", // yha pe mail me logo pe click karne pe yha redirect ho jaega and footer me bhi yehi name aega
    },
  });

  if (options.mailType === "verify") {
    content = EmailVerificationMail(options.username, options.url);
  } else if (options.mailType === "reset") {
    content = PasswordResetMail(options.username, options.url);
  } else {
    throw new Error("Invalid mail type provided.");
  }

  const emailHtml = mailGenerator.generate(content);
  const emailText = mailGenerator.generatePlaintext(content);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mail = {
    from: '"Task Manager" <noreply@taskmanager.com>',
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
    console.log("Email sent to", options.email);
  } catch (error) {
    console.error("Email failed:", error.message);
    throw error;
  }
};

export default sendMail;
