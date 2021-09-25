# Rails Kata

This is a little exercise with Rails and all its dependencies running in Docker containers.

It's using Rails 6.1.4 on Ruby 3.0.2 with PostgreSQL 13.4.

## Setup

The only system dependencies for development is Docker with Docker Compose and Make.

NOTE: I only tried this on an AMD64 Mac laptop, it might need some adjustments for ARM64. There might also be some issues on Windows (try with WSL2), but should work on Linux too.

## Development

To get everything going (Docker images built, database set up, app and webpacker running), just type:

```sh
make
```

Now you're ready to try it on http://localhost:3000!

NOTE: the containers are running in the background so you can close the logging output with Ctrl + C without killing the Rails server. You can reattach later with `make logs`.

### Testing

To run unit and system tests and watch changes with `autotest`, type:

```sh
make test logs
```

NOTE: this assumes you already ran `make` above and have the images built and database set up, otherwise you need to run:

```sh
make build db_reset test logs
```

## Deployment to Google Cloud Run

The project is set up with the configuration and scripts required to easily deploy the Rails application image as a container in Google Cloud Run with a Cloud SQL Postgres instance.

### Project and CLI setup

First, you need to:

1. [create a new project in GCP](https://console.cloud.google.com/projectselector2/home/dashboard) – note down the generated project ID
2. [enable billing](https://cloud.google.com/billing/docs/how-to/modify-project)
3. [enable the Cloud Run, Cloud SQL, and Compute Engine APIs](https://console.cloud.google.com/flows/enableapi?apiid=run.googleapis.com,sql-component.googleapis.com,sqladmin.googleapis.com,compute.googleapis.com)
4. [install the Cloud SDK](https://cloud.google.com/sdk/docs/install) (you'll need the `gcloud` CLI in particular)
5. authenticate `gcloud` with the Google account used for creating the project using `gcloud auth login`

### Infrastructure setup

NOTE: this only works after the development setup step above is done as it'll use Rails in a container to set up the encrypted credentials. So if you skipped that, at least you should do:

```sh
make build
```

Due to the simplicity of this exercise, the infrastructure is set up with a series of `gcloud` commands rather than using Terraform or any other "proper" Infrastructure as Code tool. This also makes it simpler to automatically save a generated database password into the Rails credentials without having to save it in a file or to display it in the terminal. If you want to see the database password and other secrets decrypted, you can use `make show_secrets`.

Before you can run the scripts below, you need to set up some environment variables by typing:

```sh
sed "s/PROJECT_ID=/PROJECT_ID=<your-gcp-project-id>/g" env-template.sh > env.sh && chmod +x env.sh
```

Now you can set up the GCP infrastructure by typing:

```sh
gcloud_setup.sh
```

Then you're ready to build a release image and push it to Google Container Registry:

```sh
make release_build
make release_push
```

And finally push a deployment out to Cloud Run:

```sh
MIGRATE=true DB_SEED=true deploy.sh
```

### Possible improvements

* Store precompiled assets in a bucket and serve from there with a CDN front
* Move Rails Master key to some key management system like Google Secrets Manager
* Switch to Redis for Action Cable in production (currently using Postgres)
* Find out if it's possible to stop Turbolinks from replacing React HTML and only used the cached version – though it might be better to switch to Turbo instead as Turbolinks isn't supported any more
* Replace JBuilder templates as apparently partial rendering is really slow
