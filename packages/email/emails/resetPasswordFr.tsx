import { ResetPasswordEmail } from '../src/templates/resetPassword'
import { fr } from '../src/translations/fr'

export default function Preview() {
  return (
    <ResetPasswordEmail
      url="https://metalyde.roxabi.dev/reset?token=abc123"
      translations={fr.reset}
      locale="fr"
    />
  )
}
