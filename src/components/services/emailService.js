const nodemailer = require("nodemailer");

class EmailService {
  static transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  static async sendVerificationEmail(email, code) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Vérification de votre compte Garage",
        html: `
          <h1>Bienvenue chez Garage</h1>
          <p>Pour vérifier votre compte, veuillez utiliser le code suivant :</p>
          <h2 style="color: #4CAF50;">${code}</h2>
          <p>Ce code expirera dans 1 heure.</p>
          <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Erreur d'envoi d'email:", error);
      throw new Error("Erreur lors de l'envoi de l'email de vérification");
    }
  }
}

module.exports = EmailService;
