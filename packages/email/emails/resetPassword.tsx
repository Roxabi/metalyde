import { ResetPasswordEmail } from '../src/templates/resetPassword'
import { en } from '../src/translations/en'

export default function Preview() {
  return (
    <ResetPasswordEmail
      url="https://metalyde.roxabi.dev/reset?token=abc123"
      translations={en.reset}
      locale="en"
      appName="Metalyde"
      appUrl="https://metalyde.roxabi.dev"
    />
  )
}
