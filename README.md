# Rails Kata

This is a little exercise with Rails and all its dependencies running in Docker containers.

It's using Rails 6.1.4 on Ruby 3.0.2 with PostgreSQL 13.4.

## Setup

The only system dependecies for development is Docker with Docker Compose and Make.

NOTE: I only tried this on an AMD64 Mac laptop, it might need some adjustments for ARM64. There might also be some issues on Windows (try with WSL2), but should work on Linux too.

## Development

To get everything going (Docker images built, database set up, app and tests running), just type:

```sh
make
```

Then in a separate terminal window set the database up:

```sh
make rails -- db:setup
make rails -- db:migrate
make rails -- db:fixtures:load
```

Now you're ready to try it on http://localhost:3000!

## Deployment to Google Cloud Run

The project is set up with the configuration and scripts required to easily deploy the Rails application image as a container in Google Cloud Run with a Cloud SQL Postgres instance.

### Project and CLI setup

First, you need to:
1. [create a new project in GCP](https://console.cloud.google.com/projectselector2/home/dashboard) – note down the generated project ID and number
2. [enable billing](https://cloud.google.com/billing/docs/how-to/modify-project)
3. [enable the Cloud Run, Cloud SQL, and Compute Engine APIs](https://console.cloud.google.com/flows/enableapi?apiid=run.googleapis.com,sql-component.googleapis.com,sqladmin.googleapis.com,compute.googleapis.com)
4. [install the Cloud SDK](https://cloud.google.com/sdk/docs/install) (you'll need the `gcloud` CLI in particular)
5. authenticate `gcloud` with the Google account used for creating the project using `gcloud auth login`

### Infrastructure setup

NOTE: this only works after the development setup step above is done as it'll use Rails in a container to set up the encrypted credentials. So if you skipped that, at least you should do:

```sh
make build
```

Due to the simplicity of this exercise, the infrastructure is set up with a series of `gcloud` commands rather than using Terraform or any other "proper" Infrastructure as Code tool.

Once you've finished with the project and CLI setup, you can set the rest up by typing:

```sh
PROJECT_ID=<your-project-id> PROJECT_NUMBER=<your-project-number> gcloud_setup.sh
```

Now you're ready to build a release image (the APP_VERSION needs to be incremented for subsequent releases):

```sh
DOCKER_IMAGE=gcr.io/<your-project-id>/rails-app make release_build
APP_VERSION=0.0.1 DOCKER_IMAGE=gcr.io/<your-project-id>/rails-app make release_push
```

And finally push a deployment out:

```sh
PROJECT_ID=<your-project-id> APP_VERSION=0.0.1 MIGRATE=true deploy.sh
```

### Possible improvements

* Store precompiled assets in a bucket and serve from there
* Move Rails Master key to some key management system
