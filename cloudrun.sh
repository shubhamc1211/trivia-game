cd frontend
npm run build

cd ..
cd CloudRun
rm -rf build
cp -r ../frontend/build .

docker compose build
docker push us-central1-docker.pkg.dev/trivia-titans-sdp32/frontend-repo/frontend:latest

gcloud run deploy frontend --image us-central1-docker.pkg.dev/trivia-titans-sdp32/frontend-repo/frontend:latest --platform managed --region us-central1 --allow-unauthenticated --memory 512Mi --concurrency 80 --timeout 900s --port 3000

echo "Frontend deployed to Cloud Run: https://frontend-bqjaztpeya-uc.a.run.app/"