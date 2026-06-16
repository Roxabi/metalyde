import { VerificationEmail } from '../src/templates/verification'
import { en } from '../src/translations/en'

export default function Preview() {
  return (
    <VerificationEmail
      url="https://metalyde.roxabi.dev/verify?token=abc123"
      translations={en.verification}
      locale="en"
      appName="Metalyde"
      appUrl="https://metalyde.roxabi.dev"
    />
  )
}
