import {emailAdapter} from "../../adapters/email-adapter";


export class MailManager  {
    async sendConfirmationMail (subject: string, email: string, code: string) {

        const htmlMessage = ` <h1>Thanks for your registration dear ${subject}</h1>
                        <p>To finish registration please follow the link below:
                                <a href='https://node-hw.vercel.app/confirm-email?code=${code}'>complete registration</a>
      
                        </p>`
        return await emailAdapter.send(subject, email, htmlMessage)
    }

    async sendRecoveryPasswordMail (subject: string, email: string, code: string) {

        const htmlMessage = `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
      </p>`
        return await emailAdapter.send(subject, email, htmlMessage)
    }
}