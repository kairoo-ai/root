# Deploy the compute service to a HuggingFace Docker Space

## Prerequisites
- Free HF account (no card required). https://huggingface.co/join
- Your Neon DATABASE_URL connection string
- A long random COMPUTE_SHARED_SECRET (generate with: `openssl rand -hex 32`)

## Steps

1. Create a new Space at https://huggingface.co/new-space
   - SDK: **Docker**
   - Name: `kairoo-compute` (or any name)
   - Hardware: **CPU Basic** (free, no card)
   - Visibility: **Public**

2. Push the `compute/` directory to the Space repo:
   ```bash
   git clone https://huggingface.co/spaces/<your-username>/kairoo-compute hf-space
   cp -r compute/* hf-space/
   cd hf-space && git add -A && git commit -m "deploy compute service" && git push
   ```
   (Or use the Space web "Files" tab to upload files.)

3. In the Space → **Settings** → **Variables and secrets**, add:
   - `COMPUTE_SHARED_SECRET` — the random secret from Prerequisites
   - `DATABASE_URL` — your Neon connection string
   - `MODEL_NAME` — `BAAI/bge-small-en-v1.5`
   - `ALLOWED_ORIGIN` — your Next.js app origin (e.g. `https://kairoo.app`)

4. The Space builds the Docker image and starts. First build takes ~5 minutes (torch layer).
   Monitor progress in Space → **Logs**.

5. Verify the Space is live:
   ```bash
   curl https://<your-username>-kairoo-compute.hf.space/health
   # Expected: {"status":"ok","model_loaded":true}
   ```

6. Set env vars in the Next.js app:
   - `.env.local` (local dev) and your host (Vercel/Railway/etc):
     ```
     COMPUTE_SERVICE_URL=https://<your-username>-kairoo-compute.hf.space
     COMPUTE_SHARED_SECRET=<same secret as above>
     ```

7. Set the GitHub repo secret for the keep-warm pinger:
   - GitHub → Settings → Secrets → Actions → New repository secret
   - Name: `COMPUTE_SERVICE_URL`
   - Value: `https://<your-username>-kairoo-compute.hf.space`

8. Smoke test the embed endpoint:
   ```bash
   curl -fsS -X POST "$COMPUTE_SERVICE_URL/v1/embed" \
     -H "Authorization: Bearer $COMPUTE_SHARED_SECRET" \
     -H "Content-Type: application/json" \
     -d '{"texts":["python data engineer"]}' | head -c 300
   # Expected: JSON with "dim":384 and a 384-length vector array
   ```

9. Smoke test the backfill endpoint (idempotency check):
   ```bash
   curl -fsS -X POST "$COMPUTE_SERVICE_URL/v1/embed/backfill" \
     -H "Authorization: Bearer $COMPUTE_SHARED_SECRET" \
     -H "Content-Type: application/json" \
     -d '{"items":[{"entity_type":"smoke","entity_id":"1","text":"hello"}]}'
   # Expected: {"processed":1,"changed":1}
   # Run the same command again → {"processed":1,"changed":0}  (idempotent)
   ```

10. Once steps 5–9 pass, flip `computeEnabled` to `true` in `config/flags.ts`.

## Troubleshooting

- **Space sleeping:** Spaces sleep after ~48h inactivity. The keep-warm GitHub Action pings `/health` every 10 minutes.
- **Model not loaded:** Check the Space build logs. The `BAAI/bge-small-en-v1.5` model is downloaded at first startup (~130MB).
- **401 on /v1/embed:** Check that `COMPUTE_SHARED_SECRET` matches between Space secrets and `.env.local`.
- **pgvector extension not found:** Run the migration: `npm run db:push` (or manually apply `data/migrations/0005_*.sql`).
