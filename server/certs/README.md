# Supabase public database CA

`supabase-root.crt` is the public Supabase Root 2021 CA, not a private key or credential. It expires on 26 April 2031. Keep this directory with the deployed server.

Source: the production download endpoint configured in [Supabase Studio's official source](https://github.com/supabase/supabase/blob/master/apps/studio/hooks/custom-content/custom-content.json):
`https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt`.

Database connections require TLS and verify the CA and hostname. URL parameters cannot disable verification. Rotate the CA through a reviewed update if Supabase changes it. See [Supabase SSL guidance](https://supabase.com/docs/guides/platform/ssl-enforcement).
