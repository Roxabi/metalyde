-- Rebrand: default app display name Roxabi → Metalyde (post-bootstrap from roxabi-boilerplate).
-- Updates the values seeded by 0015_seed_system_settings. Idempotent: only rows still holding
-- the seeded '"Roxabi"' value are touched, so any admin-customized value is preserved.
UPDATE "system_settings"
SET "value" = '"Metalyde"', "updated_at" = now()
WHERE "key" IN ('app.name', 'email.fromName')
  AND "value" = '"Roxabi"';
