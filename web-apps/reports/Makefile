PORT ?= 8080
RUN_REGION ?= europe-west1
GCP_PROJECT ?= ag-edgekit-dev

install-deps:
	pip install -r requirements.txt 

run-local:
	uvicorn main:app --reload

gcloud-build:
	gcloud builds submit \
		--project $(GCP_PROJECT) \
		--tag gcr.io/$(GCP_PROJECT)/reports

gcloud-deploy:
	gcloud run deploy reports \
		--quiet \
		--project $(GCP_PROJECT) \
		--image gcr.io/$(GCP_PROJECT)/reports \
		--region $(RUN_REGION) \
		--platform managed \
		--allow-unauthenticated \
		--set-env-vars GCP_PROJECT=$(GCP_PROJECT)
