const sgMail = require('@sendgrid/mail');

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send registration confirmation email using SendGrid
exports.sendRegistrationConfirmation = async (userEmail, userName, event, registrationId, studentDetails) => {
    try {
        const msg = {
            to: userEmail,
            from: {
                email: process.env.EMAIL_USER,
                name: 'CampusConnect'
            },
            subject: `🎉 Registration Confirmed - ${event.title}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background: #f5f7fa; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                        .content { padding: 30px; }
                        .event-details { background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0; }
                        .student-details { background: #e0f2fe; padding: 20px; border-radius: 10px; margin: 20px 0; }
                        .button { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0; }
                        .footer { text-align: center; color: #64748b; padding: 20px; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Registration Confirmed!</h1>
                            <p>You're successfully registered for the event</p>
                        </div>
                        <div class="content">
                            <h2>Hello ${userName},</h2>
                            <p>Your registration for <strong>${event.title}</strong> has been confirmed.</p>
                            
                            <div class="event-details">
                                <h3>📅 Event Details:</h3>
                                <p><strong>Event:</strong> ${event.title}</p>
                                <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p><strong>Time:</strong> ${new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                                <p><strong>Venue:</strong> ${event.venue}</p>
                                <p><strong>Department:</strong> ${event.department}</p>
                                <p><strong>Registration ID:</strong> ${registrationId}</p>
                            </div>

                            <div class="student-details">
                                <h3>👤 Your Registration Details:</h3>
                                <p><strong>Student ID:</strong> ${studentDetails.studentId}</p>
                                <p><strong>Phone:</strong> ${studentDetails.phone}</p>
                                ${studentDetails.year ? `<p><strong>Year:</strong> ${studentDetails.year}</p>` : ''}
                                ${studentDetails.section ? `<p><strong>Section:</strong> ${studentDetails.section}</p>` : ''}
                                ${studentDetails.additionalInfo ? `<p><strong>Additional Info:</strong> ${studentDetails.additionalInfo}</p>` : ''}
                            </div>

                            <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <h4>📋 Important Notes:</h4>
                                <ul>
                                    <li>Keep this email for your records</li>
                                    <li>Arrive 15 minutes before the event starts</li>
                                    <li>Bring your student ID for verification</li>
                                    <li>Show this confirmation at the registration desk</li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer">
                            <p>Thank you for using CampusConnect!</p>
                            <p><strong>CampusConnect Team</strong></p>
                            <p>If you have any questions, please contact your department coordinator.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await sgMail.send(msg);
        console.log(`✅ Confirmation email sent to ${userEmail} via SendGrid`);
        return true;
    } catch (error) {
        console.error('❌ Error sending email via SendGrid:', error);
        if (error.response) {
            console.error('SendGrid error response:', error.response.body);
        }
        throw new Error('Failed to send confirmation email');
    }
};