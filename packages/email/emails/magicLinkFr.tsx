import { MagicLinkEmail } from '../src/templates/magicLink'
import { fr } from '../src/translations/fr'

export default function Preview() {
  return (
    <MagicLinkEmail
      url="https://metalyde.roxabi.dev/magic?token=abc123"
      translations={fr.magicLink}
      locale="fr"
    />
  )
}
