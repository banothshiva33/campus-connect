const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send registration confirmation email
exports.sendRegistrationConfirmation = async (
  userEmail,
  userName,
  eventTitle,
  eventDate,
  venue
) => {
  try {
    const msg = {
      to: userEmail,

      // IMPORTANT:
      // This MUST be your verified sender email in SendGrid
      from: {
        email: 'prettypaker36@gmail.com',
        name: 'CampusConnect'
      },

      subject: `🎉 Registration Confirmed - ${eventTitle}`,

      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">
            Event Registration Successful
          </h2>

          <p>Hello <strong>${userName}</strong>,</p>

          <p>
            You have successfully registered for the following event:
          </p>

          <div style="
            background: #f1f5f9;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
          ">
            <h3>${eventTitle}</h3>

            <p>
              <strong>Date:</strong>
              ${new Date(eventDate).toLocaleString()}
            </p>

            <p>
              <strong>Venue:</strong>
              ${venue}
            </p>
          </div>

          <p>
            Thank you for registering.
          </p>

          <p>
            Regards,<br/>
            CampusConnect Team
          </p>
        </div>
      `
    };

    await sgMail.send(msg);

    console.log('✅ Confirmation email sent successfully');

    return true;

  } catch (error) {

    console.error('❌ Error sending email via SendGrid:', error);

    if (error.response) {
      console.error('SendGrid error response:', error.response.body);
    }

    throw new Error('Failed to send confirmation email');
  }
};